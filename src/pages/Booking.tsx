import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

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
  // Placeholder month
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
      <DashboardLayout>
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
            <div className="flex gap-3 justify-center pt-4">
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-full font-headline">Go to Dashboard</Button>
              </Link>
              <Link to="/counselors">
                <Button className="rounded-full font-headline">View Counselors</Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 pt-24 lg:pt-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">Book your sanctuary.</h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Choose a time that works for you. Our sessions are designed to be a safe, quiet space for reflection and growth.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Calendar + Slots */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            {/* Calendar */}
            <div className="bg-surface-container-low rounded-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-xl font-bold flex items-center gap-2">
                  Select Date
                  <span className="text-muted-foreground font-normal text-sm">— October 2024</span>
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-card transition-colors text-muted-foreground">←</button>
                  <button className="p-2 rounded-full hover:bg-card transition-colors text-muted-foreground">→</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4 text-center">
                {daysOfWeek.map((d) => (
                  <div key={d} className="text-muted-foreground text-xs font-bold uppercase tracking-widest pb-4">{d}</div>
                ))}
                {calendarDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => d.isCurrentMonth && setSelectedDay(d.day)}
                    className={`h-14 flex items-center justify-center rounded-xl transition-all relative ${
                      !d.isCurrentMonth
                        ? "text-muted-foreground/30"
                        : selectedDay === d.day
                        ? "bg-primary text-primary-foreground font-bold ring-4 ring-primary-fixed"
                        : "hover:bg-card cursor-pointer"
                    }`}
                  >
                    {d.day}
                    {d.hasEvent && d.isCurrentMonth && selectedDay !== d.day && (
                      <div className="absolute bottom-2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-card rounded-xl p-8 editorial-shadow">
              <h2 className="font-headline text-xl font-bold mb-6">Available Slots</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => !slot.disabled && setSelectedTime(slot.time)}
                    disabled={slot.disabled}
                    className={`py-4 px-6 rounded-xl text-center transition-all ${
                      slot.disabled
                        ? "opacity-40 cursor-not-allowed border-2 border-surface-container-low"
                        : selectedTime === slot.time
                        ? "border-2 border-primary bg-primary/5"
                        : "border-2 border-surface-container-low hover:border-primary-container hover:bg-primary-fixed/20"
                    }`}
                  >
                    <p className={`text-sm font-bold ${slot.disabled ? "text-muted-foreground line-through" : selectedTime === slot.time ? "text-primary" : ""}`}>
                      {slot.time}
                    </p>
                    <p className={`text-[10px] uppercase tracking-widest mt-1 ${selectedTime === slot.time ? "text-primary" : "text-muted-foreground"}`}>
                      {selectedTime === slot.time ? "Selected" : slot.disabled ? "Booked" : slot.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Confirmation */}
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
                    <p className="font-bold">{selectedTime} — {selectedTime === "10:30 AM" ? "11:30 AM" : "Next hour"}</p>
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
    </DashboardLayout>
  );
}
