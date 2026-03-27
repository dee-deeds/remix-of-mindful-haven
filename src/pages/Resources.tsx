import { useState } from "react";
import { Search, Bookmark, BookmarkCheck, Play, FileText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Anxiety", "Depression", "Academic Stress", "Relationships", "Self-Care"];

const resources = [
  { id: 1, title: "Understanding Anxiety: A Student's Guide", category: "Anxiety", type: "article", desc: "Learn about anxiety symptoms, triggers, and coping mechanisms specifically for university students.", readTime: "5 min" },
  { id: 2, title: "5-Minute Breathing Exercise", category: "Self-Care", type: "video", desc: "A guided breathing technique to help you calm down during stressful moments.", readTime: "5 min" },
  { id: 3, title: "Dealing with Academic Pressure", category: "Academic Stress", type: "article", desc: "Practical tips for managing workload, deadlines, and exam anxiety at JKUAT.", readTime: "8 min" },
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
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  const filtered = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Resource Library</h1>
        <p className="text-muted-foreground">Explore articles, videos, and guides to support your mental health journey.</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="pl-10 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((resource) => (
          <Card key={resource.id} className="rounded-2xl hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {resource.category}
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs gap-1">
                    {resource.type === "video" ? <Play className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                    {resource.type}
                  </Badge>
                </div>
                <button
                  onClick={() => toggleBookmark(resource.id)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={bookmarks.includes(resource.id) ? "Remove bookmark" : "Add bookmark"}
                >
                  {bookmarks.includes(resource.id) ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              </div>
              <h3 className="font-display font-bold mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{resource.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{resource.readTime} read</span>
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  Read More <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No resources found. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
