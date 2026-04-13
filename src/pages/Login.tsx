import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LocationState {
  from?: string;
  expired?: boolean;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const state = (location.state ?? {}) as LocationState;
  // Where to go after login — default to dashboard
  const returnTo = state.from ?? "/dashboard";
  const wasExpired = state.expired === true;

  // If already logged in, skip the login page entirely
  useEffect(() => {
    if (!authLoading && user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, authLoading, navigate, returnTo]);

  if (authLoading || user) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      // Replace so the user can't hit Back and land on the login page
      navigate(returnTo, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Heart className="h-6 w-6 text-primary fill-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
        </CardHeader>
        <CardContent>
          {/* Session-expired notice */}
          {wasExpired && (
            <div className="flex items-start gap-3 mb-4 rounded-xl bg-warning/10 border border-warning/20 px-4 py-3 text-sm text-foreground">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-warning" />
              <span>Your session expired. Please sign in again to continue.</span>
            </div>
          )}

          {/* Return-path notice (non-expired redirects) */}
          {!wasExpired && returnTo !== "/dashboard" && (
            <div className="mb-4 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              Sign in to continue to <span className="font-medium text-foreground">{returnTo}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-12 rounded-xl bg-surface-container-high border-none h-12"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 rounded-xl bg-surface-container-high border-none h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl font-display" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
