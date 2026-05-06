import { useState, useEffect } from "react";
import {
  Calendar, Clock, MapPin, Users, Video, Loader2,
  Share2, CalendarPlus, Bell, BellOff, CheckCircle2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ── Static data ───────────────────────────────────────────────────────────────

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "Online" | "In-Person";
  attendees: number;
  category: string;
  desc: string;
  facilitator?: string;
  duration?: string;
  capacity?: number;
}

const ALL_EVENTS: Event[] = [
  { id: 1, title: "Stress Management Workshop",       date: "Apr 5, 2026",  time: "2:00 PM",  location: "JKUAT Main Hall",    type: "In-Person", attendees: 45,  category: "Workshop", desc: "Learn practical, science-backed techniques to manage stress during exam season. Topics include time-boxing, progressive muscle relaxation, and cognitive reframing.", facilitator: "Dr. Amina Wanjiku", duration: "2 hours",  capacity: 60 },
  { id: 2, title: "Mindfulness & Meditation Session", date: "Apr 8, 2026",  time: "10:00 AM", location: "Online (Zoom)",       type: "Online",    attendees: 120, category: "Webinar",  desc: "A guided session to help you build a daily mindfulness practice. We'll explore breath work, body scans, and gratitude journaling.",                             facilitator: "Grace Njeri",       duration: "1 hour",   capacity: 200 },
  { id: 3, title: "Peer Support Training",            date: "Apr 12, 2026", time: "3:00 PM",  location: "Student Center",      type: "In-Person", attendees: 20,  category: "Training", desc: "Learn how to support your peers through difficult times. Covers active listening, recognising signs of distress, and safe referral pathways.",                   facilitator: "Joyce Muthoni",     duration: "3 hours",  capacity: 25 },
  { id: 4, title: "Understanding Anxiety: Q&A",       date: "Apr 15, 2026", time: "11:00 AM", location: "Online (Zoom)",       type: "Online",    attendees: 85,  category: "Webinar",  desc: "An open Q&A about anxiety disorders with a licensed therapist. Submit questions anonymously in advance or ask live.",                                           facilitator: "Dr. Hassan Ali",    duration: "1.5 hours",capacity: 150 },
  { id: 5, title: "Art Therapy Evening",              date: "Apr 20, 2026", time: "5:00 PM",  location: "Creative Arts Block", type: "In-Person", attendees: 30,  category: "Workshop", desc: "Express yourself through art in a safe, therapeutic environment. All skill levels welcome — no art experience needed. Materials provided.",                       facilitator: "Dr. Peter Ochieng", duration: "2 hours",  capacity: 35 },
  { id: 6, title: "Sleep & Mental Health Webinar",    date: "Apr 24, 2026", time: "7:00 PM",  location: "Online (Zoom)",       type: "Online",    attendees: 60,  category: "Webinar",  desc: "Understand how sleep patterns affect your mood and cognition. Covers sleep hygiene tips, circadian rhythms, and strategies for insomnia.",                       facilitator: "Dr. David Kimani",  duration: "1 hour",   capacity: 100 },
];

const CATEGORIES = ["All", "Workshop", "Webinar", "Training"];
const TYPES      = ["All", "Online", "In-Person"];

// ── Download .ics helper ──────────────────────────────────────────────────────

