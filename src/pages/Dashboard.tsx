import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const moods = [
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Tired" },
  { emoji: "😰", label: "Anxious" },
];

const upcomingAppointments = [
  { month: "Oct", day: "12", title: "Wellness Coaching", time: "10:30 AM • Online Session" },
  { month: "Oct", day: "15", title: "Academic Support", time: "02:00 PM • Campus Hub" },
  { month: "Oct", day: "20", title: "Meditation Group", time: "09:00 AM • Yoga Studio" },
];

const recommendedResources = [
  { title: "Navigating Mid-Term Stress", type: "Article", desc: "Practical grounding techniques for when your study schedule feels overwhelming." },
  { title: "10-Minute Morning Ritual", type: "Video", desc: "A guided sequence to start your day with intention and mental clarity." },
];

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name || "Student";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 lg:pt-16">
        {/* Hero Greeting */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <span className="text-primary font-label uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
              Personal Workspace
            </span>
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-none text-foreground">
              Softly finding <br />
              <span className="text-primary">your balance</span>, {displayName}.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-muted-foreground max-w-xs ml-auto leading-relaxed">
              Today is a new canvas. Take a breath and notice how you feel in this moment.
            </p>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mood Tracker */}
          <div className="md:col-span-2 bg-primary-fixed rounded-xl p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="relative z-10 flex-1">
              <h3 className="font-headline text-3xl font-bold mb-4">How is your headspace?</h3>
              <p className="text-on-surface-variant mb-8 max-w-md">
                Tracking your mood helps identify patterns and triggers in your mental wellbeing journey.
              </p>
              <div className="flex flex-wrap gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood.label)}
                    className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors ${
                      selectedMood === mood.label
                        ? "bg-card text-primary editorial-shadow"
                        : "bg-white/40 text-on-surface-variant hover:bg-white/60"
                    }`}
                  >
                    {mood.emoji} {mood.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse border-4 border-white/30" />
              <div className="absolute inset-4 bg-white/30 rounded-full flex items-center justify-center text-center p-6">
                <span className="font-headline font-bold text-on-surface-variant leading-tight">Focus on breath</span>
              </div>
            </div>
          </div>

          {/* Quick Cards */}
          <div className="flex flex-col gap-6">
            <Link to="/community" className="block">
              <div className="bg-surface-container-low rounded-xl p-8 editorial-shadow transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mb-6 text-2xl">
                  👥
                </div>
                <h4 className="font-headline text-xl font-bold mb-2">Community Forum</h4>
                <p className="text-muted-foreground text-sm mb-6">Connect with peers who share your journey.</p>
                <span className="text-primary font-bold text-sm flex items-center gap-2">
                  Join conversation <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
            <Link to="/emergency" className="block">
              <div className="bg-inverse-surface text-inverse-on-surface rounded-xl p-8 editorial-shadow transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-2xl">
                  🆘
                </div>
                <h4 className="font-headline text-xl font-bold mb-2">Emergency Help</h4>
                <p className="text-inverse-on-surface/70 text-sm mb-6">Immediate 24/7 crisis support for students.</p>
                <Button className="w-full rounded-full font-headline">Get Support Now</Button>
              </div>
            </Link>
          </div>

          {/* Upcoming */}
          <div className="bg-card rounded-xl p-8 editorial-shadow">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-headline text-xl font-bold">Upcoming</h3>
              <Link to="/booking" className="text-primary font-bold text-xs uppercase tracking-widest">See All</Link>
            </div>
            <div className="space-y-8">
              {upcomingAppointments.map((apt, i) => (
                <div key={i} className={`flex gap-4 ${i === 2 ? "opacity-50" : ""}`}>
                  <div className="bg-secondary-container w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold font-label uppercase">{apt.month}</span>
                    <span className="text-xl font-extrabold leading-none">{apt.day}</span>
                  </div>
                  <div>
                    <h5 className="font-bold">{apt.title}</h5>
                    <p className="text-sm text-muted-foreground">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-2xl font-bold">Recommended for You</h3>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedResources.map((r, i) => (
                <Link to="/resources" key={i} className="group cursor-pointer">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 relative bg-surface-container-high flex items-center justify-center">
                    <span className="text-6xl opacity-30">{i === 0 ? "🧘" : "🌅"}</span>
                    <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
                      {r.type}
                    </div>
                  </div>
                  <h4 className="font-headline text-lg font-bold group-hover:text-primary transition-colors">{r.title}</h4>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2 leading-relaxed">{r.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
