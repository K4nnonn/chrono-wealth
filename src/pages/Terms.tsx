import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Terms and conditions for using FlowSightFi</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6 max-w-4xl">
              <section>
                <h2 className="text-xl font-semibold mb-3">Service Description</h2>
                <p className="text-muted-foreground">FlowSightFi provides AI-powered financial forecasting and simulation tools.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Disclaimer</h2>
                <p className="text-muted-foreground">Our forecasts are estimates for informational purposes only and should not be considered financial advice.</p>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;