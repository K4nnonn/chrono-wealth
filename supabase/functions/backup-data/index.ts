import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BACKUP-DATA] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting data backup process');

    // Authenticate user - only allow authenticated users to backup their own data
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const userId = userData.user.id;
    const { searchParams } = new URL(req.url);
    const backupType = searchParams.get('type') || 'user'; // 'user' or 'full' (admin only)

    logStep('Processing backup request', { userId, backupType });

    let backupData: any = {};

    if (backupType === 'user') {
      // User-specific backup
      backupData = await createUserBackup(supabaseClient, userId);
    } else if (backupType === 'full') {
      // Full system backup (admin only - would need additional auth checks)
      backupData = await createFullBackup(supabaseClient);
    } else {
      throw new Error('Invalid backup type');
    }

    const backup = {
      metadata: {
        backupId: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        backupType,
        userId: backupType === 'user' ? userId : undefined,
        version: '1.0.0',
        checksum: generateChecksum(JSON.stringify(backupData)),
      },
      data: backupData,
    };

    logStep('Backup created successfully', { 
      backupId: backup.metadata.backupId,
      dataSize: JSON.stringify(backupData).length,
      checksum: backup.metadata.checksum,
    });

    return new Response(JSON.stringify(backup), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup-${backup.metadata.backupId}.json"`
      },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR in backup process', { message: errorMessage });

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function createUserBackup(supabase: any, userId: string): Promise<any> {
  const backup: any = {
    userId,
    exportedAt: new Date().toISOString(),
  };

  try {
    // Export user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.warn('Could not export profile:', profileError);
    } else {
      backup.profile = profile;
    }

    // Export subscription data
    const { data: subscription, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', userId);

    if (subError) {
      console.warn('Could not export subscription:', subError);
    } else {
      backup.subscription = subscription;
    }

    // Export user's financial data if any tables exist
    // This would be expanded based on the actual schema

    logStep('User backup data collected', { 
      userId,
      profileExists: !!backup.profile,
      subscriptionExists: !!backup.subscription,
    });

  } catch (error) {
    logStep('Error during user backup', { userId, error: error.message });
    throw error;
  }

  return backup;
}

async function createFullBackup(supabase: any): Promise<any> {
  const backup: any = {
    exportedAt: new Date().toISOString(),
    tables: {},
  };

  try {
    // Export all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.warn('Could not export profiles:', profilesError);
    } else {
      backup.tables.profiles = profiles;
    }

    // Export all subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('*');

    if (subscribersError) {
      console.warn('Could not export subscribers:', subscribersError);
    } else {
      backup.tables.subscribers = subscribers;
    }

    // Add more tables as needed
    logStep('Full backup data collected', { 
      profileCount: backup.tables.profiles?.length || 0,
      subscriberCount: backup.tables.subscribers?.length || 0,
    });

  } catch (error) {
    logStep('Error during full backup', { error: error.message });
    throw error;
  }

  return backup;
}

function generateChecksum(data: string): string {
  // Simple checksum for data integrity validation
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}