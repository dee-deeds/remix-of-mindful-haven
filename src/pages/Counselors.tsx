import { useState } from "react";
import { Star, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const specializations = ["All", "Anxiety & Stress", "Depression", "Relationships", "Academic", "Trauma", "Addiction"];

const counselors = [
  { id: 1, name: "Dr. Elena Rodriguez", spec: "Clinical Psychologist • Anxiety Specialist", rating: 4.9, sessions: 128, tags: ["LGBTQ+ Affirming", "Bilingual"], variant: "default" },
  { id: 2, name: "Marcus Thorne, MSW", spec: "Social Worker • ADHD & Executive Function", rating: 5.0, sessions: 84, tags: [], desc: "Specializing in helping students navigate the transition to university life.", variant: "pink" },
  { id: 3, name: "Sarah Jenkins, LPC", spec: "Counselor • Holistic Wellness", rating: 4.8, sessions: 210, tags: ["Mindfulness", "Evening Avail."], variant: "default" },
  { id: 4, name: "Dr. David Chen", spec: "Psychiatrist • Performance Anxiety", rating: 4.9, sessions: 156, tags: ["Medication Mgmt", "Grad Students"], variant: "default" },
];

const locations = ["On-Campus", "Off-Campus (Downtown)", "Virtual Sessions"];
const availabilities = ["Today", "This Week", "Evening", "Weekend"];
const specializations = ["Anxiety", "Academic Stress", "LGBTQ+", "Grief"];
  { id: 1, name: "Dr. Elena Rodriguez", spec: "Clinical Psychologist • Anxiety Specialist", rating: 4.9, sessions: 128, tags: ["LGBTQ+ Affirming", "Bilingual"], variant: "default" },
  { id: 2, name: "Marcus Thorne, MSW", spec: "Social Worker • ADHD & Executive Function", rating: 5.0, sessions: 84, tags: [], desc: "Specializing in helping students navigate the transition to university life.", variant: "pink" },
  { id: 3, name: "Sarah Jenkins, LPC", spec: "Counselor • Holistic Wellness", rating: 4.8, sessions: 210, tags: ["Mindfulness", "Evening Avail."], variant: "default" },
  { id: 4, name: "Dr. David Chen", spec: "Psychiatrist • Performance Anxiety", rating: 4.9, sessions: 156, tags: ["Medication Mgmt", "Grad Students"], variant: "default" },
];

const locations = ["On-Campus", "Off-Campus (Downtown)", "Virtual Sessions"];
const availabilities = ["Today", "This Week", "Evening", "Weekend"];
const specializations = ["Anxiety", "Academic Stress", "LGBTQ+", "Grief"];

