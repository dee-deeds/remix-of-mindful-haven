import { Video, Brain, Heart, Users, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  servicesImg: string;
}

const services = [
  { icon: Video, title: "Online Counseling Sessions", desc: "Connect with certified counselors through secure video or chat sessions." },
  { icon: Heart, title: "Mindful Wellness Activities", desc: "Balance your mind and body through guided wellness resources." },
  { icon: Brain, title: "Mental Health Assessments", desc: "Understand your emotional state with clinically informed assessments." },
  { icon: Users, title: "Individual Therapy", desc: "Personalised, one-on-one sessions focused on helping you overcome stress." },
];

export function ServicesSection({ servicesImg }: Props) {
  return (
    <section className="bg-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-2">Our Services</p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            Mental health care that feels safe,<br />
            simple, and <span className="font-serif italic font-normal text-primary">supportive.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Comprehensive care designed around your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Left column - 2 cards */}
          <div className="flex flex-col gap-6">
            {services.slice(0, 2).map((s) => (
              <Card key={s.title} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Center image */}
          <div className="rounded-2xl overflow-hidden shadow-md hidden md:block">
            <img src={servicesImg} alt="Therapy and wellness" loading="lazy" width={512} height={768} className="w-full h-full object-cover" />
          </div>

          {/* Right column - 2 cards */}
          <div className="flex flex-col gap-6">
            {services.slice(2).map((s) => (
              <Card key={s.title} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
