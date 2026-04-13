import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const timeSlots = [
  { time: "09:00 AM", label: "Morning" },
  { time: "10:30 AM", label: "Selected", selected: true },
  { time: "01:00 PM", label: "Afternoon" },
  { time: "02:30 PM", label: "Booked", disabled: true },
  { time: "04:00 PM", label: "Afternoon" },
  { time: "05:30 PM", label: "Evening" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const generateCalendarDays = () => {
  const days: { day: number; isCurrentMonth: boolean; hasEvent?: boolean }[] = [];
  days.push({ day: 29, isCurrentMonth: false });
  days.push({ day: 30, isCurrentMonth: false });
  for (let i = 1; i <= 19; i++) {
    days.push({ day: i, isCurrentMonth: true, hasEvent: i === 15 || i === 18 });
  }
  return days;
};

export default function Booking() {
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [confirmed, setConfirmed] = useState(false);

  const calendarDays = generateCalendarDays();

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 pt-24 lg:pt-20">
          <div className="bg-card rounded-xl p-12 text-center editorial-shadow space-y-6">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h2 className="text-3xl font-headline font-extrabold">Appointment Confirmed!</h2>
            <p className="text-on-surface-variant">Your sanctuary session has been booked.</p>
            <div className="bg-surface-container-low rounded-xl p-6 space-y-3 text-sm">
              <p className="font-bold">Monday, October {selectedDay}</p>
              <p>{selectedTime} — {selectedTime === "10:30 AM" ? "11:30 AM" : "Next hour"}</p>
              <p className="text-primary font-medium">Dr. Elena Vance</p>
            </div>
            <p className="text-xs text-muted-foreground">You'll receive a confirmation email with details.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard"><Button variant="outline" className="rounded-xl">Go to Dashboard</Button></Link>
              <Link to="/dashboard/counselors"><Button className="rounded-xl">View Counselors</Button></Link>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight mb-2">Book a Session</h1>
        <p className="text-on-surface-variant mb-10">Pick a date and time with Dr. Elena Vance.</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Calendar + Time */}
          <div className="space-y-8">
            {/* Calendar */}
            <div className="bg-card rounded-xl p-8 editorial-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline text-lg font-bold">October 2024</h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-primary-fixed transition-colors">‹</button>
                  <button className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-primary-fixed transition-colors">›</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {daysOfWeek.map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-muted-foreground py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => d.isCurrentMonth && setSelectedDay(d.day)}
                    className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all ${
                      !d.isCurrentMonth
                        ? "text-muted-foreground/30"
                        : selectedDay === d.day
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary-fixed"
                    }`}
                  >
                    {d.day}
                    {d.hasEvent && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-card rounded-xl p-8 editorial-shadow">
              <h2 className="font-headline text-lg font-bold mb-6">Available Times — Oct {selectedDay}</h2>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={slot.disabled}
                    onClick={() => !slot.disabled && setSelectedTime(slot.time)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      slot.disabled
                        ? "bg-surface-container-high text-muted-foreground/40 cursor-not-allowed"
                        : selectedTime === slot.time
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-container-low hover:bg-primary-fixed"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-xl p-8 sticky top-24">
              <h2 className="font-headline text-xl font-bold mb-6">Your Selection</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-primary editorial-shadow">📅</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Date</p>
                    <p className="font-bold">Monday, October {selectedDay}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-primary editorial-shadow">🕐</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Time</p>
                    <p className="font-bold">{selectedTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-primary editorial-shadow">👤</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Counselor</p>
                    <p className="font-bold">Dr. Elena Vance</p>
                  </div>
                </div>

                <div className="pt-6 border-t-4 border-surface-container-high rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-bold">Free (Student Plan)</span>
                  </div>
                  <Button onClick={() => setConfirmed(true)} className="w-full rounded-full font-headline py-4">
                    Confirm Appointment
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-4 px-4 leading-relaxed uppercase tracking-widest">
                    By confirming, you agree to our 24h cancellation policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Counselor snippet */}
            <div className="bg-card rounded-xl p-6 flex items-center gap-4 editorial-shadow">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-xl font-bold text-primary font-headline">
                EV
              </div>
              <div>
                <p className="text-xs text-primary font-bold">Your Specialist</p>
                <p className="font-headline font-bold">Dr. Elena Vance</p>
                <p className="text-xs text-muted-foreground">Clinical Psychologist, PhD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
