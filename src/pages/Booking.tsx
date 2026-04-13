import { useState } from "react";
import { Calendar, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const generateDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) {
      days.push(d);
    }
  }
  return days;
};

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const days = generateDays();

  const handleConfirm = () => setConfirmed(true);

  if (confirmed && selectedDate && selectedTime) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="rounded-2xl text-center">
          <CardContent className="p-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h2 className="font-display text-2xl font-bold">Appointment Confirmed!</h2>
            <p className="text-muted-foreground">Your session has been booked successfully.</p>
            <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
              <p className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> {selectedTime}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">You'll receive a confirmation email with details.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard"><Button variant="outline" className="rounded-xl">Go to Dashboard</Button></Link>
              <Link to="/dashboard/counselors"><Button className="rounded-xl">View Counselors</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
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
          </CardContent>
        </Card>
      )}

      {/* Confirm */}
      {selectedDate && selectedTime && (
        <div className="animate-fade-in">
          <Button onClick={handleConfirm} size="lg" className="w-full rounded-xl font-display text-base">
            Confirm Appointment
          </Button>
        </div>
      )}
    </div>
  );
}
