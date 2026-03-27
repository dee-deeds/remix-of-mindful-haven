import { Link } from "react-router-dom";
import { Heart, Brain, Users, AlertTriangle, Smile, BookOpen, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const quickAccess = [
  { icon: Smile, title: "Mood Tracker", desc: "Check in with yourself daily", path: "/dashboard", color: "text-primary" },
  { icon: Brain, title: "Self-Assessment", desc: "Understand your mental health", path: "/assessment", color: "text-calm" },
  { icon: Users, title: "Find a Counselor", desc: "Connect with professionals", path: "/counselors", color: "text-success" },
  { icon: BookOpen, title: "Resources", desc: "Articles, videos & guides", path: "/resources", color: "text-warning" },
];

const testimonials = [
  { name: "Anonymous Student", text: "MindCare helped me find the courage to seek help. The self-assessment gave me clarity during a really tough semester.", rating: 5 },
  { name: "3rd Year, Engineering", text: "The mood tracker helped me recognize patterns in my mental health. Now I can manage my stress better.", rating: 5 },
  { name: "Campus Leader", text: "This platform has created a safe space for students to talk openly. It's changing lives at JKUAT.", rating: 5 },
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
            <Link to="/resources">
              <Button size="lg" variant="outline" className="rounded-xl font-display text-base gap-2">
                Explore Resources <ArrowRight className="h-5 w-5" />
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
            <Link key={item.path} to={item.path}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/30 rounded-2xl h-full">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
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
    </div>
  );
}
