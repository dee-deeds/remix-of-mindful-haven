import { Link } from "react-router-dom";
import { ArrowRight, Users, Shield, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  aboutYoga: string;
  aboutSunset: string;
}

const highlights = [
  { icon: Users, label: "2,500+ Students Supported" },
  { icon: Heart, label: "One-on-one therapy" },
  { icon: Shield, label: "Confidential & secure sessions" },
  { icon: Award, label: "Licensed mental health professionals" },
];

export function AboutSection({ aboutYoga, aboutSunset }: Props) {
  const { user } = useAuth();

  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <p className="text-sm font-medium text-primary mb-2">About Us</p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
            Mental Health Shouldn't<br />
            <span className="font-serif italic font-normal text-primary">Feel Complicated</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            By combining professional care with thoughtful technology, MindCare helps
            students move from confusion to clarity, from struggle to strength.
          </p>

          <div className="space-y-3 mb-8">
            {highlights.map((h) => (
              <div key={h.label} className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mr-2">
                <h.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{h.label}</span>
              </div>
            ))}
          </div>

          <Link to={user ? "/dashboard" : "/signup"}>
            <Button className="rounded-full font-display gap-2">
              {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Images - arch shapes */}
        <div className="flex gap-4 justify-center">
          <div className="w-48 md:w-56 rounded-t-full rounded-b-3xl overflow-hidden shadow-lg">
            <img src={aboutYoga} alt="Person practicing yoga" loading="lazy" width={512} height={640} className="w-full h-72 md:h-80 object-cover" />
          </div>
          <div className="w-48 md:w-56 rounded-t-full rounded-b-3xl overflow-hidden shadow-lg mt-8">
            <img src={aboutSunset} alt="Person meditating at sunset" loading="lazy" width={512} height={640} className="w-full h-72 md:h-80 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
