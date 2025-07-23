# FlowSightFi Deployment Guide

## 🚀 Vercel Deployment Instructions

### Prerequisites
1. Vercel account
2. OpenAI API key
3. Supabase project

### Step 1: Deploy to Vercel
```bash
# Fork/clone the repository
git clone [your-repo-url]
cd flowsightfi

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Step 2: Environment Variables
In your Vercel dashboard, add these environment variables:

**Required Variables:**
```
VITE_SUPABASE_URL=https://aqjcnnrijtivfcidrckr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxamNubnJpanRpdmZjaWRyY2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDE3MTAsImV4cCI6MjA2ODg3NzcxMH0.iL1p9zZZrM4zvzqwQ5IqTUIqY6_MbssSbvsIMACuLoQ
OPENAI_API_KEY=your_openai_api_key_here
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_key_here
PLAID_ENV=sandbox
```

**For Plaid Integration:**
- `PLAID_CLIENT_ID`: Get from [Plaid Dashboard](https://dashboard.plaid.com/team/keys)
- `PLAID_SECRET`: Get from [Plaid Dashboard](https://dashboard.plaid.com/team/keys)  
- `PLAID_ENV`: Use 'sandbox' for testing, 'development' for development, 'production' for live

### Step 3: Domain Configuration
1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### Step 4: Database Access
Your Supabase database is already configured and accessible. The RLS policies will work the same in production.

## 🔧 Local Development (Alternative to Lovable)

### Setup
```bash
# Clone repository
git clone [repo-url]
cd flowsightfi

# Install dependencies
npm install

# Create environment file
touch .env.local
```

### Environment Variables (.env.local)
```
VITE_SUPABASE_URL=https://aqjcnnrijtivfcidrckr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxamNubnJpanRpdmZjaWRyY2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDE3MTAsImV4cCI6MjA2ODg3NzcxMH0.iL1p9zZZrM4zvzqwQ5IqTUIqY6_MbssSbvsIMACuLoQ
OPENAI_API_KEY=your_openai_api_key_here
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_key_here
PLAID_ENV=sandbox
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture Differences

### Lovable vs Vercel Deployment

| Feature | Lovable | Vercel |
|---------|---------|---------|
| **AI Chat** | Supabase Edge Function | Vercel Edge Function |
| **Database** | Auto-connected Supabase | Manual env vars |
| **Deployment** | Automatic | Git-based |
| **Environment** | Built-in management | Manual setup |

### Key Changes Made for Vercel:
1. **Created Vercel Edge Function** (`api/financial-ai-chat.ts`) to replace Supabase function
2. **Updated AI Chat Component** to use `/api/` endpoint instead of Supabase
3. **Added Vercel Configuration** (`vercel.json`) with proper routing
4. **Enhanced Vite Config** with optimizations and aliases

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to git
- Use Vercel's secure environment variable system
- Rotate keys regularly

### Database Security
- RLS policies remain active in production
- User data is protected by Supabase auth
- All API calls require valid JWT tokens

## 📊 Performance Optimizations

### Bundle Splitting
```javascript
// Configured in vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
      ui: ['@radix-ui/react-dialog'],
      charts: ['recharts', 'd3']
    }
  }
}
```

### Edge Functions
- AI chat runs on Vercel Edge Runtime
- Global distribution for low latency
- Automatic scaling

## 🚨 Migration Checklist

### From Lovable to Vercel:
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Test AI chat functionality
- [ ] Verify database connections
- [ ] Set up custom domain
- [ ] Configure analytics (optional)
- [ ] Set up monitoring (optional)

### Ongoing Maintenance:
- [ ] Monitor API usage (OpenAI)
- [ ] Update dependencies regularly
- [ ] Backup database (Supabase handles this)
- [ ] Monitor performance metrics

## 🎯 Production Readiness

The application is production-ready with:
- ✅ **Secure authentication** via Supabase
- ✅ **AI-powered financial advice** via OpenAI
- ✅ **Real-time calculations** in browser
- ✅ **Responsive design** for all devices
- ✅ **Database backup** and security
- ✅ **Edge function scaling**

Your FlowSightFi application will work identically on Vercel as it does in Lovable!