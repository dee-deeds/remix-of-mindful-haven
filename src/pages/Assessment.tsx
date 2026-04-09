import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, RotateCcw, BookOpen, Users,
  AlertTriangle, Clock, TrendingUp, TrendingDown, Minus,
  History, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import {
  useWellbeing, analyseDomains, buildRecommendations,
} from "@/hooks/useWellbeing";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ─── Questions (PHQ-9 + GAD-2 + academic stress) ─────────────────────────────

const questions = [
  { q: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",  domain: "mood",            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt down, depressed, or hopeless?",                                        domain: "mood",            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble falling or staying asleep, or slept too much?",                 domain: "sleep",           options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt tired or had little energy?",                                          domain: "energy",          options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had poor appetite or been overeating?",                                     domain: "appetite",        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt bad about yourself or that you are a failure?",                        domain: "self_worth",      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble concentrating on things like reading or watching TV?",          domain: "concentration",   options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt nervous, anxious, or on edge?",                                        domain: "anxiety",         options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you been unable to stop or control worrying?",                                  domain: "anxiety",         options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How would you rate your overall stress level related to academics?",                           domain: "academic_stress", options: ["Low", "Moderate", "High", "Very High"] },
];

const LEVEL_COLORS: Record<string, string> = {
  Minimal:     "text-success",
  Mild:        "text-warning",
  Moderate:    "text-primary",
  Significant: "text-destructive",
};

const LEVEL_BG: Record<string, string> = {
  Minimal:     "bg-success/10 border-success/20",
  Mild:        "bg-warning/10 border-warning/20",
  Moderate:    "bg-primary/10 border-primary/20",
  Significant: "bg-destructive/10 border-destructive/20",
};

const PRIORITY_STYLES = {
  urgent: "border-l-4 border-destructive bg-destructive/5",
  high:   "border-l-4 border-warning bg-warning/5",
  normal: "border-l-4 border-muted bg-muted/40",
};

function getLevel(score: number) {
  if (score <= 7)  return "Minimal";
  if (score <= 14) return "Mild";
  if (score <= 21) return "Moderate";
  return "Significant";
}

function getLevelDesc(level: string) {
  switch (level) {
    case "Minimal":     return "Your responses suggest minimal symptoms. Keep maintaining your wellbeing!";
    case "Mild":        return "Your responses suggest mild symptoms. Consider exploring some coping strategies.";
    case "Moderate":    return "Your responses suggest moderate symptoms. We recommend speaking with a counselor.";
    case "Significant": return "Your responses suggest significant symptoms. Please reach out to a professional.";
    default: return "";
  }
}

// ─── History tab ─────────────────────────────────────────────────────────────

