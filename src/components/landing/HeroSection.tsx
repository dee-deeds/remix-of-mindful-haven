import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  heroImg: string;
}

export function HeroSection({ heroImg }: Props) {
  const { user } = useAuth();

  return (
    <section className="relative bg-primary/10 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Gentle support for your{" "}
            <span className="font-serif italic font-normal text-primary">mind</span>
            <br />at your pace.
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
            Professional mental care designed to help you feel calmer, clearer, and supported wherever
            you are. It supports to help you rediscover peace, clarity, and emotional strength.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={user ? "/dashboard/counselors" : "/counselors"}>
              <Button size="lg" className="rounded-full font-display text-base px-8 gap-2">
                Talk To Counselor
              </Button>
            </Link>
            <Link to={user ? "/dashboard/booking" : "/signup"}>
              <Button size="lg" variant="outline" className="rounded-full font-display text-base px-8 gap-2">
                Book A Session <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero visual: meditation image flanked by stat cards */}
        <div className="relative flex items-center justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* Decorative sparkle */}
          <Sparkles className="absolute -top-6 left-1/3 h-6 w-6 text-primary/40 animate-pulse-gentle" />
          <Sparkles className="absolute top-0 right-1/4 h-5 w-5 text-primary/30" />

          {/* Stress Level card */}
          <div className="hidden sm:flex flex-col bg-card rounded-2xl p-4 shadow-md w-44 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Stress Level</span>
              <Heart className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Status: Low</span>
              <span className="text-lg font-bold text-primary">25%</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 65, 50, 80, 35, 55, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-primary/20" style={{ height: `${h}%` }}>
                  <div className="w-full rounded-sm bg-primary" style={{ height: `${Math.min(h, 60)}%` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Center meditation image */}
          <div className="w-56 md:w-72 shrink-0 rounded-2xl overflow-hidden shadow-lg">
            <img src={heroImg} alt="Person meditating peacefully" className="w-full h-auto object-cover" width={640} height={800} />
          </div>

          {/* Goal Progress card */}
          <div className="hidden sm:flex flex-col bg-card rounded-2xl p-4 shadow-md w-44 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Goal Progress</span>
              <Brain className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Status: Standard</span>
              <span className="text-lg font-bold text-primary">75%</span>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-primary/20" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="24.3" strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
