import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Library", path: "/resources" },
  { label: "Directory", path: "/counselors" },
  { label: "Community", path: "/community" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  // Hide navbar on emergency page
  if (location.pathname === "/emergency") return null;

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel flex justify-between items-center px-6 md:px-8 py-4">
      <Link to="/" className="text-2xl font-bold tracking-tighter text-primary font-headline">
        The Editorial Sanctuary
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 font-headline text-sm tracking-tight">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`transition-colors ${
              location.pathname === link.path
                ? "text-primary font-semibold border-b-2 border-primary pb-1"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        {user ? (
          <>
            <Link to="/dashboard">
              <Button variant="ghost" className="rounded-full font-headline text-sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" className="rounded-full font-headline text-sm">Log In</Button>
            </Link>
          </>
        )}
        <Link to="/emergency">
          <Button className="rounded-full font-headline text-sm px-6">
            Emergency Help
          </Button>
        </Link>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 glass-panel md:hidden px-6 py-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg font-headline text-sm transition-colors ${
                location.pathname === link.path
                  ? "text-primary font-semibold bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full font-headline">Dashboard</Button>
                </Link>
                <Button variant="ghost" className="w-full rounded-full font-headline gap-2" onClick={() => { signOut(); setMobileOpen(false); }}>
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full rounded-full font-headline">Log In</Button>
              </Link>
            )}
            <Link to="/emergency" onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded-full font-headline">Emergency Help</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
