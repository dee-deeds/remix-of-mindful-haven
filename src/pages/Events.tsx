import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const events = [
  { id: 1, title: "Stress Management Workshop", date: "Apr 5, 2026", time: "2:00 PM", location: "JKUAT Main Hall", type: "In-Person", attendees: 45, category: "Workshop", desc: "Learn practical techniques to manage stress during exam season." },
  { id: 2, title: "Mindfulness & Meditation Session", date: "Apr 8, 2026", time: "10:00 AM", location: "Online (Zoom)", type: "Online", attendees: 120, category: "Webinar", desc: "A guided session to help you build a daily mindfulness practice." },
  { id: 3, title: "Peer Support Training", date: "Apr 12, 2026", time: "3:00 PM", location: "Student Center", type: "In-Person", attendees: 20, category: "Training", desc: "Learn how to support your peers through difficult times." },
  { id: 4, title: "Understanding Anxiety: Q&A with Dr. Wanjiku", date: "Apr 15, 2026", time: "11:00 AM", location: "Online (Zoom)", type: "Online", attendees: 85, category: "Webinar", desc: "An open Q&A session about anxiety disorders with a licensed therapist." },
  { id: 5, title: "Art Therapy Evening", date: "Apr 20, 2026", time: "5:00 PM", location: "Creative Arts Block", type: "In-Person", attendees: 30, category: "Workshop", desc: "Express yourself through art in a safe, therapeutic environment." },
];

export default function Events() {
  const [registered, setRegistered] = useState<number[]>([]);

  const handleRegister = (id: number) => {
    setRegistered((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Events & Webinars</h1>
        <p className="text-muted-foreground">Join workshops, webinars, and support groups to boost your wellbeing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="rounded-2xl hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" className="rounded-full text-xs">{event.category}</Badge>
                <Badge variant={event.type === "Online" ? "outline" : "default"} className="rounded-full text-xs gap-1">
                  {event.type === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                  {event.type}
                </Badge>
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{event.desc}</p>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> {event.attendees} attending
                </div>
              </div>
              <Button
                onClick={() => handleRegister(event.id)}
                variant={registered.includes(event.id) ? "outline" : "default"}
                className="w-full rounded-xl font-display"
                disabled={registered.includes(event.id)}
              >
                {registered.includes(event.id) ? "Registered ✓" : "Register"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
