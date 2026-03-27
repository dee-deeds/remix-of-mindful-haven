import { Phone, AlertTriangle, Heart, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const hotlines = [
  { name: "Kenya Red Cross", number: "1199", desc: "24/7 Emergency services" },
  { name: "Befrienders Kenya", number: "+254 722 178 177", desc: "Emotional support hotline" },
  { name: "Kenya Crisis Line", number: "0800 723 253", desc: "Toll-free crisis support" },
  { name: "JKUAT Student Counseling", number: "+254 67 5870001", desc: "Campus counseling services" },
];

const quickActions = [
  { label: "Call a Counselor", icon: Phone, href: "tel:+254722178177", style: "bg-destructive text-destructive-foreground hover:bg-destructive/90" },
  { label: "Text Support", icon: MessageCircle, href: "sms:+254722178177", style: "bg-primary text-primary-foreground hover:bg-primary/90" },
];

export default function Emergency() {
  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Urgent Header */}
      <div className="bg-destructive/10 border-b-2 border-destructive/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4 animate-pulse-gentle" />
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-2">You Matter. Help is Here.</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            If you or someone you know is in crisis, please reach out. You don't have to face this alone.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
          {quickActions.map((action) => (
            <a key={action.label} href={action.href}>
              <Button size="lg" className={`w-full rounded-2xl font-display text-lg h-16 gap-3 ${action.style}`}>
                <action.icon className="h-6 w-6" /> {action.label}
              </Button>
            </a>
          ))}
        </div>

        {/* Hotlines */}
        <h2 className="font-display text-2xl font-bold text-center mb-6">Emergency Hotlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          {hotlines.map((line) => (
            <Card key={line.name} className="rounded-2xl border-2 hover:border-destructive/30 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold">{line.name}</p>
                  <p className="text-sm text-muted-foreground">{line.desc}</p>
                  <a href={`tel:${line.number.replace(/\s/g, "")}`} className="text-sm text-destructive font-semibold hover:underline">
                    {line.number}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reassurance */}
        <Card className="rounded-2xl max-w-2xl mx-auto bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <Heart className="h-10 w-10 text-primary fill-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">Remember</h3>
            <p className="text-muted-foreground mb-4">
              Seeking help is a sign of strength, not weakness. You deserve support, and there are people who care about you deeply.
            </p>
            <a href="https://findahelpline.com/ke" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-xl gap-2">
                Find More Resources <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
