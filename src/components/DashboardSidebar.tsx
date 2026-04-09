import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileQuestion,
  Calendar,
  BookOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileQuestion, label: "Assessments", path: "/assessment" },
  { icon: Calendar, label: "Appointments", path: "/booking" },
  { icon: BookOpen, label: "Resources", path: "/resources" },
  { icon: Settings, label: "Settings", path: "#" },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.display_name || "Student";

  return (
    <aside className="hidden lg:flex flex-col gap-6 py-10 bg-surface-container-low h-screen w-72 rounded-r-xl sticky top-[72px] editorial-shadow">
      <div className="px-8 mb-4">
        <p className="text-xs text-muted-foreground font-label uppercase tracking-widest">
          The Sanctuary
        </p>
        <h2 className="font-headline text-lg font-bold text-primary mt-1">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm">{displayName}</p>
      </div>

      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`mx-4 py-3 px-6 flex items-center gap-3 transition-all rounded-full ${
                isActive
                  ? "bg-card text-primary font-bold editorial-shadow"
                  : "text-muted-foreground hover:translate-x-1"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-8">
        <Link to="/booking">
          <Button className="w-full rounded-full font-headline editorial-shadow gap-2">
            <Calendar className="h-4 w-4" />
            Book Session
          </Button>
        </Link>
      </div>
    </aside>
  );
}
