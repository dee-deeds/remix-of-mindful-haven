import { useState, useEffect } from "react";
import {
  Calendar, Clock, CheckCircle, Video, MapPin, MessageSquare,
  ArrowLeft, X, Loader2, ChevronRight, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ── Static data ───────────────────────────────────────────────────────────────

const COUNSELORS = [
  { id: 1, name: "Dr. Amina Wanjiku",  initials: "AW", specialization: "Anxiety & Stress", bio: "8 years helping students navigate stress and anxiety with evidence-based CBT." },
  { id: 2, name: "Dr. Peter Ochieng",  initials: "PO", specialization: "Depression",        bio: "12 years of clinical experience in mood disorders and student mental wellness." },
  { id: 3, name: "Joyce Muthoni",      initials: "JM", specialization: "Relationships",     bio: "Specialist in interpersonal therapy and communication skills for young adults." },
  { id: 4, name: "Dr. Hassan Ali",     initials: "HA", specialization: "Trauma",            bio: "Trauma-informed therapist with 15 years working with university students." },
  { id: 5, name: "Grace Njeri",        initials: "GN", specialization: "Academic",          bio: "Academic counselor focused on performance anxiety and study skill-building." },
  { id: 6, name: "Dr. David Kimani",   initials: "DK", specialization: "Addiction",         bio: "10 years supporting recovery and relapse prevention in campus settings." },
];

const SESSION_TYPES = [
  { value: "video",     label: "Video Call",  icon: Video },
  { value: "in-person", label: "In-Person",   icon: MapPin },
  { value: "chat",      label: "Chat",        icon: MessageSquare },
] as const;
type SessionType = typeof SESSION_TYPES[number]["value"];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

function generateDays() {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) days.push(d);
  }
  return days;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Booking {
  id: string;
  counselor_id: number;
  counselor_name: string;
  session_type: SessionType;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  created_at: string;
}

// ── Booking detail dialog ─────────────────────────────────────────────────────

