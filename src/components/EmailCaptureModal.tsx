import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Sparkles } from "lucide-react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  title?: string;
  description?: string;
}

export const EmailCaptureModal = ({ 
  isOpen, 
  onClose, 
  onSignUp,
  title = "Save Your Financial Future",
  description = "Enter your email to save this forecast and unlock personalized insights."
}: EmailCaptureModalProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSignUp();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background-card border-white/20 max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <p className="text-muted-foreground">{description}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!email}>
            Continue to FlowSightFi
          </Button>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-sm">
              Continue without saving
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-muted-foreground mt-4">
          No spam. No salespeople. Just your financial future.
        </div>
      </DialogContent>
    </Dialog>
  );
};