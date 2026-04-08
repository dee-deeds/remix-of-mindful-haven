import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Shaun Moore",
    role: "Student",
    text: "MindCare helped me understand my mental health better. The reminders and progress reports kept me consistent and hopeful.",
    rating: 5.0,
    initials: "SM",
  },
  {
    name: "James Lee",
    role: "Engineering Student",
    text: "MindCare made it easy to talk to a counselor without fear. The reminders and progress reports kept me consistent and hopeful.",
    rating: 5.0,
    initials: "JL",
    featured: true,
  },
  {
    name: "Roberto Carlos",
    role: "Campus Leader",
    text: "The app feels calm and private, exactly what I needed. Booking sessions and tracking my mood is simple and stress-free.",
    rating: 5.0,
    initials: "RC",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="text-center mb-14">
        <p className="text-sm font-medium text-primary mb-2">Testimonials</p>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
          Real Stories. <span className="font-serif italic font-normal text-primary">Real Healing.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <Card key={t.name} className={`rounded-2xl border-0 shadow-sm ${t.featured ? 'bg-primary/10' : 'bg-card'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {t.initials}
                </div>
                {t.featured && (
                  <div className="flex-1" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">{t.rating}</span>
                  <Star className="h-3 w-3 text-warning fill-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
