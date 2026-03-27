import { useState } from "react";
import { Star, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const specializations = ["All", "Anxiety & Stress", "Depression", "Relationships", "Academic", "Trauma", "Addiction"];

const counselors = [
  { id: 1, name: "Dr. Amina Wanjiku", specialization: "Anxiety & Stress", rating: 4.9, reviews: 42, location: "JKUAT Main Campus", availability: "Mon-Fri", image: "AW", experience: "8 years" },
  { id: 2, name: "Dr. Peter Ochieng", specialization: "Depression", rating: 4.8, reviews: 38, location: "JKUAT Main Campus", availability: "Mon-Wed, Fri", image: "PO", experience: "12 years" },
  { id: 3, name: "Joyce Muthoni", specialization: "Relationships", rating: 4.7, reviews: 55, location: "Online", availability: "Tue-Sat", image: "JM", experience: "5 years" },
  { id: 4, name: "Dr. Hassan Ali", specialization: "Trauma", rating: 4.9, reviews: 31, location: "JKUAT Main Campus", availability: "Mon-Thu", image: "HA", experience: "15 years" },
  { id: 5, name: "Grace Njeri", specialization: "Academic", rating: 4.6, reviews: 67, location: "Online", availability: "Mon-Fri", image: "GN", experience: "6 years" },
  { id: 6, name: "Dr. David Kimani", specialization: "Addiction", rating: 4.8, reviews: 29, location: "JKUAT Main Campus", availability: "Wed-Fri", image: "DK", experience: "10 years" },
];

export default function Counselors() {
  const [activeSpec, setActiveSpec] = useState("All");

  const filtered = counselors.filter((c) => activeSpec === "All" || c.specialization === activeSpec);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Find a Counselor</h1>
        <p className="text-muted-foreground">Connect with verified, compassionate professionals who understand student life.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {specializations.map((spec) => (
          <Button
            key={spec}
            variant={activeSpec === spec ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSpec(spec)}
            className="rounded-full"
          >
            {spec}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((counselor) => (
          <Card key={counselor.id} className="rounded-2xl hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center font-display font-bold text-primary text-lg shrink-0">
                  {counselor.image}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold truncate">{counselor.name}</h3>
                  <Badge variant="secondary" className="rounded-full text-xs mt-1">{counselor.specialization}</Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="font-medium text-foreground">{counselor.rating}</span>
                  <span>({counselor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {counselor.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {counselor.availability}
                </div>
                <div className="text-sm text-muted-foreground">
                  {counselor.experience} experience
                </div>
              </div>

              <Link to="/booking">
                <Button className="w-full rounded-xl font-display gap-2">
                  <Calendar className="h-4 w-4" /> Book Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
