import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ── Static event data ─────────────────────────────────────────────────────────

const ALL_EVENTS = [
  { id: 1, title: "Stress Management Workshop",        date: "Apr 5, 2026",  time: "2:00 PM",  location: "JKUAT Main Hall",    type: "In-Person", attendees: 45,  category: "Workshop", desc: "Learn practical techniques to manage stress during exam season." },
  { id: 2, title: "Mindfulness & Meditation Session",  date: "Apr 8, 2026",  time: "10:00 AM", location: "Online (Zoom)",       type: "Online",    attendees: 120, category: "Webinar",  desc: "A guided session to help you build a daily mindfulness practice." },
  { id: 3, title: "Peer Support Training",             date: "Apr 12, 2026", time: "3:00 PM",  location: "Student Center",      type: "In-Person", attendees: 20,  category: "Training", desc: "Learn how to support your peers through difficult times." },
  { id: 4, title: "Understanding Anxiety: Q&A",        date: "Apr 15, 2026", time: "11:00 AM", location: "Online (Zoom)",       type: "Online",    attendees: 85,  category: "Webinar",  desc: "An open Q&A about anxiety disorders with a licensed therapist." },
  { id: 5, title: "Art Therapy Evening",               date: "Apr 20, 2026", time: "5:00 PM",  location: "Creative Arts Block", type: "In-Person", attendees: 30,  category: "Workshop", desc: "Express yourself through art in a safe, therapeutic environment." },
  { id: 6, title: "Sleep & Mental Health Webinar",     date: "Apr 24, 2026", time: "7:00 PM",  location: "Online (Zoom)",       type: "Online",    attendees: 60,  category: "Webinar",  desc: "Understand how sleep patterns affect your mood and cognition." },
];

const CATEGORIES = ["All", "Workshop", "Webinar", "Training"];
const TYPES      = ["All", "Online", "In-Person"];

// ── My Events tab ─────────────────────────────────────────────────────────────

function MyEvents({ registeredIds }: { registeredIds: number[] }) {
  const myEvents = ALL_EVENTS.filter((e) => registeredIds.includes(e.id));

  if (myEvents.length === 0) return (
    <div className="text-center py-16">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
      <p className="font-display font-semibold text-lg">No registrations yet</p>
      <p className="text-muted-foreground text-sm mt-1">Browse events and register to see them here.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {myEvents.map((event) => (
        <Card key={event.id} className="rounded-2xl border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="secondary" className="rounded-full text-xs">{event.category}</Badge>
              <Badge variant={event.type === "Online" ? "outline" : "default"} className="rounded-full text-xs gap-1">
                {event.type === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                {event.type}
              </Badge>
            </div>
            <h3 className="font-display font-bold text-base mb-1">{event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {event.date}</p>
              <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {event.time}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {event.location}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Events() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"browse" | "mine">("browse");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [registeredIds, setRegisteredIds] = useState<number[]>([]);
  const [registering, setRegistering] = useState<number | null>(null);
  const [loadingRegs, setLoadingRegs] = useState(true);

  // Load user's existing registrations
  useEffect(() => {
    if (!user) { setLoadingRegs(false); return; }
    supabase
      .from("event_registrations")
      .select("event_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setRegisteredIds(data.map((r) => r.event_id));
        setLoadingRegs(false);
      });
  }, [user]);

  const handleRegister = async (eventId: number) => {
    if (!user) { toast({ title: "Sign in to register", variant: "destructive" }); return; }
    setRegistering(eventId);
    const { error } = await supabase
      .from("event_registrations")
      .insert({ user_id: user.id, event_id: eventId });
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      setRegisteredIds((prev) => [...prev, eventId]);
      toast({ title: "Registered!", description: "Event added to My Events." });
    }
    setRegistering(null);
  };

  const handleUnregister = async (eventId: number) => {
    if (!user) return;
    setRegistering(eventId);
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);
    if (!error) {
      setRegisteredIds((prev) => prev.filter((id) => id !== eventId));
      toast({ title: "Unregistered" });
    }
    setRegistering(null);
  };

  const filtered = ALL_EVENTS.filter((e) =>
    (category === "All" || e.category === category) &&
    (type === "All" || e.type === type)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold mb-2">Events & Webinars</h1>
        <p className="text-muted-foreground">Join workshops, webinars, and support groups to boost your wellbeing.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 w-fit">
        {(["browse", "mine"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "browse" ? "Browse Events" : (
              <>My Events {registeredIds.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {registeredIds.length}
                </span>
              )}</>
            )}
          </button>
        ))}
      </div>

      {tab === "mine" ? (
        loadingRegs
          ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          : <MyEvents registeredIds={registeredIds} />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)} className="rounded-full text-xs">
                  {c}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)} className="rounded-full text-xs">
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No events match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((event) => {
                const isRegistered = registeredIds.includes(event.id);
                const isBusy = registering === event.id;
                return (
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
                      <div className="space-y-1.5 mb-4 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {event.date}</p>
                        <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {event.time}</p>
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</p>
                        <p className="flex items-center gap-2"><Users className="h-4 w-4" /> {event.attendees + (isRegistered ? 0 : 0)} attending</p>
                      </div>
                      <Button
                        onClick={() => isRegistered ? handleUnregister(event.id) : handleRegister(event.id)}
                        variant={isRegistered ? "outline" : "default"}
                        className="w-full rounded-xl font-display"
                        disabled={isBusy}
                      >
                        {isBusy
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : isRegistered ? "Unregister" : "Register"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
