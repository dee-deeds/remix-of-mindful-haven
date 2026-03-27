import { Link, useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();

  // Hide footer on emergency page
  if (location.pathname === "/emergency") return null;

  return (
    <footer className="w-full py-12 px-8 mt-20 bg-surface-container">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
        <div className="space-y-4">
          <p className="text-lg font-bold text-foreground font-headline">
            The Editorial Sanctuary
          </p>
          <p className="font-label text-xs uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} The Editorial Sanctuary. Student Wellness Initiative.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 md:justify-end items-center">
          <span className="font-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Privacy Policy
          </span>
          <span className="font-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Terms of Service
          </span>
          <span className="font-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Accessibility
          </span>
          <Link
            to="/emergency"
            className="font-label text-xs uppercase tracking-widest text-primary font-bold hover:underline underline-offset-4"
          >
            Crisis Resources
          </Link>
        </div>
      </div>
    </footer>
  );
}