function BookingDetailDialog({ booking, open, onClose }: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!booking) return null;
  const counselor = COUNSELORS.find((c) => c.id === booking.counselor_id);
  const sessionIcon = SESSION_TYPES.find((s) => s.value === booking.session_type);
  const Icon = sessionIcon?.icon ?? Video;
  const isUpcoming = booking.status === "upcoming";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Session Details</DialogTitle>
          <DialogDescription>Your booked appointment information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Counselor */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center font-display font-bold text-primary shrink-0">
              {counselor?.initials ?? <User className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-display font-bold">{booking.counselor_name}</p>
              <p className="text-sm text-muted-foreground">{counselor?.specialization}</p>
              {counselor?.bio && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{counselor.bio}</p>}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Date</p>
              <p className="text-sm font-semibold flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{booking.date}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Time</p>
              <p className="text-sm font-semibold flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{booking.time}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Format</p>
              <p className="text-sm font-semibold flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-primary" />{sessionIcon?.label}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Status</p>
              <Badge
                variant={booking.status === "upcoming" ? "default" : booking.status === "cancelled" ? "destructive" : "secondary"}
                className="rounded-full capitalize text-xs"
              >
                {booking.status}
              </Badge>
            </div>
          </div>

          {/* Joining instructions for upcoming video sessions */}
          {isUpcoming && booking.session_type === "video" && (
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-4">
              <p className="text-sm font-semibold mb-1 flex items-center gap-2"><Video className="h-4 w-4 text-primary" />Video Session Link</p>
              <p className="text-xs text-muted-foreground mb-2">Your secure link will be sent to your email 30 minutes before the session.</p>
              <Button size="sm" variant="outline" className="rounded-xl text-xs w-full" disabled>
                Join Link Pending
              </Button>
            </div>
          )}

          {isUpcoming && booking.session_type === "in-person" && (
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-4">
              <p className="text-sm font-semibold mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Location</p>
              <p className="text-xs text-muted-foreground">JKUAT Counseling Centre, Student Affairs Building, Room 204</p>
            </div>
          )}

          {isUpcoming && booking.session_type === "chat" && (
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-4">
              <p className="text-sm font-semibold mb-1 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" />Chat Session</p>
              <p className="text-xs text-muted-foreground">Your counselor will initiate the chat at the scheduled time via the platform.</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Need to cancel? Please do so at least 24 hours before your session.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── My Bookings tab ───────────────────────────────────────────────────────────

function MyBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data as Booking[]);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(cancelTarget.id);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", cancelTarget.id);
    if (error) {
      toast({ title: "Failed to cancel", description: error.message, variant: "destructive" });
    } else {
      setBookings((prev) => prev.map((b) => b.id === cancelTarget.id ? { ...b, status: "cancelled" } : b));
      if (selectedBooking?.id === cancelTarget.id) setSelectedBooking((b) => b ? { ...b, status: "cancelled" } : b);
      toast({ title: "Booking cancelled" });
    }
    setCancelling(null);
    setCancelTarget(null);
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (bookings.length === 0) return (
    <div className="text-center py-16">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
      <p className="font-display font-semibold text-lg">No bookings yet</p>
      <p className="text-muted-foreground text-sm mt-1">Book your first session using the form above.</p>
    </div>
  );

  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past     = bookings.filter((b) => b.status !== "upcoming");

  const BookingCard = ({ b }: { b: Booking }) => (
    <Card
      key={b.id}
      className={`rounded-2xl cursor-pointer transition-all hover:shadow-md ${b.status === "upcoming" ? "border-primary/20 bg-primary/5" : "opacity-60"}`}
      onClick={() => setSelectedBooking(b)}
    >
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="font-display font-bold truncate">{b.counselor_name}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{b.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.time}</span>
            <Badge variant="secondary" className="rounded-full text-xs capitalize">{b.session_type}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {b.status === "upcoming" && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
              onClick={(e) => { e.stopPropagation(); setCancelTarget(b); }}
              disabled={cancelling === b.id}
            >
              {cancelling === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
          )}
          {b.status !== "upcoming" && (
            <Badge variant={b.status === "cancelled" ? "destructive" : "secondary"} className="rounded-full text-xs capitalize">
              {b.status}
            </Badge>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-6">
        {upcoming.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-3">Upcoming</h3>
            <div className="space-y-3">{upcoming.map((b) => <BookingCard key={b.id} b={b} />)}</div>
          </div>
        )}
        {past.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-3">Past</h3>
            <div className="space-y-3">{past.map((b) => <BookingCard key={b.id} b={b} />)}</div>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <BookingDetailDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      {/* Cancel confirm dialog */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => { if (!open) setCancelTarget(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">You are about to cancel your session with <strong>{cancelTarget?.counselor_name}</strong> on <strong>{cancelTarget?.date}</strong> at <strong>{cancelTarget?.time}</strong>.</span>
              <span className="block text-xs text-destructive">Cancellations must be made at least 24 hours in advance. Late cancellations may affect your ability to book future sessions.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive hover:bg-destructive/90"
              onClick={confirmCancel}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Booking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"book" | "my">("book");

  const presetId = searchParams.get("counselorId");
  const presetCounselor = COUNSELORS.find((c) => c.id === Number(presetId)) ?? null;

  const [selectedCounselor, setSelectedCounselor] = useState(presetCounselor);
  const [sessionType, setSessionType]   = useState<SessionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const days = generateDays();

  const handleConfirm = async () => {
    if (!selectedCounselor || !sessionType || !selectedDate || !selectedTime) return;
    if (!user) { toast({ title: "Sign in to book a session", variant: "destructive" }); return; }
    setSaving(true);
    const dateStr = selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      counselor_id: selectedCounselor.id,
      counselor_name: selectedCounselor.name,
      session_type: sessionType,
      date: dateStr,
      time: selectedTime,
    });
    setSaving(false);
    if (error) { toast({ title: "Booking failed", description: error.message, variant: "destructive" }); }
    else { setConfirmed(true); }
  };

  if (confirmed && selectedCounselor && sessionType && selectedDate && selectedTime) {
    const Icon = SESSION_TYPES.find((s) => s.value === sessionType)?.icon ?? Video;
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="rounded-2xl text-center">
          <CardContent className="p-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h2 className="font-display text-2xl font-bold">Appointment Confirmed!</h2>
            <p className="text-muted-foreground">Your session has been saved.</p>
            <div className="bg-muted rounded-xl p-4 space-y-2 text-sm text-left">
              <p className="font-semibold">{selectedCounselor.name}</p>
              <p className="text-muted-foreground flex items-center gap-2"><Icon className="h-4 w-4" />{SESSION_TYPES.find((s) => s.value === sessionType)?.label}</p>
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{selectedTime}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="rounded-xl" onClick={() => { setConfirmed(false); setSelectedDate(null); setSelectedTime(null); setSessionType(null); }}>
                Book Another
              </Button>
              <Button className="rounded-xl" onClick={() => setTab("my")}>View My Bookings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/dashboard/counselors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Counselors
        </Link>
        <h1 className="font-display text-3xl font-bold mb-1">Book a Session</h1>
        <p className="text-muted-foreground text-sm">Choose a counselor, session type, date and time.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8 w-fit">
        {(["book", "my"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "book" ? "Book Session" : "My Bookings"}
          </button>
        ))}
      </div>

      {tab === "my" ? <MyBookings /> : (
        <div className="space-y-6">
          {/* 1 — Counselor */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3"><CardTitle className="font-display text-lg">Select Counselor</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COUNSELORS.map((c) => (
                <button key={c.id} onClick={() => setSelectedCounselor(c)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedCounselor?.id === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">{c.initials}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.specialization}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* 2 — Session type */}
          {selectedCounselor && (
            <Card className="rounded-2xl animate-fade-in">
              <CardHeader className="pb-3"><CardTitle className="font-display text-lg">Session Type</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {SESSION_TYPES.map(({ value, label, icon: Icon }) => (
                  <button key={value} onClick={() => setSessionType(value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${sessionType === value ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 text-muted-foreground"}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 3 — Date */}
          {sessionType && (
            <Card className="rounded-2xl animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {days.map((day) => (
                    <button key={day.toISOString()} onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                      className={`p-3 rounded-xl text-center transition-all text-sm ${selectedDate?.toDateString() === day.toDateString() ? "bg-primary text-primary-foreground ring-2 ring-primary" : "bg-muted hover:bg-muted/80"}`}
                    >
                      <p className="font-medium">{day.toLocaleDateString("en-US", { weekday: "short" })}</p>
                      <p className="text-lg font-bold">{day.getDate()}</p>
                      <p className="text-xs">{day.toLocaleDateString("en-US", { month: "short" })}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4 — Time */}
          {selectedDate && (
            <Card className="rounded-2xl animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Select Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button key={time} onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${selectedTime === time ? "bg-primary text-primary-foreground ring-2 ring-primary" : "bg-muted hover:bg-muted/80"}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5 — Confirm */}
          {selectedCounselor && sessionType && selectedDate && selectedTime && (
            <div className="animate-fade-in space-y-3">
              <div className="bg-muted rounded-xl p-4 text-sm space-y-1">
                <p className="font-semibold">{selectedCounselor.name}</p>
                <p className="text-muted-foreground capitalize">
                  {SESSION_TYPES.find((s) => s.value === sessionType)?.label} · {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {selectedTime}
                </p>
              </div>
              <Button onClick={handleConfirm} size="lg" className="w-full rounded-xl font-display text-base" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirming…</> : "Confirm Appointment"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Subject to our 24-hour cancellation policy.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
