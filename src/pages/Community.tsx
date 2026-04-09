import { useState } from "react";
import { Heart, MessageCircle, Share2, Shield, Send, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

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

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([
      { id: Date.now(), author: isAnonymous ? "Anonymous" : "You", isAnon: isAnonymous, content: newPost, title: "", likes: 0, replies: 0, time: "Just now", tag: "#General" },
      { id: Date.now(), author: isAnonymous ? "Anonymous" : "You", isAnon: isAnonymous, content: newPost, title: "", likes: 0, replies: 0, time: "Just now", tag: "#General" },
      ...posts,
    ]);
    setNewPost("");
  };

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: likedPosts.includes(id) ? p.likes - 1 : p.likes + 1 } : p));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Community Forum</h1>
        <p className="text-muted-foreground">A safe space to share, support, and connect. Be kind. Be you.</p>
      </div>

      {/* Guidelines */}
      <Card className="rounded-2xl mb-6 border-calm/30 bg-calm/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-calm mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Community Guidelines:</strong> This is a safe, judgment-free zone. Be respectful, supportive, and kind. If you or someone is in crisis, please visit our <a href="/dashboard/emergency" className="text-destructive font-medium hover:underline">Emergency page</a>.
          </div>
        </CardContent>
      </Card>

      {/* New Post - only fully usable when logged in */}
      <Card className="rounded-2xl mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Share What's on Your Mind</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            className="rounded-xl min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="anon" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              <Label htmlFor="anon" className="text-sm flex items-center gap-1">
                {isAnonymous ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {isAnonymous ? "Post anonymously" : "Post with name"}
              </Label>
            </div>
            <Button onClick={handlePost} className="rounded-xl gap-2">
              <Send className="h-4 w-4" /> Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts - read-only for guests */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                  {post.isAnon ? "?" : post.author[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              {post.title && (
                <h3 className="text-xl font-headline font-bold mb-4 leading-tight">{post.title}</h3>
              )}
              <p className="text-muted-foreground leading-relaxed mb-8">{post.content}</p>
              <div className="flex items-center gap-6 pt-6 border-t border-surface-container">
                <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              {post.title && (
                <h3 className="text-xl font-headline font-bold mb-4 leading-tight">{post.title}</h3>
              )}
              <p className="text-muted-foreground leading-relaxed mb-8">{post.content}</p>
              <div className="flex items-center gap-6 pt-6 border-t border-surface-container">
                <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className={`h-4 w-4 ${user && likedPosts.includes(post.id) ? "fill-primary text-primary" : ""}`} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="h-4 w-4" /> {post.replies}
                </button>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="h-4 w-4" /> Share
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

    </div>
  );
}
