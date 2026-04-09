import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, Smile, Meh, Frown, Angry,
  BookOpen, Users, AlertTriangle, Calendar,
  Brain, TrendingUp, TrendingDown, Minus,
  Flame, ArrowRight, Loader2, CheckCircle2,
  UserSearch, CalendarDays,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useWellbeing, buildRecommendations, analyseDomains } from "@/hooks/useWellbeing";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

// ─── Mood options ─────────────────────────────────────────────────────────────

const MOODS = [
  { icon: Heart,  label: "Great",      value: 5, color: "text-success",          bg: "bg-success/10 ring-success" },
  { icon: Smile,  label: "Good",       value: 4, color: "text-primary",          bg: "bg-primary/10 ring-primary" },
  { icon: Meh,    label: "Okay",       value: 3, color: "text-warning",          bg: "bg-warning/10 ring-warning" },
  { icon: Frown,  label: "Low",        value: 2, color: "text-muted-foreground", bg: "bg-muted ring-muted-foreground" },
  { icon: Angry,  label: "Struggling", value: 1, color: "text-destructive",      bg: "bg-destructive/10 ring-destructive" },
];

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { icon: Brain,        title: "Self-Assessment", path: "/dashboard/assessment", desc: "Check your wellbeing" },
  { icon: Calendar,     title: "Book Session",    path: "/dashboard/booking",    desc: "Talk to a counselor" },
  { icon: BookOpen,     title: "Resources",       path: "/dashboard/resources",  desc: "Articles & guides" },
  { icon: Users,        title: "Community",       path: "/dashboard/community",  desc: "Join discussions" },
  { icon: UserSearch,   title: "Counselors",      path: "/dashboard/counselors", desc: "Browse our team" },
  { icon: CalendarDays, title: "Events",          path: "/dashboard/events",     desc: "Workshops & webinars" },
];

// ─── Custom tooltip for mood chart ───────────────────────────────────────────

function MoodTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  const val = payload[0].value as number;
  const mood = MOODS.find(m => m.value === Math.round(val));
  return (
    <div className="rounded-xl border bg-card px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-foreground">{payload[0]?.payload?.fullDate}</p>
      <p className={mood?.color ?? "text-foreground"}>
        {mood?.label ?? val} ({val}/5)
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    moodLogs, lastAssessment, assessResults, todayLog,
    wellbeing, streak, moodChartData, scoreTrend,
    logMood, loading,
  } = useWellbeing();

  const [pendingMood, setPendingMood]   = useState<number | null>(null);
  const [moodNote, setMoodNote]         = useState("");
  const [moodSaved, setMoodSaved]       = useState(false);
  const [savingMood, setSavingMood]     = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "there";

  // Recommendations from last assessment
  const recommendations = lastAssessment
    ? buildRecommendations(lastAssessment.answers, lastAssessment.level)
    : [];

  const topRecs = recommendations.slice(0, 3);

  // Domain breakdown (top 3 from last assessment)
  const topDomains = lastAssessment
    ? analyseDomains(lastAssessment.answers).filter(d => d.ratio >= 0.5).slice(0, 3)
    : [];

  // Handle mood save
  const handleSaveMood = async () => {
    if (pendingMood === null) return;
    setSavingMood(true);
    try {
      await logMood.mutateAsync({ mood_value: pendingMood, note: moodNote || undefined });
      setMoodSaved(true);
      setPendingMood(null);
      setMoodNote("");
      setTimeout(() => setMoodSaved(false), 4000);
    } catch (err: any) {
      toast({
        title: "Couldn't save mood",
        description: err?.message ?? "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingMood(false);
    }
  };

  // Score trend icon
  const TrendIcon =
    scoreTrend === "up"   ? TrendingUp   :
    scoreTrend === "down" ? TrendingDown :
    Minus;
  const trendColor =
    scoreTrend === "up"   ? "text-success"     :
    scoreTrend === "down" ? "text-destructive"  :
    "text-muted-foreground";
  const trendLabel =
    scoreTrend === "up"   ? "Improving"  :
    scoreTrend === "down" ? "Declining"  :
    scoreTrend === "flat" ? "Stable"     :
    null;

  const priorityColors: Record<string, string> = {
    urgent: "border-l-destructive bg-destructive/5",
    high:   "border-l-warning bg-warning/5",
    normal: "border-l-primary bg-primary/5",
  };
  const priorityBadge: Record<string, string> = {
    urgent: "destructive",
    high:   "secondary",
    normal: "outline",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="font-display text-3xl font-bold">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* ── Row 1: Wellbeing score + Streak + Last Assessment ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wellbeing score */}
        <Card className="rounded-2xl sm:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm text-muted-foreground font-medium">Wellbeing Score</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : wellbeing.score < 0 ? (
              <div>
                <p className="font-display text-4xl font-bold text-muted-foreground">—</p>
                <p className="text-xs text-muted-foreground mt-1">Log mood or take assessment to see score</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className={`font-display text-4xl font-bold ${wellbeing.color}`}>{wellbeing.score}</p>
                <p className={`text-sm font-semibold ${wellbeing.color}`}>{wellbeing.label}</p>
                <Progress value={wellbeing.score} className="h-1.5" />
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="rounded-2xl sm:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm text-muted-foreground font-medium">Mood Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <Flame className={`h-8 w-8 ${streak > 0 ? "text-warning" : "text-muted-foreground"}`} />
              <p className="font-display text-4xl font-bold">{streak}</p>
              <p className="text-sm text-muted-foreground pb-1">day{streak !== 1 ? "s" : ""}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {streak === 0
                ? "Log your mood today to start a streak!"
                : streak < 3
                  ? "Keep going — you're building a habit!"
                  : "Consistent check-ins help you spot patterns."}
            </p>
          </CardContent>
        </Card>

        {/* Last assessment */}
        <Card className="rounded-2xl sm:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm text-muted-foreground font-medium">Last Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            {!lastAssessment ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No assessment taken yet</p>
                <Button size="sm" className="rounded-lg w-full" onClick={() => navigate("/dashboard/assessment")}>
                  Take Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <p className="font-display text-4xl font-bold">{lastAssessment.score}</p>
                  <div className="flex flex-col">
                    <Badge variant="outline" className="text-xs w-fit">{lastAssessment.level}</Badge>
                    {trendLabel && (
                      <span className={`flex items-center gap-0.5 text-xs font-medium mt-0.5 ${trendColor}`}>
                        <TrendIcon className="h-3 w-3" />{trendLabel}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(lastAssessment.taken_at), "MMM d, yyyy")}
                </p>
                <button
                  onClick={() => navigate("/dashboard/assessment")}
                  className="text-xs text-primary hover:underline"
                >
                  View history →
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Mood check-in + 7-day chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Mood check-in */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Daily Mood Check-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayLog && !moodSaved ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <p className="text-sm text-success font-medium">Logged today</p>
                </div>
                <div className="flex gap-2">
                  {MOODS.map(m => (
                    <div
                      key={m.value}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-1 transition-all
                        ${todayLog.mood_value === m.value ? `ring-2 ${m.bg}` : "bg-muted/50 opacity-50"}`}
                    >
                      <m.icon className={`h-5 w-5 ${m.color}`} />
                      <span className="text-[10px] font-medium">{m.label}</span>
                    </div>
                  ))}
                </div>
                {todayLog.note && (
                  <p className="text-xs text-muted-foreground italic">"{todayLog.note}"</p>
                )}
                <button
                  onClick={() => setPendingMood(todayLog.mood_value)}
                  className="text-xs text-primary hover:underline"
                >
                  Update today's mood
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {moodSaved && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <p className="text-sm text-success font-medium">Mood saved! 💗</p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
                <div className="flex gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setPendingMood(m.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-1 transition-all
                        ${pendingMood === m.value
                          ? `ring-2 ${m.bg} scale-105`
                          : "bg-muted hover:bg-muted/80"}`}
                    >
                      <m.icon className={`h-5 w-5 ${m.color}`} />
                      <span className="text-[10px] font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
                {pendingMood !== null && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Add a note (optional)..."
                      value={moodNote}
                      onChange={e => setMoodNote(e.target.value)}
                      maxLength={200}
                      className="w-full text-xs rounded-lg border bg-muted/30 px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      className="w-full rounded-lg"
                      onClick={handleSaveMood}
                      disabled={savingMood}
                    >
                      {savingMood
                        ? <><Loader2 className="h-3 w-3 animate-spin mr-1" />Saving…</>
                        : "Save Mood"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 7-day mood chart */}
        <Card className="rounded-2xl lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">7-Day Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {moodLogs.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center gap-2">
                <p className="text-sm text-muted-foreground">No mood data yet.</p>
                <p className="text-xs text-muted-foreground">Start logging daily to see your trend here.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={moodChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                  <RechartsTooltip content={<MoodTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#moodGrad)"
                    dot={{ r: 3, fill: "hsl(var(--primary))" }}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Recommendations + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recommendations */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recommended Next Steps</h2>
            {lastAssessment && (
              <button
                onClick={() => navigate("/dashboard/assessment")}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Full results <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {!lastAssessment ? (
            <Card className="rounded-2xl">
              <CardContent className="p-6 text-center space-y-3">
                <Brain className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Take the self-assessment to get personalized recommendations.
                </p>
                <Button size="sm" className="rounded-lg" onClick={() => navigate("/dashboard/assessment")}>
                  Take Assessment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {topRecs.map((rec, i) => (
                <Link key={i} to={rec.path}>
                  <div className={`border-l-4 rounded-xl p-3 cursor-pointer transition-all hover:shadow-sm ${priorityColors[rec.priority]}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug">{rec.text}</p>
                        {rec.subtext && (
                          <p className="text-xs text-muted-foreground mt-0.5">{rec.subtext}</p>
                        )}
                      </div>
                      <Badge variant={priorityBadge[rec.priority] as any} className="shrink-0 text-xs capitalize">
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Top affected domains */}
              {topDomains.length > 0 && (
                <div className="pt-1">
                  <p className="text-xs text-muted-foreground mb-2">Areas to focus on:</p>
                  <div className="flex flex-wrap gap-2">
                    {topDomains.map(d => (
                      <span
                        key={d.name}
                        className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full"
                      >
                        <span>{d.icon}</span>
                        <span>{d.label}</span>
                        <span className="text-muted-foreground">({Math.round(d.ratio * 100)}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-display text-lg font-bold">Quick Access</h2>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.path} to={action.path}>
                <Card className="rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                  <CardContent className="p-3 flex flex-col gap-1.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-display font-semibold text-xs">{action.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{action.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Emergency shortcut */}
          <Link to="/dashboard/emergency">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Emergency Support</p>
                <p className="text-[10px] text-muted-foreground">24/7 crisis contacts</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
    </DashboardLayout>
  );
}
