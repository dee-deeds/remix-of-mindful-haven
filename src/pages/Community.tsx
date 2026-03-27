import { useState } from "react";
import { Heart, MessageCircle, Share2, Send, EyeOff, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { LoginPrompt } from "@/components/LoginPrompt";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const topics = ["#All Threads", "#Anxiety", "#StudyTips", "#Burnout", "#GradLife", "#SelfCare"];

const initialPosts = [
  {
    id: 1,
    author: "Anonymous Student",
    isAnon: true,
    content: "It feels like every professor decided to schedule their big project or exam for the same three days. I haven't slept more than 4 hours a night this week. Is anyone else feeling this or do I just need to manage my time better?",
    title: "Feeling overwhelmed with midterms and don't know where to start?",
    likes: 124,
    replies: 42,
    time: "2 hours ago",
    tag: "#Burnout",
  },
  {
    id: 2,
    author: "Jordan M.",
    isAnon: false,
    content: "Found this amazing Lo-fi ambient mix that actually helps with my ADHD. Sharing for anyone who needs to drown out the library noise.",
    title: 'My "Focus Flow" playlist for deep work sessions',
    likes: 215,
    replies: 18,
    time: "5 hours ago",
    tag: "#StudyTips",
  },
];

const trendingTopics = [
  { tag: "#SleepHygiene", posts: 89 },
  { tag: "#ScholarshipHelp", posts: 54 },
  { tag: "#FirstYearAnxiety", posts: 120 },
];

function CommunityContent() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();

  const handlePost = () => {
    if (!user) { setShowLogin(true); return; }
    if (!newPost.trim()) return;
    setPosts([
      { id: Date.now(), author: isAnonymous ? "Anonymous" : "You", isAnon: isAnonymous, content: newPost, title: "", likes: 0, replies: 0, time: "Just now", tag: "#General" },
      ...posts,
    ]);
    setNewPost("");
  };

  const toggleLike = (id: number) => {
    if (!user) { setShowLogin(true); return; }
    setLikedPosts((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: likedPosts.includes(id) ? p.likes - 1 : p.likes + 1 } : p));
  };

  return (
    <div className="max-w-5xl px-4 md:px-12 py-8">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-4">
            The <span className="text-primary">Shared</span> Space
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A safe, anonymous sanctuary for university students to connect, share experiences, and find mutual support. Your voice is heard here.
          </p>
        </div>
        <Button
          onClick={() => { if (!user) setShowLogin(true); }}
          className="bg-inverse-surface text-inverse-on-surface rounded-full px-8 py-4 font-headline gap-2 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Start Discussion
        </Button>
      </header>

      {/* Topic Filters */}
      <section className="mb-10 flex flex-wrap gap-3 items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-2">Topics:</span>
        {topics.map((topic) => (
          <button
            key={topic}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              topic === "#All Threads"
                ? "bg-primary-fixed text-primary"
                : "bg-surface-container text-muted-foreground hover:bg-secondary-container"
            }`}
          >
            {topic}
          </button>
        ))}
      </section>

      {/* Forum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Posts */}
        <div className="md:col-span-8 space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-card p-8 rounded-xl editorial-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-muted-foreground">
                    {post.isAnon ? "👤" : post.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{post.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.time} in <span className="text-primary font-medium">{post.tag}</span>
                    </p>
                  </div>
                </div>
              </div>
              {post.title && (
                <h3 className="text-xl font-headline font-bold mb-4 leading-tight">{post.title}</h3>
              )}
              <p className="text-muted-foreground leading-relaxed mb-8">{post.content}</p>
              <div className="flex items-center gap-6 pt-6 border-t border-surface-container">
                <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className={`h-4 w-4 ${user && likedPosts.includes(post.id) ? "fill-primary text-primary" : ""}`} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" /> {post.replies}
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-muted-foreground/80 transition-colors ml-auto">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-8">
          {/* Weekly Tip */}
          <div className="bg-primary-fixed p-6 rounded-xl">
            <h4 className="text-lg font-bold font-headline mb-3 flex items-center gap-2">
              💡 Weekly Tip
            </h4>
            <p className="text-sm text-on-surface-variant leading-relaxed opacity-90">
              Try the 5-4-3-2-1 technique if you're feeling a spike in anxiety during study sessions. It grounds you in the present moment.
            </p>
            <Link to="/resources" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Read Guide
            </Link>
          </div>

          {/* Trending */}
          <div className="bg-surface-container-low p-6 rounded-xl">
            <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">Trending Topics</h4>
            <ul className="flex flex-col gap-4">
              {trendingTopics.map((t) => (
                <li key={t.tag} className="flex items-center justify-between group">
                  <span className="font-medium group-hover:text-primary transition-colors">{t.tag}</span>
                  <span className="text-xs text-muted-foreground">{t.posts} posts</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Guidelines */}
          <div className="bg-inverse-surface text-inverse-on-surface p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                ✅
              </div>
              <div>
                <p className="text-sm font-bold">Community Moderator</p>
                <p className="text-xs text-inverse-on-surface/60">Pinned Post</p>
              </div>
            </div>
            <h3 className="text-xl font-headline font-bold mb-4 text-primary-container">Safe Space Guidelines</h3>
            <p className="text-sm text-inverse-on-surface/70 leading-relaxed mb-6">
              Remember to keep discussions supportive. We utilize AI-moderation alongside human review to ensure no hate speech or toxic behavior disrupts our sanctuary.
            </p>
            <Button variant="outline" className="w-full rounded-full text-xs font-bold uppercase tracking-widest border-white/20 text-inverse-on-surface hover:bg-white/10">
              View Rules
            </Button>
          </div>
        </div>
      </div>

      {/* Load More */}
      <div className="mt-16 flex justify-center">
        <button className="group flex flex-col items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
            Load More Conversations
          </span>
        </button>
      </div>

      <LoginPrompt open={showLogin} onOpenChange={setShowLogin} action="participate in the community" />
    </div>
  );
}

export default function Community() {
  const { user } = useAuth();

  if (user) {
    return (
      <DashboardLayout>
        <CommunityContent />
      </DashboardLayout>
    );
  }

  return (
    <div className="pt-20">
      <CommunityContent />
    </div>
  );
}
