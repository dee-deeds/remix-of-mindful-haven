import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function CTASection() {
  const { user } = useAuth();

  return (
    <section className="bg-foreground text-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Your Mental Health<br />
              Matters, <span className="font-serif italic font-normal text-primary">Start Today</span>
            </h2>
            <p className="text-background/70 mb-8 max-w-md">
              Take the first step toward clarity, balance,
              and professional support.
            </p>
            <Link to={user ? "/dashboard/counselors" : "/counselors"}>
              <Button size="lg" variant="outline" className="rounded-full font-display gap-2 border-background/30 text-background hover:bg-background/10">
                Connect with a Counselor Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-48 md:w-64 h-80 md:h-96 rounded-3xl bg-primary/20 flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
                <span className="font-display font-bold text-primary text-lg">MindCare</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
