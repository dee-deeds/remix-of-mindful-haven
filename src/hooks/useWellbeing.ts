import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfDay, subDays, format, parseISO, isToday } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MoodLog {
  id: string;
  user_id: string;
  mood_value: number;
  note: string | null;
  logged_at: string;
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  score: number;
  level: string;
  answers: number[];
  taken_at: string;
}

export interface DomainScore {
  name: string;
  label: string;
  score: number;
  max: number;
  ratio: number;
  icon: string;
}

export interface SmartRecommendation {
  priority: "urgent" | "high" | "normal";
  text: string;
  subtext?: string;
  path: string;
  domain?: string;
}

// ─── Domain analyser ─────────────────────────────────────────────────────────

const DOMAIN_META: Record<string, { label: string; icon: string }> = {
  mood:            { label: "Low Mood",         icon: "😔" },
  anxiety:         { label: "Anxiety",           icon: "😰" },
  sleep:           { label: "Sleep",             icon: "😴" },
  energy:          { label: "Energy / Fatigue",  icon: "⚡" },
  appetite:        { label: "Appetite",          icon: "🍽️" },
  self_worth:      { label: "Self-Worth",        icon: "💛" },
  concentration:   { label: "Concentration",     icon: "🧠" },
  academic_stress: { label: "Academic Stress",   icon: "📚" },
};

export function analyseDomains(answers: number[]): DomainScore[] {
  const raw = [
    { name: "mood",            score: answers[0] + answers[1],  max: 6 },
    { name: "sleep",           score: answers[2],               max: 3 },
    { name: "energy",          score: answers[3],               max: 3 },
    { name: "appetite",        score: answers[4],               max: 3 },
    { name: "self_worth",      score: answers[5],               max: 3 },
    { name: "concentration",   score: answers[6],               max: 3 },
    { name: "anxiety",         score: answers[7] + answers[8],  max: 6 },
    { name: "academic_stress", score: answers[9],               max: 3 },
  ];

  return raw
    .map(d => ({
      ...d,
      ratio: d.score / d.max,
      label: DOMAIN_META[d.name].label,
      icon:  DOMAIN_META[d.name].icon,
    }))
    .sort((a, b) => b.ratio - a.ratio);
}

