import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Brain, Calendar, BookOpen,
  Users, UserSearch, AlertTriangle, LogOut, Menu, X,
  Moon, Sun, ChevronRight, CalendarDays,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import logo from "@/assets/logo.png";

const COLLAPSE_KEY = "sidebar-collapsed";

const sideNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/assessment", icon: Brain, label: "Self-Assessment" },
  { to: "/dashboard/booking", icon: Calendar, label: "Book Session" },
  { to: "/dashboard/resources", icon: BookOpen, label: "Resources" },
  { to: "/dashboard/counselors", icon: UserSearch, label: "Counselors" },
  { to: "/dashboard/community", icon: Users, label: "Community" },
  { to: "/dashboard/events", icon: CalendarDays, label: "Events" },
  { to: "/dashboard/emergency", icon: AlertTriangle, label: "Emergency", danger: true },
];

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Collapsible state — persisted to localStorage
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Shared nav link renderer
  const NavLink = ({
    to, icon: Icon, label, danger,
  }: typeof sideNavItems[number]) => {
    const active = location.pathname === to || location.pathname.startsWith(to + "/");

    const cls = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
      ${active
        ? "bg-primary/10 text-primary font-semibold"
        : danger
          ? "text-destructive hover:bg-destructive/5"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"}
      ${collapsed ? "justify-center" : ""}`;

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={to} className={cls}>
              <Icon className="h-5 w-5 shrink-0" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link to={to} className={cls}>
        <Icon className="h-4.5 w-4.5 shrink-0" />
        <span className="flex-1 truncate">{label}</span>
        {active && <ChevronRight className="h-4 w-4 opacity-40 shrink-0" />}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col bg-card border-r sticky top-0 h-screen transition-[width] duration-200 ease-in-out overflow-hidden
          ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Brand + collapse toggle */}
        <div className={`flex items-center border-b shrink-0 ${collapsed ? "flex-col gap-2 py-4 px-2" : "justify-between px-4 h-16"}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center min-w-0">
              <img src={logo} alt="MindCare" className="h-8 w-auto" />
            </Link>
          )}
          {collapsed && (
            <Link to="/">
              <img src={logo} alt="MindCare" className="h-7 w-auto" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed
              ? <PanelLeftOpen className="h-4 w-4" />
              : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* User avatar / info */}
        {!collapsed ? (
          <div className="mx-3 mt-4 mb-1 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 shrink-0">
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <p className="font-display font-semibold text-sm truncate">{displayName}</p>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mx-auto mt-3 mb-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 cursor-default">
                <span className="font-display text-xs font-bold text-primary">{initials}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{displayName}</TooltipContent>
          </Tooltip>
        )}

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-0">
          {sideNavItems.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>

        {/* Bottom actions — always visible because nav is scrollable */}
        <div className={`shrink-0 border-t p-2 space-y-0.5 ${collapsed ? "flex flex-col items-center" : ""}`}>
          {/* Theme toggle */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          )}

          {/* Sign out */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  className="p-2.5 rounded-xl text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}

          {/* Back to public site */}
          {!collapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted"
            >
              <ChevronRight className="h-3 w-3 rotate-180 shrink-0" />
              Back to public site
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between px-4 h-14">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="MindCare" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="h-9 w-9">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile drawer — full-height overlay */}
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              {/* Drawer panel */}
              <div className="fixed top-14 left-0 bottom-0 z-50 w-72 bg-card border-r flex flex-col animate-fade-in">
                {/* User */}
                <div className="p-4 border-b">
                  <p className="text-xs text-muted-foreground">Welcome back</p>
                  <p className="font-display font-semibold">{displayName}</p>
                </div>

                {/* Scrollable nav */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                  {sideNavItems.map(({ to, icon: Icon, label, danger }) => {
                    const active = location.pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary font-semibold"
                            : danger
                              ? "text-destructive hover:bg-destructive/5"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                        {active && <ChevronRight className="ml-auto h-4 w-4 opacity-40" />}
                      </Link>
                    );
                  })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t space-y-0.5">
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 shrink-0" />
                    Back to public site
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
