import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { Home, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import animationData from "@/assets/Error 404 Animation.json";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Brand mark */}
      <Link to="/" className="flex items-center gap-2 mb-10 group">
        <Heart className="h-6 w-6 text-primary fill-primary group-hover:scale-110 transition-transform" />
        <span className="font-display text-lg font-bold text-foreground">MindCare</span>
      </Link>

      {/* Lottie animation */}
      <div
        className="w-64 h-64 md:w-80 md:h-80 cursor-pointer select-none"
        onClick={() => {
          lottieRef.current?.stop();
          lottieRef.current?.play();
        }}
        title="Click to replay"
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Text */}
      <div className="text-center mt-4 max-w-md space-y-3">
        <h1 className="font-display text-7xl font-extrabold text-primary">404</h1>
        <h2 className="font-display text-2xl font-bold text-foreground">
          You seem a little lost
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          That's okay — even wandering minds find their way back.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button
          variant="ghost"
          className="rounded-xl gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
        <Link to={user ? "/dashboard" : "/"}>
          <Button className="rounded-xl gap-2 font-display">
            <Home className="h-4 w-4" />
            {user ? "Back to Dashboard" : "Return Home"}
          </Button>
        </Link>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground mt-10 opacity-60">
        {/* Lost path: <span className="font-mono">{location.pathname}</span> */}
      </p>
    </div>
  );
}