export function buildRecommendations(
  answers: number[],
  level: string,
): SmartRecommendation[] {
  const domains = analyseDomains(answers);
  const recs: SmartRecommendation[] = [];

  // Urgent: Significant level → book NOW
  if (level === "Significant") {
    recs.push({
      priority: "urgent",
      text: "Book a counselor session as soon as possible",
      subtext: "Your score suggests you should speak to a professional soon.",
      path: "/dashboard/booking",
      domain: "global",
    });
    recs.push({
      priority: "urgent",
      text: "View emergency support contacts",
      subtext: "Immediate help is available 24/7.",
      path: "/dashboard/emergency",
      domain: "global",
    });
  }

  // High: Moderate level → strongly encourage booking
  if (level === "Moderate") {
    recs.push({
      priority: "high",
      text: "Consider booking a counselor session this week",
      subtext: "Talking to someone can make a real difference.",
      path: "/dashboard/booking",
      domain: "global",
    });
  }

  // Domain-specific recommendations (top 3 affected domains that are above 50%)
  const significantDomains = domains.filter(d => d.ratio >= 0.5).slice(0, 3);

  for (const d of significantDomains) {
    switch (d.name) {
      case "mood":
        recs.push({
          priority: "high",
          text: "Read: Understanding & Managing Low Mood",
          subtext: "Mood patterns and evidence-based techniques.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        recs.push({
          priority: "normal",
          text: "Log your mood daily to spot patterns early",
          subtext: "Small data over time reveals a lot.",
          path: "/dashboard",
          domain: d.name,
        });
        break;
      case "anxiety":
        recs.push({
          priority: "high",
          text: "Try a 5-minute guided breathing exercise",
          subtext: "Activates your parasympathetic nervous system instantly.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        recs.push({
          priority: "normal",
          text: "Explore anxiety management techniques",
          subtext: "CBT, grounding, and journaling strategies.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        break;
      case "sleep":
        recs.push({
          priority: "high",
          text: "Read: Sleep Hygiene for Students",
          subtext: "Evidence-based strategies to improve sleep quality.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        break;
      case "academic_stress":
        recs.push({
          priority: "high",
          text: "Read: Managing Exam & Academic Stress",
          subtext: "Proven study habits and pressure-release techniques.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        recs.push({
          priority: "normal",
          text: "Join the community — others are going through this too",
          subtext: "Peer support reduces academic isolation.",
          path: "/dashboard/community",
          domain: d.name,
        });
        break;
      case "self_worth":
        recs.push({
          priority: "high",
          text: "Read: Building Healthy Self-Esteem",
          subtext: "Small daily practices that shift self-perception.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        break;
      case "energy":
        recs.push({
          priority: "normal",
          text: "Explore fatigue and burnout recovery resources",
          subtext: "Rest is not a reward — it's a requirement.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        break;
      case "concentration":
        recs.push({
          priority: "normal",
          text: "Try the Pomodoro technique and focus resources",
          subtext: "Short focused bursts beat marathon study sessions.",
          path: "/dashboard/resources",
          domain: d.name,
        });
        break;
    }
  }

  // Minimal / Mild: preventive suggestions
  if (level === "Minimal" || level === "Mild") {
    recs.push({
      priority: "normal",
      text: "Continue your self-care routine — you're doing well",
      subtext: "Preventive care keeps minimal symptoms minimal.",
      path: "/dashboard/resources",
      domain: "global",
    });
  }

  // Always: retake in 2 weeks
  recs.push({
    priority: "normal",
    text: "Retake this assessment in 2 weeks to track progress",
    subtext: "Regular check-ins let you see how you're trending.",
    path: "/dashboard/assessment",
    domain: "global",
  });

  return recs;
}

// ─── Wellbeing score ──────────────────────────────────────────────────────────

export function calcWellbeingScore(
  moodLogs: MoodLog[],
  lastAssessment: AssessmentResult | null,
): { score: number; label: string; color: string } {
  const last7 = moodLogs.slice(0, 7);
  const hasMood = last7.length > 0;
  const hasAssessment = lastAssessment !== null;

  // Mood: avg 1-5 → 0-100
  const moodNorm = hasMood
    ? ((last7.reduce((s, l) => s + l.mood_value, 0) / last7.length) - 1) / 4 * 100
    : null;

  // Assessment: 0-30 lower = better → 0-100
  const assessNorm = hasAssessment
    ? (30 - lastAssessment!.score) / 30 * 100
    : null;

  let score: number;
  if (moodNorm !== null && assessNorm !== null) {
    score = Math.round(0.4 * moodNorm + 0.6 * assessNorm);
  } else if (moodNorm !== null) {
    score = Math.round(moodNorm);
  } else if (assessNorm !== null) {
    score = Math.round(assessNorm);
  } else {
    score = -1; // no data
  }

  const label =
    score < 0   ? "No data yet"  :
    score >= 75 ? "Thriving"     :
    score >= 50 ? "Doing OK"     :
    score >= 25 ? "Struggling"   : "Needs attention";

  const color =
    score < 0   ? "text-muted-foreground" :
    score >= 75 ? "text-success"          :
    score >= 50 ? "text-warning"          :
    score >= 25 ? "text-primary"          : "text-destructive";

  return { score, label, color };
}

// ─── 7-day mood chart data ────────────────────────────────────────────────────

export function buildMoodChartData(logs: MoodLog[]) {
  const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
  const logsByDay: Record<string, number> = {};
  logs.forEach(l => {
    const key = format(parseISO(l.logged_at), "yyyy-MM-dd");
    logsByDay[key] = l.mood_value;
  });

  return days.map(day => ({
    day: format(day, "EEE"),
    fullDate: format(day, "MMM d"),
    mood: logsByDay[format(day, "yyyy-MM-dd")] ?? null,
  }));
}

// ─── Streak counter ───────────────────────────────────────────────────────────

export function calcStreak(logs: MoodLog[]): number {
  if (logs.length === 0) return 0;
  let streak = 0;
  const sorted = [...logs].sort(
    (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
  );
  let cursor = new Date();
  // if today not logged, start counting from yesterday
  if (!isToday(parseISO(sorted[0].logged_at))) {
    cursor = subDays(cursor, 1);
  }
  for (const log of sorted) {
    const logDay = format(parseISO(log.logged_at), "yyyy-MM-dd");
    const cursorDay = format(cursor, "yyyy-MM-dd");
    if (logDay === cursorDay) {
      streak++;
      cursor = subDays(cursor, 1);
    } else {
      break;
    }
  }
  return streak;
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useWellbeing() {
  const { user } = useAuth();
  const qc = useQueryClient();

  // Last 30 days of mood logs
  const moodQuery = useQuery({
    queryKey: ["mood_logs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const since = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("user_id", user!.id)
        .gte("logged_at", since)
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MoodLog[];
    },
    staleTime: 60_000,
  });

  // All assessment results
  const assessQuery = useQuery({
    queryKey: ["assessment_results", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("taken_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(r => ({
        ...r,
        answers: r.answers as number[],
      })) as AssessmentResult[];
    },
    staleTime: 60_000,
  });

  // Check if today's mood is already logged
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todayLog = moodQuery.data?.find(
    l => format(parseISO(l.logged_at), "yyyy-MM-dd") === todayKey
  ) ?? null;

  // Log mood (upsert: if today exists, update; else insert)
  const logMood = useMutation({
    mutationFn: async ({ mood_value, note }: { mood_value: number; note?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated. Please sign in again.");

      if (todayLog) {
        const { error } = await supabase
          .from("mood_logs")
          .update({ mood_value, note: note ?? null })
          .eq("id", todayLog.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("mood_logs")
          .insert({ user_id: session.user.id, mood_value, note: note ?? null });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mood_logs", user?.id] }),
    onError: (err) => console.error("[logMood] failed:", err),
  });

  // Save assessment result
  const saveAssessment = useMutation({
    mutationFn: async ({
      score, level, answers,
    }: { score: number; level: string; answers: number[] }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated. Please sign in again.");

      const { error } = await supabase
        .from("assessment_results")
        .insert({ user_id: session.user.id, score, level, answers });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assessment_results", user?.id] }),
    onError: (err) => console.error("[saveAssessment] failed:", err),
  });

  // Derived data
  const moodLogs = moodQuery.data ?? [];
  const assessResults = assessQuery.data ?? [];
  const lastAssessment = assessResults[0] ?? null;

  const wellbeing = calcWellbeingScore(moodLogs, lastAssessment);
  const streak = calcStreak(moodLogs);
  const moodChartData = buildMoodChartData(moodLogs);

  // Score trend: +/- vs the assessment before last
  const scoreTrend: "up" | "down" | "flat" | null =
    assessResults.length >= 2
      ? assessResults[0].score < assessResults[1].score ? "up"
        : assessResults[0].score > assessResults[1].score ? "down"
        : "flat"
      : null;

  return {
    // raw data
    moodLogs,
    assessResults,
    lastAssessment,
    todayLog,
    // derived
    wellbeing,
    streak,
    moodChartData,
    scoreTrend,
    // mutations
    logMood,
    saveAssessment,
    // loading
    loading: moodQuery.isLoading || assessQuery.isLoading,
  };
}
