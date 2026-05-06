import { useState, useEffect, useCallback } from "react";
import {
  Heart, MessageCircle, Share2, Shield, Send, Eye, EyeOff,
  BarChart2, Pencil, Trash2, ChevronDown, ChevronUp, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type PostRow = Database["public"]["Tables"]["community_posts"]["Row"];
type CommentRow = Database["public"]["Tables"]["community_comments"]["Row"];
type ShareRow = Database["public"]["Tables"]["community_shares"]["Row"];

interface Post extends PostRow {
  likes_count: number;
  comments_count: number;
  shares_count: number;
  user_liked: boolean;
}

const CATEGORIES = ["General", "Academic Stress", "Anxiety", "Support", "Self-Care", "Relationships"];
const FILTER_TABS = ["All", ...CATEGORIES];

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getDisplayName(user: User): string {
  return (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "User";
}

// ─── Insights Dialog ──────────────────────────────────────────────────────────

function InsightsDialog({ post, open, onClose }: { post: Post; open: boolean; onClose: () => void }) {
  const [sharers, setSharers] = useState<Pick<ShareRow, "sharer_name" | "created_at">[]>([]);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("community_shares")
      .select("sharer_name, created_at")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setSharers(data ?? []));
  }, [open, post.id]);

  const stats = [
    { label: "Likes", value: post.likes_count, emoji: "❤️" },
    { label: "Comments", value: post.comments_count, emoji: "💬" },
    { label: "Shares", value: post.shares_count, emoji: "🔁" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Post Insights</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground bg-muted/40 rounded-xl p-3 line-clamp-2">
          {post.content}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-muted/40 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className="font-display font-bold text-lg">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Shared by</p>
          {sharers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">No shares yet</p>
          ) : (
            <ScrollArea className="h-36">
              <div className="space-y-2 pr-2">
                {sharers.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {s.sharer_name ? s.sharer_name[0].toUpperCase() : "?"}
                    </div>
                    <span>{s.sharer_name ?? "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{timeAgo(s.created_at)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Comment Thread ───────────────────────────────────────────────────────────

function CommentThread({ postId, user }: { postId: string; user: User | null }) {
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [input, setInput] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setComments(data ?? []));
  }, [postId]);

  const submit = async () => {
    if (!input.trim() || !user) return;
    setSubmitting(true);
    const displayName = isAnon ? "Anonymous" : getDisplayName(user);
    const { data, error } = await supabase
      .from("community_comments")
      .insert({ post_id: postId, user_id: user.id, display_name: displayName, is_anonymous: isAnon, content: input.trim() })
      .select()
      .single();
    if (error) {
      toast({ title: "Error", description: "Could not post comment.", variant: "destructive" });
    } else {
      setComments((prev) => [...prev, data]);
      setInput("");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-3 pt-3 border-t space-y-3">
      {comments.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-1">No replies yet. Be first!</p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
            {c.is_anonymous ? "?" : c.display_name[0].toUpperCase()}
          </div>
          <div className="flex-1 bg-muted/40 rounded-xl px-3 py-2">
            <p className="text-xs font-medium">
              {c.display_name}{" "}
              <span className="text-muted-foreground font-normal">· {timeAgo(c.created_at)}</span>
            </p>
            <p className="text-sm mt-0.5">{c.content}</p>
          </div>
        </div>
      ))}

      {user ? (
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a reply..."
            className="rounded-xl min-h-[70px] text-sm"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id={`anon-comment-${postId}`} checked={isAnon} onCheckedChange={setIsAnon} />
              <Label htmlFor={`anon-comment-${postId}`} className="text-xs">
                {isAnon ? "Reply anonymously" : "Reply as " + getDisplayName(user)}
              </Label>
            </div>
            <Button size="sm" onClick={submit} disabled={submitting || !input.trim()} className="rounded-xl gap-1">
              <Send className="h-3 w-3" /> Reply
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-1">
          <a href="/login" className="text-primary underline">Sign in</a> to reply
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const [newPost, setNewPost] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("General");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [insightsPost, setInsightsPost] = useState<Post | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data: rawData, error } = await supabase
      .from("community_posts")
      .select("*, community_likes(count), community_comments(count), community_shares(count)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading posts", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    let likedIds = new Set<string>();
    if (user) {
      const { data: userLikes } = await supabase
        .from("community_likes")
        .select("post_id")
        .eq("user_id", user.id);
      likedIds = new Set((userLikes ?? []).map((l) => l.post_id));
    }

    const mapped: Post[] = (rawData ?? []).map((p: any) => ({
      ...p,
      likes_count: p.community_likes?.[0]?.count ?? 0,
      comments_count: p.community_comments?.[0]?.count ?? 0,
      shares_count: p.community_shares?.[0]?.count ?? 0,
      user_liked: likedIds.has(p.id),
    }));

    setPosts(mapped);
    setLoading(false);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !user) return;
    setSubmitting(true);
    const displayName = isAnonymous ? "Anonymous" : getDisplayName(user);
    const { error } = await supabase
      .from("community_posts")
      .insert({ user_id: user.id, display_name: displayName, is_anonymous: isAnonymous, content: newPost.trim(), category: newPostCategory });
    if (error) {
      toast({ title: "Error", description: "Could not post. Please try again.", variant: "destructive" });
    } else {
      setNewPost("");
      await loadPosts();
      toast({ title: "Posted!", description: "Your post is live on the community wall." });
    }
    setSubmitting(false);
  };

  const handleLike = async (post: Post) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to like posts." });
      return;
    }
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, user_liked: !p.user_liked, likes_count: p.likes_count + (p.user_liked ? -1 : 1) }
          : p
      )
    );
    if (post.user_liked) {
      await supabase.from("community_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    } else {
      await supabase.from("community_likes").insert({ post_id: post.id, user_id: user.id });
    }
  };

  const handleShare = async (post: Post) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to share posts." });
      return;
    }
    const text = `"${post.content.slice(0, 120)}${post.content.length > 120 ? "..." : ""}" — MindCare Community`;
    const sharerName = isAnonymous ? null : getDisplayName(user);
    try {
      if (navigator.share) {
        await navigator.share({ title: "MindCare Community", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: "Post copied to clipboard." });
      }
      await supabase.from("community_shares").insert({ post_id: post.id, user_id: user.id, sharer_name: sharerName });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, shares_count: p.shares_count + 1 } : p)));
    } catch {
      // User cancelled share dialog — no action needed
    }
  };

  const handleSaveEdit = async (post: Post) => {
    if (!editContent.trim()) return;
    const { error } = await supabase.from("community_posts").update({ content: editContent.trim() }).eq("id", post.id);
    if (error) {
      toast({ title: "Error", description: "Could not update post.", variant: "destructive" });
      return;
    }
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, content: editContent.trim() } : p)));
    setEditingId(null);
    toast({ title: "Updated", description: "Your post has been updated." });
  };

  const handleDelete = async (postId: string) => {
    const { error } = await supabase.from("community_posts").delete().eq("id", postId);
    if (error) {
      toast({ title: "Error", description: "Could not delete post.", variant: "destructive" });
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setDeletingId(null);
    toast({ title: "Deleted", description: "Post removed." });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const filtered = posts.filter((p) => activeCategory === "All" || p.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Community Wall</h1>
        <p className="text-muted-foreground">A safe space to share, support, and connect. Be kind. Be you.</p>
      </div>

      {/* Community Guidelines */}
      <Card className="rounded-2xl mb-6 border-calm/30 bg-calm/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-calm mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Community Guidelines:</strong> This is a safe, judgment-free zone. Be respectful and supportive. In crisis?{" "}
            <a href="/dashboard/emergency" className="text-destructive font-medium hover:underline">Visit our Emergency page</a>.
          </p>
        </CardContent>
      </Card>

      {/* New Post Composer */}
      {user ? (
        <Card className="rounded-2xl mb-6">
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
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                <SelectTrigger className="w-44 rounded-xl h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch id="anon-post" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label htmlFor="anon-post" className="text-sm flex items-center gap-1 cursor-pointer">
                  {isAnonymous ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {isAnonymous ? "Post anonymously" : `Post as ${getDisplayName(user)}`}
                </Label>
              </div>
              <Button onClick={handleSubmitPost} disabled={submitting || !newPost.trim()} className="rounded-xl gap-2 ml-auto">
                <Send className="h-4 w-4" /> Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl mb-6 border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-3">Sign in to post, like, and join the conversation.</p>
            <Button asChild className="rounded-xl"><a href="/login">Sign In</a></Button>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeCategory === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(tab)}
            className="rounded-full"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">
            {activeCategory === "All" ? "No posts yet. Be the first to share!" : `No posts in "${activeCategory}" yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => {
            const isOwner = !!user && user.id === post.user_id;
            const isEditing = editingId === post.id;
            const commentsOpen = expandedComments.has(post.id);

            return (
              <Card key={post.id} className="rounded-2xl">
                <CardContent className="p-5">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {post.is_anonymous ? "?" : post.display_name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{post.display_name}</p>
                        {isOwner && (
                          <Badge variant="outline" className="rounded-full text-xs px-2 py-0 border-primary/40 text-primary">
                            You
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-full text-xs shrink-0">{post.category}</Badge>
                  </div>

                  {/* Content / Edit Mode */}
                  {isEditing ? (
                    <div className="space-y-2 mb-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="rounded-xl"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveEdit(post)} disabled={!editContent.trim()} className="rounded-xl">
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="rounded-xl">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mb-3 leading-relaxed">{post.content}</p>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center gap-1.5 text-sm px-2 py-1.5 rounded-lg hover:bg-muted transition-colors ${post.user_liked ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <Heart className={`h-4 w-4 ${post.user_liked ? "fill-primary" : ""}`} />
                      {post.likes_count}
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-sm px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.comments_count}
                      {commentsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center gap-1.5 text-sm px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <Share2 className="h-4 w-4" />
                      {post.shares_count}
                    </button>

                    {/* Owner Controls */}
                    {isOwner && !isEditing && (
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          onClick={() => setInsightsPost(post)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        >
                          <BarChart2 className="h-3.5 w-3.5" /> Insights
                        </button>
                        <button
                          onClick={() => { setEditingId(post.id); setEditContent(post.content); }}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          aria-label="Edit post"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(post.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete post"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline Comments */}
                  {commentsOpen && <CommentThread postId={post.id} user={user} />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Insights Dialog */}
      {insightsPost && (
        <InsightsDialog
          post={insightsPost}
          open={!!insightsPost}
          onClose={() => setInsightsPost(null)}
        />
      )}

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your post along with all its comments, likes, and shares. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep It</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
