import { Clock, Brain, Search, Shield, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Clock, title: "Care Reminders", desc: "Gentle reminders to help you stay consistent with sessions, routines.", highlight: false },
  { icon: Brain, title: "Mental Health Tracking", desc: "Track your mood and emotional progress with clear, visual insights.", highlight: true },
  { icon: Search, title: "Smart Assessments", desc: "Clinically informed assessments that help get your mental state.", highlight: false },
  { icon: Shield, title: "Privacy & Security", desc: "Your data and sessions are fully encrypted, confidential, kept private.", highlight: false },
];

export function FeaturesSection() {
  return (
    <section className="bg-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-2">Start your journey</p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-3">
            Everything You Need for{" "}
            <span className="font-serif italic font-normal text-primary">Mental<br />Well-Being</span>
          </h2>
          <p className="text-muted-foreground">Every mind deserves empathy.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <Card key={f.title} className={`rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow ${f.highlight ? 'bg-primary/15' : 'bg-card'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
