import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    text: "I finally found a place that doesn't feel like a hospital. The Sanctuary helped me navigate my finals without burning out.",
    name: "Elena R.",
    role: "Junior, Architecture",
  },
  {
    text: "The assessment tools were the wake-up call I needed. Booking a session through the directory was seamless and private.",
    name: "Marcus T.",
    role: "Senior, Psychology",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px] items-center py-12">
          <div className="lg:col-span-7 space-y-8">
            <span className="inline-block bg-primary-fixed text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest font-label">
              You're not alone
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold tracking-tighter text-foreground leading-[0.9]">
              Find your <span className="text-primary italic">still</span> in the storm.
            </h1>
            <p className="text-xl text-on-surface-variant font-body max-w-xl leading-relaxed">
              A curated digital space for university students to breathe, assess, and connect with compassionate support.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/emergency">
                <Button size="lg" className="rounded-full font-headline text-lg px-10 py-6 gap-3">
                  Get Help <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button size="lg" variant="secondary" className="rounded-full font-headline text-lg px-10 py-6 bg-secondary-container text-on-surface-variant hover:opacity-80">
                  Explore Resources
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-full min-h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-primary-fixed rounded-xl -rotate-3 scale-95 opacity-20" />
            <div className="relative w-full h-full rounded-lg overflow-hidden editorial-shadow bg-surface-container-low flex items-center justify-center">
              <div className="text-center p-12 space-y-4">
                <div className="w-32 h-32 rounded-full bg-primary-fixed mx-auto flex items-center justify-center animate-breathing">
                  <span className="text-4xl">🌿</span>
                </div>
                <p className="font-headline text-lg font-bold text-muted-foreground">Your sanctuary awaits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Toolkit */}
      <section className="px-6 md:px-8 max-w-7xl mx-auto py-16 space-y-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-bold">Mental Wellness Toolkit</h2>
          <p className="text-on-surface-variant text-lg">Tools designed for the student headspace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mood Tracker */}
          <div className="md:col-span-2 bg-primary-fixed rounded-xl p-10 flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-2xl font-headline font-bold mb-4">✨ Daily Pulse</h3>
              <p className="text-on-surface-variant text-lg max-w-sm mb-8">
                A private, safe space to log your emotions and see patterns over time.
              </p>
            </div>
            <div className="flex gap-4">
              {["✨", "😌", "☁️", "🌙", "⚡"].map((emoji) => (
                <div
                  key={emoji}
                  className="bg-card h-16 w-16 rounded-full flex items-center justify-center text-2xl editorial-shadow hover:scale-110 transition-transform cursor-pointer"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Self-Assessment */}
          <Link to="/login" className="block">
            <div className="bg-surface-container-low rounded-xl p-10 flex flex-col justify-between h-full border-t-4 border-primary">
              <div>
                <span className="text-3xl mb-6 block">📋</span>
                <h3 className="text-2xl font-headline font-bold mb-4">Self-Assessment</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Quick, validated screening tools for anxiety, depression, and stress.
                </p>
              </div>
              <p className="text-primary font-bold flex items-center gap-2 mt-6 font-headline">
                Start Assessment <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>

          {/* Find Counselor */}
          <Link to="/counselors" className="block">
            <div className="bg-inverse-surface text-inverse-on-surface rounded-xl p-10 flex flex-col justify-between min-h-[280px]">
              <div>
                <span className="text-3xl mb-6 block">👥</span>
                <h3 className="text-2xl font-headline font-bold mb-4">Find a Counselor</h3>
                <p className="opacity-80 leading-relaxed">
                  Match with professionals who specialize in student life and academic stress.
                </p>
              </div>
              <Button className="rounded-full font-headline mt-6 w-full">
                Browse Directory
              </Button>
            </div>
          </Link>

          {/* Resources */}
          <Link to="/resources" className="block md:col-span-2">
            <div className="relative rounded-xl overflow-hidden group bg-surface-container min-h-[250px] flex items-end">
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl opacity-20">📚</span>
              </div>
              <div className="relative p-10 z-10">
                <h3 className="text-2xl font-headline font-bold text-white mb-2">The Sanctuary Library</h3>
                <p className="text-white/80 max-w-md">Expert articles on sleep, focus, and boundary setting.</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-container py-24">
        <div className="px-6 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight">Voices of the Sanctuary</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="space-y-6">
                <p className="text-2xl md:text-3xl font-headline italic leading-snug text-on-surface-variant">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold font-label">{t.name}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-label">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breathing Widget */}
      <section className="px-6 md:px-8 max-w-5xl mx-auto py-16">
        <div className="bg-primary-fixed rounded-xl p-12 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[100px]" />
          </div>
          <h3 className="text-3xl font-headline font-bold relative z-10">Take a Moment to Breathe</h3>
          <div className="relative w-48 h-48 mx-auto z-10">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative w-full h-full rounded-full glass-panel flex items-center justify-center border-4 border-white">
              <span className="text-primary font-bold text-xl font-label">Inhale</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-lg relative z-10">Follow the pulse for 1 minute to ground yourself.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-8 max-w-4xl mx-auto py-16 text-center space-y-6">
        <h2 className="text-3xl font-headline font-bold">Ready to Find Your Balance?</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          Create a free account to access personalized resources, book counseling sessions, and track your wellbeing.
        </p>
        <Link to="/signup">
          <Button size="lg" className="rounded-full font-headline text-lg px-10 py-6 gap-3">
            Create Free Account <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
