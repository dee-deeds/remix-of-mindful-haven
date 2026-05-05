import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, Video, MapPin, MessageSquare, ArrowLeft, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ── Static data ───────────────────────────────────────────────────────────────

const counselors = [
  { id: 1, name: "Dr. Amina Wanjiku",  initials: "AW", specialization: "Anxiety & Stress" },
  { id: 2, name: "Dr. Peter Ochieng",  initials: "PO", specialization: "Depression" },
  { id: 3, name: "Joyce Muthoni",      initials: "JM", specialization: "Relationships" },
  { id: 4, name: "Dr. Hassan Ali",     initials: "HA", specialization: "Trauma" },
  { id: 5, name: "Grace Njeri",        initials: "GN", specialization: "Academic" },
  { id: 6, name: "Dr. David Kimani",   initials: "DK", specialization: "Addiction" },
];

const SESSION_TYPES = [
  { value: "video",      label: "Video Call",  icon: Video },
  { value: "in-person",  label: "In-Person",   icon: MapPin },
  { value: "chat",       label: "Chat",        icon: MessageSquare },
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
  counselor_name: string;
  session_type: SessionType;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  created_at: string;
}

// ── My Bookings tab ───────────────────────────────────────────────────────────

function MyBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetch = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data as Booking[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user]);

  const cancel = async (id: string) => {
    setCancelling(id);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) {
      toast({ title: "Failed to cancel", description: error.message, variant: "destructive" });
    } else {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
      toast({ title: "Booking cancelled" });
    }
    setCancelling(null);
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

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-3">Upcoming</h3>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <Card key={b.id} className="rounded-2xl border-primary/20 bg-primary/5">
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-display font-bold">{b.counselor_name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {b.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {b.time}</span>
                      <Badge variant="secondary" className="rounded-full text-xs capitalize">{b.session_type}</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
                    onClick={() => cancel(b.id)}
                    disabled={cancelling === b.id}
                  >
                    {cancelling === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="h-3.5 w-3.5 mr-1" />Cancel</>}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-3">Past</h3>
          <div className="space-y-3">
            {past.map((b) => (
              <Card key={b.id} className="rounded-2xl opacity-60">
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-display font-bold">{b.counselor_name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {b.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {b.time}</span>
                      <Badge variant="outline" className="rounded-full text-xs capitalize">{b.session_type}</Badge>
                    </div>
                  </div>
                  <Badge
                    variant={b.status === "cancelled" ? "destructive" : "secondary"}
                    className="rounded-full text-xs capitalize shrink-0"
                  >
                    {b.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Booking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"book" | "my">("book");

  // Pre-fill counselor from URL param (e.g. /dashboard/booking?counselorId=2)
  const presetId = searchParams.get("counselorId");
  const presetCounselor = counselors.find((c) => c.id === Number(presetId)) ?? null;

  const [selectedCounselor, setSelectedCounselor] = useState(presetCounselor);
  const [sessionType, setSessionType]   = useState<SessionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
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

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      setConfirmed(true);
    }
  };

  // ── Confirmation screen ──────────────────────────────────────────────────────
  if (confirmed && selectedCounselor && sessionType && selectedDate && selectedTime) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="rounded-2xl text-center">
          <CardContent className="p-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h2 className="font-display text-2xl font-bold">Appointment Confirmed!</h2>
            <p className="text-muted-foreground">Your session has been booked successfully.</p>
            <div className="bg-muted rounded-xl p-4 space-y-2 text-sm text-left">
              <p className="flex items-center gap-2 font-medium">{selectedCounselor.name}</p>
              <p className="flex items-center gap-2 text-muted-foreground capitalize">
                {SESSION_TYPES.find((s) => s.value === sessionType)?.label} session
              </p>
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {selectedTime}</p>
            </div>
            <p className="text-xs text-muted-foreground">You'll receive a confirmation email with session details.</p>
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
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "book" ? "Book Session" : "My Bookings"}
          </button>
        ))}
      </div>

      {tab === "my" ? <MyBookings /> : (
        <div className="space-y-6">
          {/* 1 — Counselor */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">Select Counselor</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {counselors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCounselor(c)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    selectedCounselor?.id === c.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">
                    {c.initials}
                  </div>
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
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">Session Type</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {SESSION_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSessionType(value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      sessionType === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground"
                    }`}
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
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {days.map((day) => (
                    <button
                      key={day.toISOString()}
                      onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                      className={`p-3 rounded-xl text-center transition-all text-sm ${
                        selectedDate?.toDateString() === day.toDateString()
                          ? "bg-primary text-primary-foreground ring-2 ring-primary"
                          : "bg-muted hover:bg-muted/80"
                      }`}
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
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Select Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "bg-primary text-primary-foreground ring-2 ring-primary"
                          : "bg-muted hover:bg-muted/80"
                      }`}
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
              <div className="bg-muted rounded-xl p-4 text-sm space-y-1.5">
                <p className="font-semibold">{selectedCounselor.name}</p>
                <p className="text-muted-foreground capitalize">{SESSION_TYPES.find((s) => s.value === sessionType)?.label} · {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {selectedTime}</p>
              </div>
              <Button
                onClick={handleConfirm}
                size="lg"
                className="w-full rounded-xl font-display text-base"
                disabled={saving}
              >
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Confirming…</> : "Confirm Appointment"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Subject to our 24-hour cancellation policy.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
