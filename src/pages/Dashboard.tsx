import { useState } from "react";
import { Link } from "react-router-dom";
import { Smile, Meh, Frown, Angry, Heart, BookOpen, Users, AlertTriangle, Calendar, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const moods = [
  { icon: Heart, label: "Great", value: 5, color: "text-success" },
  { icon: Smile, label: "Good", value: 4, color: "text-primary" },
  { icon: Meh, label: "Okay", value: 3, color: "text-warning" },
  { icon: Frown, label: "Low", value: 2, color: "text-muted-foreground" },
  { icon: Angry, label: "Struggling", value: 1, color: "text-destructive" },
];

const quickActions = [
  { icon: BookOpen, title: "Resources", path: "/resources", desc: "Browse articles & guides" },
  { icon: Brain, title: "Self-Assessment", path: "/assessment", desc: "Check your wellbeing" },
  { icon: Users, title: "Community", path: "/community", desc: "Join discussions" },
  { icon: AlertTriangle, title: "Emergency Help", path: "/emergency", desc: "Get immediate support" },
];

const recommendedResources = [
  { title: "Managing Exam Stress", category: "Academic Stress", type: "Article" },
  { title: "5-Minute Breathing Exercise", category: "Self-Care", type: "Video" },
  { title: "Understanding Anxiety", category: "Anxiety", type: "Guide" },
];

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    setMoodLogged(true);
    setTimeout(() => setMoodLogged(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Welcome back! 👋</h1>
        <p className="text-muted-foreground">How are you feeling today?</p>
      </div>

      {/* Mood Tracker */}
      <Card className="rounded-2xl mb-8 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="font-display text-lg">Daily Mood Check-in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`flex flex-col items-center gap-1 p-4 rounded-2xl transition-all ${
                  selectedMood === mood.value
                    ? "bg-primary/20 ring-2 ring-primary scale-105"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <mood.icon className={`h-8 w-8 ${mood.color}`} />
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
          {moodLogged && (
            <p className="text-center text-sm text-success mt-4 animate-fade-in">
              ✓ Mood logged! Remember, every feeling is valid. 💗
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Card className="rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming & Resources */}
        <div className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              <Link to="/booking">
                <Button variant="outline" size="sm" className="mt-3 rounded-lg w-full">Book a Session</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Recommended for You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedResources.map((r, i) => (
                <Link key={i} to="/resources" className="block p-2 rounded-lg hover:bg-muted transition-colors">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.category} • {r.type}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
