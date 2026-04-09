import { Link, useLocation } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();

  // Hide footer on emergency page
  if (location.pathname === "/emergency") return null;

  const location = useLocation();

  // Hide footer on emergency page
  if (location.pathname === "/emergency") return null;

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="font-display text-lg font-bold">MindCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Supporting  students' mental health and wellbeing. You're never alone.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/resources" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Resources</Link>
              <Link to="/counselors" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Counselors</Link>
              <Link to="/assessment" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Self-Assessment</Link>
              <Link to="/community" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Community</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Emergency</h4>
            <div className="space-y-2">
              <Link to="/emergency" className="block text-sm text-destructive font-medium hover:underline">Get Help Now</Link>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Kenya Crisis: 0800 723 253
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Befrienders: +254 722 178 177
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Contact </h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> counseling@contact.ac.ke
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Student Affairs Office
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MindCare. Built with 💗 for student wellbeing.</p>
        </div>
      </div>
    </footer>
  );
}
