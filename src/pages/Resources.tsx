import { useState } from "react";
import { Search, Bookmark, BookmarkCheck, Play, FileText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Anxiety", "Depression", "Academic Stress", "Sleep Hygiene"];
const formats = ["All", "Articles", "Videos", "Podcasts"];
const categories = ["All", "Anxiety", "Depression", "Academic Stress", "Sleep Hygiene"];
const formats = ["All", "Articles", "Videos", "Podcasts"];

const resources = [
  { id: 1, title: "Understanding Anxiety: A Student's Guide", category: "Anxiety", type: "article", desc: "Learn about anxiety symptoms, triggers, and coping mechanisms specifically for university students.", readTime: "5 min" },
  { id: 2, title: "5-Minute Breathing Exercise", category: "Self-Care", type: "video", desc: "A guided breathing technique to help you calm down during stressful moments.", readTime: "5 min" },
  { id: 3, title: "Dealing with Academic Pressure", category: "Academic Stress", type: "article", desc: "Practical tips for managing workload, deadlines, and exam anxiety.", readTime: "8 min" },
  { id: 4, title: "Signs of Depression in Young Adults", category: "Depression", type: "article", desc: "Recognize the early signs and know when to seek professional help.", readTime: "6 min" },
  { id: 5, title: "Healthy Relationship Boundaries", category: "Relationships", type: "article", desc: "Setting and maintaining healthy boundaries in friendships and romantic relationships.", readTime: "7 min" },
  { id: 6, title: "Mindfulness Meditation for Beginners", category: "Self-Care", type: "video", desc: "Start your mindfulness journey with this beginner-friendly guided meditation.", readTime: "10 min" },
  { id: 7, title: "Coping with Loneliness at Campus", category: "Relationships", type: "article", desc: "Strategies for building connections and overcoming feelings of isolation.", readTime: "5 min" },
  { id: 8, title: "Exam Season Survival Guide", category: "Academic Stress", type: "article", desc: "A comprehensive guide to maintaining your mental health during exam periods.", readTime: "10 min" },
  { id: 9, title: "Progressive Muscle Relaxation", category: "Anxiety", type: "video", desc: "Step-by-step video guide to reduce physical tension caused by anxiety.", readTime: "12 min" },
];

export default function Resources() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFormat, setActiveFormat] = useState("All");
  const [activeFormat, setActiveFormat] = useState("All");
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  const filtered = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesFormat = activeFormat === "All" || r.type === activeFormat.slice(0, -1);
    return matchesSearch && matchesCategory && matchesFormat;
    const matchesFormat = activeFormat === "All" || r.type === activeFormat.slice(0, -1);
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const featuredResource = filtered.find((r) => r.featured);
  const regularResources = filtered.filter((r) => !r.featured);

  const featuredResource = filtered.find((r) => r.featured);
  const regularResources = filtered.filter((r) => !r.featured);

  return (
    <div className="pt-28 pb-20 px-6 md:px-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="mb-16">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-4 max-w-3xl">
          Curated headspace for your academic journey.
        </h1>
        <p className="text-on-surface-variant text-xl max-w-xl">
          Explore our library of evidence-based resources, designed to support university students through every season.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-10">
          <section>
            <h3 className="font-headline text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-6">Search Library</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Topics or titles..."
                className="pl-12 rounded-xl bg-surface-container-high border-none"
              />
            </div>
          </section>

          <section>
            <h3 className="font-headline text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-6">Categories</h3>
            <div className="flex flex-col gap-1">
              {categories.filter(c => c !== "All").map((cat) => (
                <label key={cat} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-fixed cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={activeCategory === cat || activeCategory === "All"}
                    onChange={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium group-hover:text-primary">{cat}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-headline text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-6">Content Format</h3>
            <div className="flex flex-wrap gap-2">
              {formats.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFormat(f)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    activeFormat === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-primary-fixed"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {/* CTA Card */}
          <div className="bg-primary-fixed p-8 rounded-xl relative overflow-hidden">
            <h4 className="font-headline text-lg font-bold mb-2">Feeling Overwhelmed?</h4>
            <p className="text-on-surface-variant text-sm mb-6">Connect with a peer counselor today for immediate support.</p>
            <Button className="w-full rounded-full font-headline text-sm">Book Session</Button>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-8">
          {/* Regular resource cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularResources.slice(0, 2).map((resource) => (
              <article key={resource.id} className="group bg-card rounded-xl overflow-hidden editorial-shadow transition-all hover:-translate-y-1">
                <div className="aspect-video overflow-hidden relative bg-surface-container-high flex items-center justify-center">
                  <span className="text-6xl opacity-20">{resource.type === "Video" ? "🎬" : "📝"}</span>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {bookmarks.includes(resource.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  <div className="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
    <div className="pt-28 pb-20 px-6 md:px-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="mb-16">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-4 max-w-3xl">
          Curated headspace for your academic journey.
        </h1>
        <p className="text-on-surface-variant text-xl max-w-xl">
          Explore our library of evidence-based resources, designed to support university students through every season.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-10">
          <section>
            <h3 className="font-headline text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-6">Search Library</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Topics or titles..."
                className="pl-12 rounded-xl bg-surface-container-high border-none"
              />
            </div>
          </section>

          <section>
            <h3 className="font-headline text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-6">Categories</h3>
            <div className="flex flex-col gap-1">
              {categories.filter(c => c !== "All").map((cat) => (
                <label key={cat} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-fixed cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={activeCategory === cat || activeCategory === "All"}
                    onChange={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium group-hover:text-primary">{cat}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-headline text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-6">Content Format</h3>
            <div className="flex flex-wrap gap-2">
              {formats.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFormat(f)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    activeFormat === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-primary-fixed"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {/* CTA Card */}
          <div className="bg-primary-fixed p-8 rounded-xl relative overflow-hidden">
            <h4 className="font-headline text-lg font-bold mb-2">Feeling Overwhelmed?</h4>
            <p className="text-on-surface-variant text-sm mb-6">Connect with a peer counselor today for immediate support.</p>
            <Button className="w-full rounded-full font-headline text-sm">Book Session</Button>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-8">
          {/* Regular resource cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularResources.slice(0, 2).map((resource) => (
              <article key={resource.id} className="group bg-card rounded-xl overflow-hidden editorial-shadow transition-all hover:-translate-y-1">
                <div className="aspect-video overflow-hidden relative bg-surface-container-high flex items-center justify-center">
                  <span className="text-6xl opacity-20">{resource.type === "Video" ? "🎬" : "📝"}</span>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {bookmarks.includes(resource.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  <div className="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                    {resource.type}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">{resource.category}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span className="text-xs text-muted-foreground">{resource.time}</span>
                  </div>
                  <h2 className="font-headline text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">{resource.title}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{resource.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Featured resource */}
          {featuredResource && (
            <article className="group bg-card rounded-xl overflow-hidden editorial-shadow transition-all hover:-translate-y-1">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 aspect-video md:aspect-auto bg-surface-container-high flex items-center justify-center relative">
                  <span className="text-8xl opacity-20">🎥</span>
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                    Featured Community Video
                  </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">{resource.category}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span className="text-xs text-muted-foreground">{resource.time}</span>
                  </div>
                  <h2 className="font-headline text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">{resource.title}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{resource.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Featured resource */}
          {featuredResource && (
            <article className="group bg-card rounded-xl overflow-hidden editorial-shadow transition-all hover:-translate-y-1">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 aspect-video md:aspect-auto bg-surface-container-high flex items-center justify-center relative">
                  <span className="text-8xl opacity-20">🎥</span>
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                    Featured Community Video
                  </div>
                </div>
                <button onClick={() => toggleBookmark(resource.id)} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Bookmark">
                  {bookmarks.includes(resource.id) ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
                </button>
              </div>
            </article>
          )}

          {/* More cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularResources.slice(2).map((resource) => (
              <article key={resource.id} className="group bg-card rounded-xl overflow-hidden editorial-shadow transition-all hover:-translate-y-1">
                <div className="aspect-video overflow-hidden relative bg-surface-container-high flex items-center justify-center">
                  <span className="text-6xl opacity-20">{resource.type === "Video" ? "🎬" : "📝"}</span>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {bookmarks.includes(resource.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  <div className="absolute bottom-4 left-4 bg-foreground px-3 py-1 rounded-full text-[10px] font-bold text-background uppercase tracking-widest">
                    {resource.type}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">{resource.category}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span className="text-xs text-muted-foreground">{resource.time}</span>
                  </div>
                  <h2 className="font-headline text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">{resource.title}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{resource.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center pt-10">
            <Button variant="outline" className="rounded-full px-10 font-headline gap-2">
              Load More Resources <ArrowRight className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
            </article>
          )}

          {/* More cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularResources.slice(2).map((resource) => (
              <article key={resource.id} className="group bg-card rounded-xl overflow-hidden editorial-shadow transition-all hover:-translate-y-1">
                <div className="aspect-video overflow-hidden relative bg-surface-container-high flex items-center justify-center">
                  <span className="text-6xl opacity-20">{resource.type === "Video" ? "🎬" : "📝"}</span>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {bookmarks.includes(resource.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  <div className="absolute bottom-4 left-4 bg-foreground px-3 py-1 rounded-full text-[10px] font-bold text-background uppercase tracking-widest">
                    {resource.type}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">{resource.category}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span className="text-xs text-muted-foreground">{resource.time}</span>
                  </div>
                  <h2 className="font-headline text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">{resource.title}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{resource.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center pt-10">
            <Button variant="outline" className="rounded-full px-10 font-headline gap-2">
              Load More Resources <ArrowRight className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground italic">No resources found. Try adjusting your search or filters.</p>
          <p className="text-muted-foreground italic">No resources found. Try adjusting your search or filters.</p>
        </div>
      )}

    </div>
  );
}
