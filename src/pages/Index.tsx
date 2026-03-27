import { Link } from "react-router-dom";
import { Heart, Brain, Users, AlertTriangle, Smile, BookOpen, ArrowRight, Star, Calendar, Lock, Play, FileText, MessageCircle, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const quickAccess = [
  { icon: Smile, title: "Mood Tracker", desc: "Check in with yourself daily", path: "/dashboard", color: "text-primary", locked: true },
  { icon: Brain, title: "Self-Assessment", desc: "Understand your mental health", path: "/assessment", color: "text-calm", locked: true },
  { icon: Users, title: "Find a Counselor", desc: "Connect with professionals", path: "/counselors", color: "text-success", locked: false },
  { icon: BookOpen, title: "Resources", desc: "Articles, videos & guides", path: "/resources", color: "text-warning", locked: false },
];

const testimonials = [
  { name: "Anonymous Student", text: "MindCare helped me find the courage to seek help. The self-assessment gave me clarity during a really tough semester.", rating: 5 },
  { name: "3rd Year, Engineering", text: "The mood tracker helped me recognize patterns in my mental health. Now I can manage my stress better.", rating: 5 },
  { name: "Campus Leader", text: "This platform has created a safe space for students to talk openly. It's changing lives at JKUAT.", rating: 5 },
];

const previewResources = [
  { title: "Understanding Anxiety: A Student's Guide", category: "Anxiety", type: "article" },
  { title: "5-Minute Breathing Exercise", category: "Self-Care", type: "video" },
  { title: "Dealing with Academic Pressure", category: "Academic Stress", type: "article" },
];

const previewCounselors = [
  { name: "Dr. Amina Wanjiku", spec: "Anxiety & Stress", rating: 4.9, image: "AW" },
  { name: "Dr. Peter Ochieng", spec: "Depression", rating: 4.8, image: "PO" },
  { name: "Joyce Muthoni", spec: "Relationships", rating: 4.7, image: "JM" },
];

const previewPosts = [
  { author: "Anonymous", content: "I've been feeling overwhelmed with assignments this semester. Anyone else?", likes: 12, time: "2h ago" },
  { author: "Hope_Finder", content: "Just finished a counseling session and I feel so much better. Please go! 💗", likes: 28, time: "4h ago" },
];

const previewEvents = [
  { title: "Stress Management Workshop", date: "Apr 5", type: "In-Person" },
  { title: "Mindfulness & Meditation Session", date: "Apr 8", type: "Online" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-calm/10" />
        <div className="container relative mx-auto px-4 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-medium text-primary-foreground mb-6 animate-fade-in">
            <Heart className="h-4 w-4 fill-primary text-primary" />
            JKUAT Mental Health Resource Center
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            You're <span className="text-primary">Not Alone</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your mental health matters. Access free resources, connect with counselors, and join a supportive community — all in one safe space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/emergency">
              <Button size="lg" variant="destructive" className="rounded-xl font-display text-base gap-2">
                <AlertTriangle className="h-5 w-5" /> Get Help Now
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="rounded-xl font-display text-base gap-2">
                Join MindCare <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="rounded-xl font-display text-base">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">How Can We Help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccess.map((item) => (
            <Link key={item.path} to={item.locked ? "/login" : item.path}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/30 rounded-2xl h-full relative">
                {item.locked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  {item.locked && <p className="text-xs text-primary mt-2 font-medium">Sign in to access</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Resource Preview */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Resources</h2>
            <Link to="/resources">
              <Button variant="ghost" className="gap-1 text-primary font-display">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewResources.map((r, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary" className="rounded-full text-xs">{r.category}</Badge>
                    <Badge variant="outline" className="rounded-full text-xs gap-1">
                      {r.type === "video" ? <Play className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {r.type}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold mb-2">{r.title}</h3>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="gap-1 text-primary mt-2">
                      <Lock className="h-3 w-3" /> Sign in to read
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Counselor Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Our Counselors</h2>
          <Link to="/counselors">
            <Button variant="ghost" className="gap-1 text-primary font-display">View All <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewCounselors.map((c, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center font-display font-bold text-primary text-lg shrink-0">
                  {c.image}
                </div>
                <div>
                  <h3 className="font-display font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.spec}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-warning fill-warning" />
                    <span className="text-xs font-medium">{c.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Preview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Community</h2>
            <Link to="/community">
              <Button variant="ghost" className="gap-1 text-primary font-display">Read More <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {previewPosts.map((p, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">?</div>
                    <div>
                      <p className="text-sm font-medium">{p.author}</p>
                      <p className="text-xs text-muted-foreground">{p.time}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{p.content}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> Reply</span>
                  </div>
                  <Link to="/login">
                    <p className="text-xs text-primary mt-3 font-medium flex items-center gap-1"><Lock className="h-3 w-3" /> Sign in to join the conversation</p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Upcoming Events</h2>
          <Link to="/events">
            <Button variant="ghost" className="gap-1 text-primary font-display">View All <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {previewEvents.map((e, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6">
                <Badge variant={e.type === "Online" ? "outline" : "secondary"} className="rounded-full text-xs gap-1 mb-3">
                  {e.type === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {e.type}
                </Badge>
                <h3 className="font-display font-bold mb-1">{e.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.date}</p>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary mt-3">
                    <Lock className="h-3 w-3" /> Sign in to register
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,500+", label: "Students Supported" },
              { value: "50+", label: "Resources Available" },
              { value: "15", label: "Verified Counselors" },
              { value: "24/7", label: "Emergency Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Stories of Hope</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
                <p className="font-display font-semibold text-sm">{t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-calm/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to Take the First Step?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Create a free account to access personalized resources, book counseling sessions, track your mood, and join our supportive community.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-xl font-display text-base gap-2">
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
