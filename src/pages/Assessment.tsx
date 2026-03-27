import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

const questions = [
  { q: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?", section: "Emotional Wellness", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt down, depressed, or hopeless?", section: "Emotional Wellness", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?", section: "Sleep Quality", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "Over the last two weeks, how often have you found it difficult to quiet your mind before sleep?", section: "Emotional Resilience", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt tired or had little energy?", section: "Energy & Vitality", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt bad about yourself or that you are a failure?", section: "Self-Perception", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble concentrating on things like reading or watching TV?", section: "Focus", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt nervous, anxious, or on edge?", section: "Anxiety", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you been unable to stop or control worrying?", section: "Worry Patterns", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How would you rate your overall stress level related to academics?", section: "Academic Stress", options: ["Low", "Moderate", "High", "Very High"] },
  { q: "How often do you feel supported by people around you?", section: "Social Connection", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { q: "How would you rate your overall sense of purpose and meaning?", section: "Purpose", options: ["Very strong", "Strong", "Moderate", "Weak"] },
];

function getResult(score: number) {
  if (score <= 9) return { level: "Strong Well-being", score: 85, desc: "Your responses suggest minimal symptoms. Keep maintaining your wellbeing!" };
  if (score <= 18) return { level: "Moderate Well-being", score: 72, desc: "You're showing positive signs overall with some areas to focus on." };
  if (score <= 27) return { level: "Mild Concerns", score: 55, desc: "Consider exploring some coping strategies and speaking with a counselor." };
  return { level: "Significant Concerns", score: 35, desc: "We strongly recommend speaking with a professional. You've been brave to take this step." };
}

const contextCards = [
  { title: "Why we ask this", desc: "Sleep is often the first indicator of subtle changes in our mental well-being. Understanding your rest patterns helps us provide more tailored resources.", icon: "💡" },
  { title: "Peace is not the absence of trouble, but the presence of serenity.", isQuote: true },
];

const recommendedResources = [
  { title: "Quieting the Late Night Mind", type: "Audio Guide", desc: "A 10-minute progressive muscle relaxation sequence designed for students." },
  { title: "The Anatomy of Resilience", type: "Article", desc: "Understanding how your brain processes academic pressure and social expectations." },
  { title: "Micro-Moments of Calm", type: "Workshop", desc: "Join our upcoming virtual circle on building small daily rituals." },
];

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const progress = ((step + 1) / questions.length) * 100;
  const score = answers.reduce((sum, a) => sum + (a || 0), 0);
  const result = getResult(score);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setShowResults(true);
  };

  const reset = () => { setStep(0); setAnswers([]); setShowResults(false); };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-12 pt-24 lg:pt-12">
        {/* Header */}
        <header className="mb-16 relative">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-fixed rounded-full filter blur-3xl animate-breathing z-0" />
          <div className="relative z-10">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Personal Growth</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tighter leading-tight mb-6 max-w-2xl">
              A Moment for <span className="text-primary">Reflection.</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
              This gentle assessment is designed to help you understand your current mental landscape. Take your time; there are no wrong answers.
            </p>
          </div>
        </header>

        {!showResults ? (
          <section className="mb-24">
            {/* Progress */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Step {String(step + 1).padStart(2, "0")} of {questions.length}</p>
                  <h3 className="text-2xl font-headline font-bold">{questions[step].section}</h3>
                </div>
                <span className="text-primary font-bold text-lg">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="bg-card p-10 md:p-14 rounded-xl editorial-shadow">
                  <h2 className="text-2xl md:text-3xl font-headline font-bold mb-10 leading-snug">
                    {questions[step].q}
                  </h2>
                  <div className="space-y-4">
                    {questions[step].options.map((option, i) => (
                      <label
                        key={i}
                        className={`group flex items-center p-6 rounded-xl cursor-pointer transition-all ${
                          answers[step] === i
                            ? "bg-primary-fixed/20 border-primary-container/40"
                            : "bg-surface hover:bg-primary-fixed/30 border-transparent hover:border-primary-container"
                        } border`}
                      >
                        <input
                          type="radio"
                          name={`q${step}`}
                          checked={answers[step] === i}
                          onChange={() => handleAnswer(i)}
                          className="w-6 h-6 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0"
                        />
                        <span className={`ml-6 text-lg font-medium ${answers[step] === i ? "text-primary font-bold" : "group-hover:text-primary"}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-between items-center">
                    <button
                      onClick={() => setStep(Math.max(0, step - 1))}
                      disabled={step === 0}
                      className="flex items-center text-muted-foreground font-bold hover:text-primary transition-colors disabled:opacity-30"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </button>
                    <Button
                      onClick={handleNext}
                      disabled={answers[step] === undefined}
                      className="rounded-full px-10 py-4 font-headline"
                    >
                      {step === questions.length - 1 ? "See Results" : "Next Question"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Context Cards */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-secondary-container p-8 rounded-xl relative overflow-hidden">
                  <span className="text-3xl mb-4 block">💡</span>
                  <h4 className="text-xl font-headline font-bold mb-3">Why we ask this</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Understanding your patterns helps us provide more tailored resources and support recommendations.
                  </p>
                </div>
                <div className="bg-primary-fixed p-8 rounded-xl">
                  <h4 className="text-xl font-headline font-bold italic mb-4">
                    "Peace is not the absence of trouble, but the presence of serenity."
                  </h4>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">— Editorial Note</p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Results */
          <section className="pt-8">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Your Snapshot</span>
              <h2 className="text-4xl font-headline font-extrabold mb-4">Review Your Progress</h2>
              <p className="text-on-surface-variant">Here is how your assessment turned out.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <div className="bg-card p-8 rounded-xl text-center editorial-shadow">
                <p className="text-sm text-muted-foreground mb-2">Current Score</p>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-fixed mb-4">
                  <span className="text-3xl font-headline font-black text-primary">{result.score}</span>
                </div>
                <p className="font-bold">{result.level}</p>
                <p className="text-xs text-muted-foreground mt-2">Based on your responses.</p>
              </div>
              <div className="md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  <div className="bg-card p-3 rounded-full editorial-shadow text-primary text-xl">📊</div>
                  <div>
                    <h4 className="font-headline font-bold text-xl mb-2">Preliminary Insight</h4>
                    <p className="text-on-surface-variant leading-relaxed">{result.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended */}
            <div className="mb-20">
              <h3 className="text-2xl font-headline font-bold mb-10">Recommended for You</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendedResources.map((r, i) => (
                  <Link to="/resources" key={i} className="group cursor-pointer">
                    <div className="relative h-48 mb-6 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                      <span className="text-5xl opacity-30">{["🧘", "📖", "☕"][i]}</span>
                      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                        {r.type}
                      </div>
                    </div>
                    <h4 className="text-xl font-headline font-bold group-hover:text-primary transition-colors mb-2">{r.title}</h4>
                    <p className="text-on-surface-variant text-sm line-clamp-2">{r.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button onClick={reset} variant="outline" className="rounded-full font-headline px-8">
                Take Again
              </Button>
              <p className="text-xs text-muted-foreground">
                ⚠️ This is a screening tool, not a diagnosis. Please consult a mental health professional for a comprehensive evaluation.
              </p>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