function HistoryTab() {
  const { assessResults, scoreTrend, loading } = useWellbeing();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (assessResults.length === 0) {
    return (
      <div className="text-center py-16">
        <History className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="font-display font-semibold text-lg">No assessments yet</p>
        <p className="text-muted-foreground text-sm mt-1">Complete your first assessment to start tracking your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Trend summary */}
      {assessResults.length >= 2 && (
        <Card className="rounded-2xl border-2 border-muted">
          <CardContent className="p-4 flex items-center gap-4">
            {scoreTrend === "up" && (
              <><TrendingUp className="h-6 w-6 text-success shrink-0" />
              <div>
                <p className="font-display font-semibold text-sm">Improving trend</p>
                <p className="text-xs text-muted-foreground">Your score improved since your last assessment. Keep going!</p>
              </div></>
            )}
            {scoreTrend === "down" && (
              <><TrendingDown className="h-6 w-6 text-destructive shrink-0" />
              <div>
                <p className="font-display font-semibold text-sm">Score increased — consider extra support</p>
                <p className="text-xs text-muted-foreground">Your score is higher than last time. Consider booking a session.</p>
              </div></>
            )}
            {scoreTrend === "flat" && (
              <><Minus className="h-6 w-6 text-muted-foreground shrink-0" />
              <div>
                <p className="font-display font-semibold text-sm">Stable</p>
                <p className="text-xs text-muted-foreground">Your score is similar to last time.</p>
              </div></>
            )}
          </CardContent>
        </Card>
      )}

      {/* Result list */}
      {assessResults.map((r, i) => {
        const level = r.level;
        const domains = analyseDomains(r.answers).filter(d => d.ratio >= 0.5).slice(0, 3);
        return (
          <Card key={r.id} className={`rounded-2xl border ${LEVEL_BG[level] ?? ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-display text-xl font-extrabold ${LEVEL_COLORS[level]}`}>
                      {level}
                    </span>
                    {i === 0 && <Badge variant="outline" className="text-xs">Latest</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(parseISO(r.taken_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold font-display">{r.score}</p>
                  <p className="text-xs text-muted-foreground">/ 30</p>
                </div>
              </div>

              {domains.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {domains.map(d => (
                    <span key={d.name} className="inline-flex items-center gap-1 text-xs bg-card rounded-full px-2.5 py-1 font-medium border">
                      {d.icon} {d.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Mini score bar */}
              <div className="mt-3">
                <Progress value={(r.score / 30) * 100} className="h-1.5 rounded-full" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Assessment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { saveAssessment, assessResults } = useWellbeing();
  const [tab, setTab] = useState<"quiz" | "history">("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const progress = (step / questions.length) * 100;
  const score = answers.reduce((s, a) => s + (a || 0), 0);
  const level = getLevel(score);
  const levelDesc = getLevelDesc(level);

  const handleAnswer = (value: number) => {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
      // Save to Supabase in the background
      if (user && !saved) {
        setSaving(true);
        try {
          await saveAssessment.mutateAsync({ score, level, answers });
          setSaved(true);
        } catch (err: any) {
          toast({
            title: "Couldn't save assessment",
            description: err?.message ?? "Your result is shown but wasn't saved. Check your connection.",
            variant: "destructive",
          });
        } finally {
          setSaving(false);
        }
      }
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
    setSaved(false);
    setSaving(false);
  };

  // ── Results view ────────────────────────────────────────────────────────────
  if (showResults) {
    const domains = analyseDomains(answers);
    const topDomains = domains.filter(d => d.ratio >= 0.4).slice(0, 4);
    const recommendations = buildRecommendations(answers, level);

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Header card */}
        <Card className={`rounded-2xl border-2 ${LEVEL_BG[level] ?? ""}`}>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-display mb-1">Your result</p>
                <h1 className={`font-display text-4xl font-extrabold ${LEVEL_COLORS[level]}`}>{level}</h1>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm">{levelDesc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-4xl font-bold">{score}</p>
                <p className="text-sm text-muted-foreground">out of 30</p>
              </div>
            </div>
            <Progress value={(score / 30) * 100} className="h-2 rounded-full" />

            {/* Save status */}
            {user && (
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                {saving && <><span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block" /> Saving to your history…</>}
                {saved  && <><span className="text-success">✓</span> Saved to your history</>}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Domain breakdown */}
        {topDomains.length > 0 && (
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Areas of concern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topDomains.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-2">{d.icon} {d.label}</span>
                    <span className="text-muted-foreground text-xs">{d.score}/{d.max}</span>
                  </div>
                  <Progress value={d.ratio * 100} className="h-1.5 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Smart recommendations */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Recommended next steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recommendations.slice(0, 5).map((rec, i) => (
              <Link
                key={i}
                to={rec.path}
                className={`block p-3 rounded-xl transition-opacity hover:opacity-80 ${PRIORITY_STYLES[rec.priority]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{rec.text}</p>
                    {rec.subtext && <p className="text-xs text-muted-foreground mt-0.5">{rec.subtext}</p>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Quick nav */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/dashboard/resources">
            <Button variant="outline" className="w-full rounded-xl gap-2 text-xs sm:text-sm">
              <BookOpen className="h-4 w-4" /> Resources
            </Button>
          </Link>
          <Link to="/dashboard/counselors">
            <Button variant="outline" className="w-full rounded-xl gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4" /> Counselors
            </Button>
          </Link>
          <Link to="/dashboard/emergency">
            <Button variant="outline" className="w-full rounded-xl gap-2 text-xs sm:text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" /> Emergency
            </Button>
          </Link>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={reset} className="flex-1 gap-2 rounded-xl">
            <RotateCcw className="h-4 w-4" /> Take Again
          </Button>
          <Button variant="outline" onClick={() => { reset(); setTab("history"); }} className="flex-1 gap-2 rounded-xl">
            <History className="h-4 w-4" /> View History
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center px-4">
          ⚠️ This is a screening tool, not a clinical diagnosis. Please consult a mental health professional for comprehensive evaluation.
        </p>
      </div>
    );
  }

  // ── Quiz / History tabs ─────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold mb-1">Mental Health Check-in</h1>
        <p className="text-muted-foreground text-sm">
          A brief, private questionnaire to help you understand your current wellbeing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 w-fit">
        <button
          onClick={() => setTab("quiz")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "quiz" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Take Assessment
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
            tab === "history" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          History
          {assessResults.length > 0 && (
            <span className="bg-primary/10 text-primary text-xs rounded-full px-1.5 py-0.5 font-bold">
              {assessResults.length}
            </span>
          )}
        </button>
      </div>

      {tab === "history" ? <HistoryTab /> : (
        <>
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 rounded-full" />
          </div>

          {/* Domain badge */}
          <div className="mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {questions[step].domain.replace("_", " ")}
            </span>
          </div>

          {/* Question card */}
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-bold mb-6">{questions[step].q}</h2>
              <div className="space-y-3">
                {questions[step].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                      answers[step] === i
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        answers[step] === i ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}>
                        {answers[step] === i && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[step] === undefined}
                  className="gap-2 rounded-xl"
                >
                  {step === questions.length - 1 ? "See Results" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-4">
            All responses are private and stored securely.
          </p>
        </>
      )}
    </div>
  );
}