export default function Counselors() {
  const [activeSpec, setActiveSpec] = useState("All");

  const filtered = counselors.filter((c) => activeSpec === "All" || c.specialization === activeSpec);

  return (
    <div className="pt-20 min-h-screen">
      <div className="flex">
        {/* Filter Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 py-10 h-screen w-72 rounded-r-xl sticky top-20 bg-surface-container-low editorial-shadow overflow-y-auto">
          <div className="px-8 mb-4">
            <h3 className="text-lg font-bold font-headline mb-1">Refine Search</h3>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Find your balance</p>
          </div>
    <div className="pt-20 min-h-screen">
      <div className="flex">
        {/* Filter Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 py-10 h-screen w-72 rounded-r-xl sticky top-20 bg-surface-container-low editorial-shadow overflow-y-auto">
          <div className="px-8 mb-4">
            <h3 className="text-lg font-bold font-headline mb-1">Refine Search</h3>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Find your balance</p>
          </div>

          {/* Location */}
          <div className="px-8 flex flex-col gap-4">
            <label className="text-sm font-bold">Location</label>
            <div className="flex flex-col gap-2">
              {locations.map((loc) => (
                <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkedLocations.includes(loc)}
                    onChange={() => toggleLocation(loc)}
                    className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-foreground transition-colors">{loc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-[4px] bg-surface-container-high mx-8 rounded-full opacity-20" />

          {/* Availability */}
          <div className="px-8 flex flex-col gap-4">
            <label className="text-sm font-bold">Availability</label>
            <div className="grid grid-cols-2 gap-2">
              {availabilities.map((a) => (
                <button key={a} className="py-2 px-3 text-xs font-semibold rounded-full bg-card text-primary border border-primary/10 hover:bg-primary-fixed transition-colors">
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[4px] bg-surface-container-high mx-8 rounded-full opacity-20" />

          {/* Specialization */}
          <div className="px-8 flex flex-col gap-4">
            <label className="text-sm font-bold">Specialization</label>
            <div className="flex flex-wrap gap-2">
              {specializations.map((s) => (
                <span key={s} className="px-3 py-1 bg-primary-fixed text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
          {/* Location */}
          <div className="px-8 flex flex-col gap-4">
            <label className="text-sm font-bold">Location</label>
            <div className="flex flex-col gap-2">
              {locations.map((loc) => (
                <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkedLocations.includes(loc)}
                    onChange={() => toggleLocation(loc)}
                    className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-foreground transition-colors">{loc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-[4px] bg-surface-container-high mx-8 rounded-full opacity-20" />

          {/* Availability */}
          <div className="px-8 flex flex-col gap-4">
            <label className="text-sm font-bold">Availability</label>
            <div className="grid grid-cols-2 gap-2">
              {availabilities.map((a) => (
                <button key={a} className="py-2 px-3 text-xs font-semibold rounded-full bg-card text-primary border border-primary/10 hover:bg-primary-fixed transition-colors">
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[4px] bg-surface-container-high mx-8 rounded-full opacity-20" />

          {/* Specialization */}
          <div className="px-8 flex flex-col gap-4">
            <label className="text-sm font-bold">Specialization</label>
            <div className="flex flex-wrap gap-2">
              {specializations.map((s) => (
                <span key={s} className="px-3 py-1 bg-primary-fixed text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto px-6 mb-8">
            <Button variant="secondary" className="w-full rounded-full bg-inverse-surface text-inverse-on-surface hover:opacity-90">
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-10">
          <header className="mb-12 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-6">
              Professional <span className="text-primary italic">Support</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Every journey starts with a safe space. Browse our directory of university-vetted professionals dedicated to your mental well-being and academic success.
            </p>
          </header>

          {/* Counselor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {counselors.map((c) => (
              <div
                key={c.id}
                className={`group relative flex flex-col rounded-xl p-6 editorial-shadow hover:-translate-y-1 transition-all duration-300 ${
                  c.variant === "pink" ? "bg-primary-fixed" : "bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-surface-container-high flex items-center justify-center text-2xl font-bold text-primary font-headline">
                      {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary w-6 h-6 rounded-full border-4 border-card flex items-center justify-center">
                      <span className="text-primary-foreground text-[8px] font-bold">✓</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-sm font-bold">{c.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{c.sessions} Sessions</span>
                  </div>
          <div className="mt-auto px-6 mb-8">
            <Button variant="secondary" className="w-full rounded-full bg-inverse-surface text-inverse-on-surface hover:opacity-90">
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-10">
          <header className="mb-12 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-6">
              Professional <span className="text-primary italic">Support</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Every journey starts with a safe space. Browse our directory of university-vetted professionals dedicated to your mental well-being and academic success.
            </p>
          </header>

          {/* Counselor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {counselors.map((c) => (
              <div
                key={c.id}
                className={`group relative flex flex-col rounded-xl p-6 editorial-shadow hover:-translate-y-1 transition-all duration-300 ${
                  c.variant === "pink" ? "bg-primary-fixed" : "bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-surface-container-high flex items-center justify-center text-2xl font-bold text-primary font-headline">
                      {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary w-6 h-6 rounded-full border-4 border-card flex items-center justify-center">
                      <span className="text-primary-foreground text-[8px] font-bold">✓</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-sm font-bold">{c.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{c.sessions} Sessions</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-headline mb-1">{c.name}</h3>
                <p className="text-primary text-sm font-medium mb-4">{c.spec}</p>

                {c.desc && (
                  <p className="text-sm text-on-surface-variant/80 mb-4 line-clamp-2">{c.desc}</p>
                )}

                {c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[10px] font-bold rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {user ? (
                  <Link to="/booking" className="mt-auto">
                    <Button className="w-full rounded-full font-headline">Book Appointment</Button>
                  </Link>
                ) : (
                  <Button onClick={handleBook} variant="outline" className="w-full rounded-full font-headline mt-auto">
                    Sign in to Book
                  </Button>
                )}

                <h3 className="text-xl font-bold font-headline mb-1">{c.name}</h3>
                <p className="text-primary text-sm font-medium mb-4">{c.spec}</p>

                {c.desc && (
                  <p className="text-sm text-on-surface-variant/80 mb-4 line-clamp-2">{c.desc}</p>
                )}

                {c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[10px] font-bold rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {user ? (
                  <Link to="/booking" className="mt-auto">
                    <Button className="w-full rounded-full font-headline">Book Appointment</Button>
                  </Link>
                ) : (
                  <Button onClick={handleBook} variant="outline" className="w-full rounded-full font-headline mt-auto">
                    Sign in to Book
                  </Button>
                )}
              </div>

              <Link to="/dashboard/booking">
                <Button className="w-full rounded-xl font-display gap-2">
                  <Calendar className="h-4 w-4" /> Book Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
