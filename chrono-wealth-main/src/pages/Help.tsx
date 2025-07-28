import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Help Center</h1>
            <p className="text-muted-foreground">Get support and learn how to use FlowSightFi</p>
          </div>

          <Card className="p-8 text-center">
            <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">How can we help?</h2>
            <p className="text-muted-foreground">Find answers, tutorials, and get support</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;