function downloadIcs(event: Event) {
  const start = new Date(`${event.date} ${event.time}`);
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.desc.replace(/\n/g, "\\n")}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${event.title}.ics`; a.click();
  URL.revokeObjectURL(url);
}

// ── Event detail dialog ───────────────────────────────────────────────────────

function EventDetailDialog({ event, open, onClose, isRegistered, onRegister, onUnregister, registering, reminded, onToggleReminder }: {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  isRegistered: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  registering: boolean;
  reminded: boolean;
  onToggleReminder: () => void;
}) {
  const { toast } = useToast();
  const [unregisterConfirm, setUnregisterConfirm] = useState(false);

  if (!event) return null;
  const spotsLeft = (event.capacity ?? 0) - event.attendees;
  const isFull = spotsLeft <= 0;

  const handleShare = async () => {
    const text = `${event.title} — ${event.date} at ${event.time} | ${event.location}`;
    if (navigator.share) {
      await navigator.share({ title: event.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-2 mb-1">
              <Badge variant="secondary" className="rounded-full text-xs">{event.category}</Badge>
              <Badge variant={event.type === "Online" ? "outline" : "default"} className="rounded-full text-xs gap-1">
                {event.type === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                {event.type}
              </Badge>
            </div>
            <DialogTitle className="font-display text-xl leading-snug">{event.title}</DialogTitle>
            <DialogDescription>{event.facilitator && `Facilitated by ${event.facilitator}`}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Date</p>
                <p className="text-sm font-semibold flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{event.date}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Time</p>
                <p className="text-sm font-semibold flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{event.time}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Duration</p>
                <p className="text-sm font-semibold">{event.duration ?? "TBC"}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Spots left</p>
                <p className={`text-sm font-semibold ${isFull ? "text-destructive" : spotsLeft <= 5 ? "text-warning" : ""}`}>
                  {isFull ? "Full" : `${spotsLeft} remaining`}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
              {event.type === "Online" ? <Video className="h-4 w-4 text-primary shrink-0 mt-0.5" /> : <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
              <div>
                <p className="text-sm font-medium">{event.location}</p>
                {event.type === "Online" && isRegistered && (
                  <p className="text-xs text-muted-foreground mt-0.5">Zoom link will be emailed 1 hour before the session.</p>
                )}
                {event.type === "In-Person" && (
                  <p className="text-xs text-muted-foreground mt-0.5">Please arrive 10 minutes early.</p>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">{event.desc}</p>

            {/* Attendees */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span><strong className="text-foreground">{event.attendees}</strong> people attending</span>
            </div>

            {/* Registered joining banner */}
            {isRegistered && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-success">You're registered!</p>
                  <p className="text-xs text-muted-foreground">We'll send a reminder 24 hours before.</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              {/* Register / Unregister */}
              {isRegistered ? (
                <Button
                  variant="outline"
                  className="rounded-xl gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 col-span-2"
                  onClick={() => setUnregisterConfirm(true)}
                  disabled={registering}
                >
                  {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="h-4 w-4" />Cancel Registration</>}
                </Button>
              ) : (
                <Button
                  className="rounded-xl col-span-2"
                  onClick={onRegister}
                  disabled={registering || isFull}
                >
                  {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : isFull ? "Event Full" : "Register Now"}
                </Button>
              )}

              {/* Add to calendar */}
              <Button variant="outline" className="rounded-xl gap-2 text-sm" onClick={() => downloadIcs(event)}>
                <CalendarPlus className="h-4 w-4" /> Add to Calendar
              </Button>

              {/* Reminder toggle */}
              <Button
                variant="outline"
                className={`rounded-xl gap-2 text-sm ${reminded ? "border-primary/40 bg-primary/5 text-primary" : ""}`}
                onClick={onToggleReminder}
              >
                {reminded ? <><BellOff className="h-4 w-4" />Reminded</> : <><Bell className="h-4 w-4" />Remind Me</>}
              </Button>

              {/* Share */}
              <Button variant="outline" className="rounded-xl gap-2 text-sm col-span-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" /> Share Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unregister confirm */}
      <AlertDialog open={unregisterConfirm} onOpenChange={setUnregisterConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Cancel your registration?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll lose your spot for <strong>{event.title}</strong> on <strong>{event.date}</strong>. You can re-register if spots are still available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep My Spot</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive hover:bg-destructive/90"
              onClick={() => { setUnregisterConfirm(false); onUnregister(); }}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── My Events tab ─────────────────────────────────────────────────────────────

function MyEvents({ registeredIds, onOpenDetail }: { registeredIds: number[]; onOpenDetail: (e: Event) => void }) {
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
        <Card key={event.id} className="rounded-2xl border-primary/20 bg-primary/5 cursor-pointer hover:shadow-md transition-all" onClick={() => onOpenDetail(event)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="secondary" className="rounded-full text-xs">{event.category}</Badge>
              <Badge variant={event.type === "Online" ? "outline" : "default"} className="rounded-full text-xs gap-1">
                {event.type === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                {event.type}
              </Badge>
            </div>
            <h3 className="font-display font-bold text-base mb-2">{event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{event.date}</p>
              <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{event.time}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-success font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Registered · Click to view details
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
  const [tab, setTab]           = useState<"browse" | "mine">("browse");
  const [category, setCategory] = useState("All");
  const [type, setType]         = useState("All");
  const [registeredIds, setRegisteredIds] = useState<number[]>([]);
  const [remindedIds, setRemindedIds]     = useState<number[]>([]);
  const [registering, setRegistering]     = useState<number | null>(null);
  const [loadingRegs, setLoadingRegs]     = useState(true);
  const [activeEvent, setActiveEvent]     = useState<Event | null>(null);

  useEffect(() => {
    if (!user) { setLoadingRegs(false); return; }
    supabase.from("event_registrations").select("event_id").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setRegisteredIds(data.map((r) => r.event_id));
        setLoadingRegs(false);
      });
  }, [user]);

  const handleRegister = async (eventId: number) => {
    if (!user) { toast({ title: "Sign in to register", variant: "destructive" }); return; }
    setRegistering(eventId);
    const { error } = await supabase.from("event_registrations").insert({ user_id: user.id, event_id: eventId });
    if (error) { toast({ title: "Registration failed", description: error.message, variant: "destructive" }); }
    else { setRegisteredIds((p) => [...p, eventId]); toast({ title: "Registered!", description: "Event added to My Events." }); }
    setRegistering(null);
  };

  const handleUnregister = async (eventId: number) => {
    if (!user) return;
    setRegistering(eventId);
    const { error } = await supabase.from("event_registrations").delete().eq("user_id", user.id).eq("event_id", eventId);
    if (!error) { setRegisteredIds((p) => p.filter((id) => id !== eventId)); toast({ title: "Registration cancelled" }); }
    setRegistering(null);
  };

  const toggleReminder = (eventId: number) => {
    setRemindedIds((p) => p.includes(eventId) ? p.filter((id) => id !== eventId) : [...p, eventId]);
    const isAdding = !remindedIds.includes(eventId);
    toast({ title: isAdding ? "Reminder set!" : "Reminder removed", description: isAdding ? "We'll notify you 24 hours before." : undefined });
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
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "browse" ? "Browse Events" : (
              <>My Events {registeredIds.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs rounded-full px-1.5 py-0.5 font-bold">{registeredIds.length}</span>
              )}</>
            )}
          </button>
        ))}
      </div>

      {tab === "mine" ? (
        loadingRegs
          ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          : <MyEvents registeredIds={registeredIds} onOpenDetail={setActiveEvent} />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)} className="rounded-full text-xs">{c}</Button>
              ))}
            </div>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)} className="rounded-full text-xs">{t}</Button>
              ))}
            </div>
          </div>

          {filtered.length === 0
            ? <p className="text-center text-muted-foreground py-16">No events match your filters.</p>
            : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((event) => {
                  const isRegistered = registeredIds.includes(event.id);
                  const isBusy = registering === event.id;
                  const spotsLeft = (event.capacity ?? 0) - event.attendees;
                  return (
                    <Card key={event.id} className="rounded-2xl hover:shadow-md transition-all cursor-pointer group" onClick={() => setActiveEvent(event)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="rounded-full text-xs">{event.category}</Badge>
                          <div className="flex items-center gap-1.5">
                            {isRegistered && <CheckCircle2 className="h-4 w-4 text-success" />}
                            <Badge variant={event.type === "Online" ? "outline" : "default"} className="rounded-full text-xs gap-1">
                              {event.type === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                        <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.desc}</p>
                        <div className="space-y-1.5 mb-4 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{event.date} · {event.time}</p>
                          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location}</p>
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4" />{event.attendees} attending
                            {spotsLeft > 0 && spotsLeft <= 10 && <span className="text-warning font-medium ml-1">· Only {spotsLeft} spots left!</span>}
                          </p>
                        </div>
                        <Button
                          onClick={(e) => { e.stopPropagation(); isRegistered ? handleUnregister(event.id) : handleRegister(event.id); }}
                          variant={isRegistered ? "outline" : "default"}
                          className="w-full rounded-xl font-display"
                          disabled={isBusy || (!isRegistered && spotsLeft <= 0)}
                        >
                          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" />
                            : isRegistered ? "Registered ✓"
                            : spotsLeft <= 0 ? "Full"
                            : "Register"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
        </>
      )}

      {/* Event detail dialog */}
      <EventDetailDialog
        event={activeEvent}
        open={!!activeEvent}
        onClose={() => setActiveEvent(null)}
        isRegistered={activeEvent ? registeredIds.includes(activeEvent.id) : false}
        onRegister={() => activeEvent && handleRegister(activeEvent.id)}
        onUnregister={() => activeEvent && handleUnregister(activeEvent.id)}
        registering={activeEvent ? registering === activeEvent.id : false}
        reminded={activeEvent ? remindedIds.includes(activeEvent.id) : false}
        onToggleReminder={() => activeEvent && toggleReminder(activeEvent.id)}
      />
    </div>
  );
}
