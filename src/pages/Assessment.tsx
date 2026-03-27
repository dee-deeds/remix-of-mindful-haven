import { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw, BookOpen, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const questions = [
  { q: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt tired or had little energy?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had poor appetite or been overeating?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt bad about yourself or that you are a failure?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble concentrating on things like reading or watching TV?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt nervous, anxious, or on edge?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you been unable to stop or control worrying?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How would you rate your overall stress level related to academics?", options: ["Low", "Moderate", "High", "Very High"] },
];

function getResult(score: number) {
  if (score <= 7) return { level: "Minimal", color: "text-success", desc: "Your responses suggest minimal symptoms. Keep maintaining your wellbeing!", suggestions: ["Continue your self-care routine", "Explore our resource library for preventive tips", "Check in with mood tracker regularly"] };
  if (score <= 14) return { level: "Mild", color: "text-warning", desc: "Your responses suggest mild symptoms. Consider exploring some coping strategies.", suggestions: ["Try guided breathing exercises", "Read our stress management articles", "Consider talking to a peer counselor"] };
  if (score <= 21) return { level: "Moderate", color: "text-primary", desc: "Your responses suggest moderate symptoms. We recommend speaking with a counselor.", suggestions: ["Book a session with a counselor", "Join our community support group", "Practice daily mindfulness exercises"] };
  return { level: "Significant", color: "text-destructive", desc: "Your responses suggest significant symptoms. Please reach out to a professional.", suggestions: ["Speak with a counselor as soon as possible", "Contact emergency support if needed", "You're brave for taking this step"] };
}

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const progress = ((step) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = answers.reduce((sum, a) => sum + (a || 0), 0);
  const result = getResult(score);

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Your Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className={`font-display text-4xl font-extrabold ${result.color}`}>{result.level}</p>
              <p className="text-muted-foreground mt-2">{result.desc}</p>
            </div>

            <div className="bg-muted rounded-2xl p-6">
              <h3 className="font-display font-bold mb-3">Suggested Next Steps</h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/resources">
                <Button variant="outline" className="w-full rounded-xl gap-2"><BookOpen className="h-4 w-4" /> Resources</Button>
              </Link>
              <Link to="/counselors">
                <Button variant="outline" className="w-full rounded-xl gap-2"><Users className="h-4 w-4" /> Counselors</Button>
              </Link>
              <Link to="/emergency">
                <Button variant="outline" className="w-full rounded-xl gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> Emergency</Button>
              </Link>
            </div>

            <Button variant="ghost" onClick={reset} className="w-full gap-2">
              <RotateCcw className="h-4 w-4" /> Take Again
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              ⚠️ This is a screening tool, not a diagnosis. Please consult a mental health professional for a comprehensive evaluation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Mental Health Self-Assessment</h1>
        <p className="text-muted-foreground">This brief questionnaire helps you understand your current mental health. All responses are private.</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />
      </div>

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
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={answers[step] === undefined} className="gap-2 rounded-xl">
              {step === questions.length - 1 ? "See Results" : "Next"} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
