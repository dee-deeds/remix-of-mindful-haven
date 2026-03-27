import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";

const publicLinks = [
  { label: "Home", path: "/" },
  { label: "Resources", path: "/resources" },
  { label: "Counselors", path: "/counselors" },
  { label: "Community", path: "/community" },
  { label: "Events", path: "/events" },
  { label: "Emergency", path: "/emergency" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary fill-primary" />
          <span className="font-display text-xl font-bold text-foreground">MindCare</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/20 text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-xl font-display gap-2">
                  <User className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="rounded-xl font-display">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-xl font-display">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 pb-4 animate-fade-in">
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/20 text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 rounded-xl font-display">Dashboard</Button>
              </Link>
              <Button variant="ghost" className="w-full mt-2 rounded-xl font-display gap-2" onClick={() => { signOut(); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <div className="flex gap-2 mt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl font-display">Log In</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button className="w-full rounded-xl font-display">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
