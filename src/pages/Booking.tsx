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
            <p className="text-xs text-muted-foreground">You'll receive a confirmation email with details.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard"><Button variant="outline" className="rounded-xl">Go to Dashboard</Button></Link>
              <Link to="/dashboard/counselors"><Button className="rounded-xl">View Counselors</Button></Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link to="/dashboard/counselors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Counselors
      </Link>

      <h1 className="font-display text-3xl font-bold mb-2">Book an Appointment</h1>
      <p className="text-muted-foreground mb-8">Select a date and time that works for you.</p>

      {/* Date Selection */}
      <Card className="rounded-2xl mb-6">
        <CardHeader>
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

      {/* Time Selection */}
      {selectedDate && (
        <Card className="rounded-2xl mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Select Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
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
