import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { num: 1, title: "Sign Up & Assess", desc: "Complete a quick mental health assessment to understand your emotional state." },
  { num: 2, title: "Get Matched", desc: "Browse and connect with counselors based on your needs, availability, and preferences." },
  { num: 3, title: "Book & Talk", desc: "Attend secure video or chat sessions from anywhere." },
  { num: 4, title: "Track Improvement", desc: "Monitor your mental progress with easy-to-understand graphs and reports." },
];

export function HowItWorksSection() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-sm font-medium text-primary mb-2">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
            Your Journey to{" "}
            <span className="font-serif italic font-normal text-primary">Better<br />Mental Health</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Card key={step.num} className={`rounded-2xl border-0 shadow-sm ${step.num % 2 === 0 ? 'bg-primary/10' : 'bg-card'}`}>
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-full border-2 border-primary/30 flex items-center justify-center text-sm font-bold text-primary mb-4">
                  {step.num}
                </div>
                <h3 className="font-display font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
