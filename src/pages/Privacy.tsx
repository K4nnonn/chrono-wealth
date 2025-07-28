import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">How we protect and handle your data</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6 max-w-4xl">
              <section>
                <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
                <p className="text-muted-foreground">We collect only the financial data necessary to provide our forecasting services.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Data Security</h2>
                <p className="text-muted-foreground">Your data is encrypted and stored securely using bank-level security standards.</p>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;