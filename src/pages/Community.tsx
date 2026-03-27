import { useState } from "react";
import { Heart, MessageCircle, Share2, Shield, Send, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { LoginPrompt } from "@/components/LoginPrompt";

const initialPosts = [
  { id: 1, author: "Anonymous", isAnon: true, content: "I've been feeling overwhelmed with assignments this semester. Anyone else? How do you cope?", likes: 12, replies: 5, time: "2 hours ago", category: "Academic Stress" },
  { id: 2, author: "Hope_Finder", isAnon: false, content: "Just finished a counseling session and I feel so much better. If you're hesitating, please go. It really helps! 💗", likes: 28, replies: 8, time: "4 hours ago", category: "Support" },
  { id: 3, author: "Anonymous", isAnon: true, content: "Does anyone have tips for managing anxiety before exams? I can barely sleep these days.", likes: 15, replies: 11, time: "6 hours ago", category: "Anxiety" },
  { id: 4, author: "WellnessWarrior", isAnon: false, content: "Sharing a free meditation app that helped me: Insight Timer. It has great sessions for students. Give it a try!", likes: 22, replies: 3, time: "1 day ago", category: "Self-Care" },
  { id: 5, author: "Anonymous", isAnon: true, content: "I've been feeling really lonely on campus. It's hard to make friends when you're struggling internally.", likes: 35, replies: 14, time: "1 day ago", category: "Support" },
];

export default function Community() {
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
      { id: Date.now(), author: isAnonymous ? "Anonymous" : "You", isAnon: isAnonymous, content: newPost, likes: 0, replies: 0, time: "Just now", category: "General" },
      ...posts,
    ]);
    setNewPost("");
  };

  const toggleLike = (id: number) => {
    if (!user) { setShowLogin(true); return; }
    setLikedPosts((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: likedPosts.includes(id) ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleInteraction = () => {
    if (!user) { setShowLogin(true); return; }
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
            <strong className="text-foreground">Community Guidelines:</strong> This is a safe, judgment-free zone. Be respectful, supportive, and kind. If you or someone is in crisis, please visit our <a href="/emergency" className="text-destructive font-medium hover:underline">Emergency page</a>.
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
            placeholder={user ? "How are you feeling? What's on your mind?" : "Sign in to share your thoughts..."}
            className="rounded-xl min-h-[100px]"
            onClick={() => { if (!user) setShowLogin(true); }}
            readOnly={!user}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="anon" checked={isAnonymous} onCheckedChange={setIsAnonymous} disabled={!user} />
              <Label htmlFor="anon" className="text-sm flex items-center gap-1">
                {isAnonymous ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {isAnonymous ? "Post anonymously" : "Post with name"}
              </Label>
            </div>
            <Button onClick={handlePost} className="rounded-xl gap-2">
              {user ? <Send className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {user ? "Post" : "Sign in to Post"}
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
                <Badge variant="secondary" className="rounded-full text-xs ml-auto">{post.category}</Badge>
              </div>
              <p className="text-sm mb-4">{post.content}</p>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Heart className={`h-4 w-4 ${user && likedPosts.includes(post.id) ? "fill-primary text-primary" : ""}`} />
                  {post.likes}
                </button>
                <button onClick={handleInteraction} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="h-4 w-4" /> {post.replies}
                </button>
                <button onClick={handleInteraction} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <LoginPrompt open={showLogin} onOpenChange={setShowLogin} action="participate in the community" />
    </div>
  );
}
