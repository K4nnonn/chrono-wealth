import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your FlowSightFi preferences and account</p>
          </div>

          <div className="grid gap-6 max-w-2xl">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                <h3 className="font-semibold">Profile Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email notifications</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark mode</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" />
                <h3 className="font-semibold">Privacy & Security</h3>
              </div>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Export my data</Button>
                <Button variant="outline" className="w-full justify-start">Delete account</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;