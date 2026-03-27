import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const hotlines = [
  {
    icon: "📞",
    label: "Available 24/7",
    title: "National Crisis Line",
    desc: "Immediate, confidential support for people in distress, prevention and crisis resources.",
    number: "988",
    action: "CALL NOW",
    variant: "primary" as const,
    wide: true,
  },
  {
    icon: "💬",
    title: "Crisis Text Line",
    desc: "Prefer to type? Text a crisis counselor anytime for anonymous help.",
    number: "Text HOME to 741741",
    action: "Start Chat",
    variant: "secondary" as const,
  },
];

const secondaryCards = [
  { title: "International Help", desc: "Outside the US? Find your local emergency numbers and helpline directories.", action: "GLOBAL DIRECTORY 🌍" },
  { title: "Campus Safety", desc: "Direct line to university security services and on-campus emergency response.", number: "555-0199", sub: "Campus Extension 911" },
  { title: "Nearest Safe Space", desc: "Locate the closest walk-in counseling center or wellness sanctuary.", action: "OPEN MAP 📍" },
];

const steps = [
  { num: 1, title: "Compassionate Listening", desc: "You will be connected with a trained professional who is there to listen without judgment." },
  { num: 2, title: "Risk Assessment", desc: "They will help evaluate the situation and ensure you are in a safe environment." },
  { num: 3, title: "Action Plan", desc: "Together, you will create a plan for the next few hours to keep you safe and supported." },
];

export default function Emergency() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-12 px-6 lg:px-24">
      {/* Safe Exit */}
      <div className="fixed top-8 right-8 z-[100]">
        <Link to="/">
          <button className="bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full font-label text-sm font-bold tracking-tight hover:opacity-90 transition-all flex items-center gap-2 editorial-shadow">
            <X className="h-4 w-4" />
            SAFE EXIT
          </button>
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12 mb-20">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-primary font-label text-xs font-bold tracking-widest uppercase">
            ✦ Immediate Support Available
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
            You are not <br />
            <span className="text-primary italic">alone.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
            If you or someone you know is in immediate danger or experiencing a crisis, please use the resources below. Your safety is our absolute priority.
          </p>
          <div className="pt-4">
            <a href="tel:988">
              <Button size="lg" className="rounded-full font-headline text-xl px-10 py-6 gap-4 bg-gradient-to-r from-primary to-primary-container">
                Get Help Now <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="aspect-square rounded-xl overflow-hidden editorial-shadow bg-surface-container-low flex items-center justify-center relative">
            <div className="text-center p-8 space-y-4">
              <div className="w-32 h-32 rounded-full bg-primary-fixed mx-auto flex items-center justify-center animate-breathing">
                <span className="text-4xl">🌿</span>
              </div>
              <p className="font-headline text-lg font-bold text-muted-foreground">Breathe</p>
            </div>
          </div>
          {/* Floating element */}
          <div className="absolute -bottom-6 -left-6 glass-panel p-6 rounded-xl editorial-shadow max-w-[200px]">
            <p className="font-label text-xs font-bold text-primary mb-2 tracking-widest uppercase">Breathing Room</p>
            <div className="w-12 h-12 rounded-full border-2 border-primary-container flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary-fixed animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Hotline Grid */}
      <section className="max-w-6xl w-full mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary */}
          <div className="md:col-span-2 bg-card rounded-xl p-10 editorial-shadow flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-4xl">📞</span>
                <span className="font-label text-xs font-bold tracking-widest text-on-surface-variant uppercase">Available 24/7</span>
              </div>
              <h2 className="font-headline text-3xl font-bold mb-4 tracking-tight">National Crisis Line</h2>
              <p className="text-on-surface-variant mb-8 max-w-md">Immediate, confidential support for people in distress, prevention and crisis resources.</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-headline text-4xl font-extrabold">988</span>
              <div className="h-8 w-[2px] bg-surface-container-high rounded-full" />
              <a href="tel:988" className="text-primary font-bold font-label hover:underline underline-offset-8">CALL NOW</a>
            </div>
          </div>

          {/* Text support */}
          <div className="bg-secondary-container rounded-xl p-10 editorial-shadow flex flex-col justify-between min-h-[320px]">
            <div>
              <span className="text-4xl mb-8 block">💬</span>
              <h2 className="font-headline text-2xl font-bold mb-4 tracking-tight">Crisis Text Line</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">Prefer to type? Text a crisis counselor anytime for anonymous help.</p>
            </div>
            <div className="space-y-4">
              <p className="font-headline text-2xl font-bold">Text HOME to 741741</p>
              <Button variant="secondary" className="w-full rounded-full bg-card text-foreground font-headline">
                Start Chat
              </Button>
            </div>
          </div>

          {/* Secondary cards */}
          {secondaryCards.map((card) => (
            <div key={card.title} className="bg-surface-container-low rounded-xl p-10 flex flex-col justify-between min-h-[250px]">
              <div>
                <h3 className="font-headline text-xl font-bold mb-4 tracking-tight">{card.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{card.desc}</p>
              </div>
              {card.number ? (
                <div className="flex flex-col gap-2">
                  <span className="text-2xl font-bold font-headline">{card.number}</span>
                  <span className="text-xs font-label text-muted-foreground uppercase">{card.sub}</span>
                </div>
              ) : (
                <button className="flex items-center gap-2 text-primary font-bold font-label text-sm uppercase tracking-wider">
                  {card.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* What happens when I call */}
      <section className="max-w-4xl w-full py-16 px-8 bg-card rounded-xl border-t-4 border-primary editorial-shadow text-center mb-20">
        <h2 className="font-headline text-2xl font-bold mb-8">What happens when I call?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="space-y-3">
              <div className="w-10 h-10 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto font-bold">
                {step.num}
              </div>
              <p className="font-bold text-sm">{step.title}</p>
              <p className="text-xs text-on-surface-variant">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
