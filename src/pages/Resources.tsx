import { useState } from "react";
import {
  Search, Bookmark, BookmarkCheck, Play, FileText, Download,
  X, BookOpen, Clock, User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type ResourceType = "article" | "video" | "pdf";

interface Resource {
  id: number;
  title: string;
  category: string;
  type: ResourceType;
  desc: string;
  readTime: string;
  author: string;
  content?: string;
  videoId?: string;
}

const resources: Resource[] = [
  {
    id: 1,
    title: "Understanding Anxiety: A Student's Guide",
    category: "Anxiety",
    type: "article",
    desc: "Learn about anxiety symptoms, triggers, and coping mechanisms specifically for university students.",
    readTime: "5 min",
    author: "Dr. Amina Wanjiku",
    content: `## What Is Anxiety?

Anxiety is a natural human response to perceived threats or stressors — it's your body's built-in alarm system. For university students, a certain level of anxiety can actually sharpen focus and improve performance. The problem arises when anxiety becomes persistent, overwhelming, and starts interfering with everyday life.

## Common Student Triggers

Deadlines, examination pressure, financial worries, social situations, relationship conflicts, and uncertainty about the future are among the most common anxiety triggers on campus. Recognizing your personal triggers is the first step toward managing them effectively.

## Recognizing the Symptoms

Anxiety shows up differently for different people. Physically, you might notice a racing heart, shallow breathing, muscle tension, headaches, or stomach problems. Mentally, it can feel like constant worry, difficulty concentrating, a sense of dread, or catastrophic thinking. Behaviorally, you might start avoiding situations, procrastinating, or withdrawing from friends.

## Coping Strategies That Actually Work

Deep breathing exercises can activate your parasympathetic nervous system within minutes, reducing the physical symptoms of anxiety. Try the 4-7-8 method: inhale for 4 counts, hold for 7, exhale for 8. Grounding techniques — like naming 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste — can interrupt anxious thought spirals. Regular physical activity, consistent sleep schedules, and limiting caffeine are all evidence-based anxiety reducers.

## When To Seek Help

If anxiety is affecting your studies, relationships, or daily functioning for more than two weeks, it's time to speak with a mental health professional. Counseling is not a sign of weakness — it's a smart, proactive investment in your wellbeing. Our counselors at JKUAT are trained specifically to support students navigating anxiety, and booking a session is a great first step.`,
  },
  {
    id: 2,
    title: "Dealing with Academic Pressure",
    category: "Academic Stress",
    type: "article",
    desc: "Practical tips for managing workload, deadlines, and exam anxiety.",
    readTime: "8 min",
    author: "Grace Njeri",
    content: `## The Reality of Academic Pressure

University demands a lot — assignments, projects, group work, exams, and sometimes part-time jobs on top of it all. Academic pressure is real and nearly universal among students, but how you respond to it makes all the difference between burning out and thriving.

## Time Management Is a Skill, Not a Talent

Effective time management isn't something you're born with — it's something you practice. Start by listing every task you need to complete this week, then categorize by urgency and importance. Tackle high-priority items when your energy is highest (usually morning), and leave lower-effort tasks for after lunch. Use a physical or digital planner and block time for study, rest, and exercise.

## The Pomodoro Technique

Study in 25-minute focused blocks followed by a 5-minute break. After four blocks, take a longer 20-30 minute break. This method prevents mental fatigue, reduces procrastination, and makes large tasks feel more manageable. Many students find they accomplish more in four Pomodoros than in a full afternoon of distracted studying.

## Dealing with Perfectionism

Perfectionism often masquerades as high standards but frequently leads to paralysis, procrastination, and burnout. Aim for "good enough to submit" as a starting point, then refine from there. A submitted assignment with minor flaws is always better than a perfect paper that never gets written.

## Building Resilience

Academic setbacks — a failed test, a bad grade, rejection from a program — are part of every student's journey. They don't define your potential. Develop a growth mindset by viewing challenges as learning opportunities. When you receive feedback, focus on what you can improve, not on how you fell short.

## Knowing When to Ask for Help

Asking for help — from a lecturer, a tutor, or a counselor — is a sign of self-awareness and maturity. Campus resources exist precisely for this purpose. Never let pride stand between you and the support you need.`,
  },
  {
    id: 3,
    title: "Signs of Depression in Young Adults",
    category: "Depression",
    type: "article",
    desc: "Recognize the early signs and know when to seek professional help.",
    readTime: "6 min",
    author: "Dr. Peter Ochieng",
    content: `## Depression Is Not Just Feeling Sad

Depression is often misunderstood as simply feeling sad. In reality, it is a clinical condition that affects how you think, feel, and function over an extended period. For young adults, depression can be especially hard to recognize because it often looks different than the "classic" picture — it might show up as irritability, recklessness, or excessive sleeping rather than tearfulness.

## Key Signs to Watch For

Persistent low mood or emptiness lasting more than two weeks is the hallmark of depression. Other signs include loss of interest in activities you used to enjoy, significant changes in appetite or weight, sleeping too much or too little, difficulty concentrating or making decisions, fatigue and low energy most of the time, feelings of worthlessness or excessive guilt, and — most critically — thoughts of death or self-harm.

## Depression Looks Different in Students

On campus, depression can manifest as withdrawing from friends and social activities, skipping classes, missing deadlines repeatedly, increased alcohol or substance use, and a drop in academic performance. If you notice these patterns in yourself or a friend, take them seriously.

## How to Help a Friend

If you suspect a friend is depressed, don't wait for them to ask for help — reach out directly and compassionately. Say something like, "I've noticed you seem really down lately and I'm worried about you. I care about how you're doing." Listen without judgment. Encourage professional help but don't force it. Simply showing up and being present can make an enormous difference.

## Getting Professional Help

Depression is highly treatable with the right support. Our counselors can provide individual therapy, and they can also refer students who need more intensive support. If you or someone you know is in immediate danger, please visit the Emergency page or call 0800 723 253 (Befrienders Kenya, free 24/7).`,
  },
  {
    id: 4,
    title: "Healthy Relationship Boundaries",
    category: "Relationships",
    type: "article",
    desc: "Setting and maintaining healthy boundaries in friendships and romantic relationships.",
    readTime: "7 min",
    author: "Joyce Muthoni",
    content: `## What Are Boundaries and Why Do They Matter?

Boundaries are the personal limits you set about how you want to be treated — they define where you end and another person begins. Healthy boundaries are not walls that keep people out; they are guidelines that allow relationships to be mutually respectful, safe, and sustainable. Without boundaries, resentment, exhaustion, and unhealthy dynamics inevitably follow.

## Types of Boundaries

Physical boundaries relate to your personal space, privacy, and touch. Emotional boundaries involve protecting your feelings and not taking on others' emotions as your own. Time boundaries are about how you allocate your hours and energy. Digital boundaries cover your comfort with being contacted, shared about, or photographed online.

## How to Identify Your Limits

Pay attention to when you feel uncomfortable, resentful, or drained after interactions — these feelings often signal a boundary has been crossed. Journaling can help: write down situations where you felt disrespected or uncomfortable, and look for patterns. Those patterns point to where you need clearer limits.

## Communicating Boundaries Clearly

Use "I" statements rather than accusations: "I feel overwhelmed when I get messages late at night" rather than "You always disturb me." Be direct and specific. It's okay to say "no" without a lengthy explanation. Boundaries communicated calmly and clearly tend to be respected; if they aren't, that itself tells you important information about the relationship.

## When Boundaries Are Violated

Consistent boundary violations — whether in friendships or romantic relationships — are a serious warning sign. If someone repeatedly ignores your limits after you've expressed them clearly, it's appropriate to create distance or end the relationship entirely. Your safety, emotional wellbeing, and dignity are non-negotiable.`,
  },
  {
    id: 5,
    title: "Coping with Loneliness at Campus",
    category: "Relationships",
    type: "article",
    desc: "Strategies for building connections and overcoming feelings of isolation.",
    readTime: "5 min",
    author: "Grace Njeri",
    content: `## Loneliness Is More Common Than You Think

Up to 60% of university students report experiencing significant loneliness at some point. The transition to campus — new environment, leaving your support network behind, navigating social hierarchies — makes loneliness almost inevitable. Feeling lonely doesn't mean you're unlikeable or that something is wrong with you. It means you're human.

## Why Campus Can Feel Isolating

Paradoxically, being surrounded by thousands of people can deepen loneliness if those connections feel superficial. Social media creates the illusion that everyone else is thriving socially. The pressure to appear confident and well-adjusted can make it harder to reach out authentically.

## Building Real Connections

Depth matters more than quantity. One honest conversation with a classmate is worth more than 50 casual "hellos." Join a club, society, or sports team based on genuine interest — shared passions create natural conversation and common ground. Volunteer with a campus organization. Attend department events and introduce yourself to one new person.

## Practice Being Approachable

Small, consistent acts — smiling at someone in the corridor, asking a classmate about the lecture, sitting next to someone in the cafeteria — create more opportunities for connection than grand social strategies. Most people are more open to new friendships than they appear.

## Be Compassionate with Yourself

Loneliness is not a personal failure. Treat yourself the way you would treat a lonely friend — with warmth, not judgment. Spend time on activities that restore you. And if loneliness persists and starts affecting your mental health, speak with one of our counselors — building social skills is something they actively work on with students.`,
  },
  {
    id: 6,
    title: "Exam Season Survival Guide",
    category: "Academic Stress",
    type: "article",
    desc: "A comprehensive guide to maintaining your mental health during exam periods.",
    readTime: "10 min",
    author: "Dr. Hassan Ali",
    content: `## Survive and Thrive During Exam Season

Exam season doesn't have to be a period of all-nighters, panic, and self-neglect. With the right strategies, you can approach exams feeling prepared and relatively calm — and come out the other side with your health intact.

## Plan Your Study Schedule

Start planning at least three weeks before your first exam. Create a study timetable that covers all subjects proportional to their difficulty and your current comfort level. Be realistic — don't schedule 10 hours of productive studying per day. Four to six focused hours is more effective than ten distracted ones.

## The Science of Effective Studying

Spaced repetition (reviewing material at increasing intervals) is significantly more effective than cramming. Active recall — testing yourself on material rather than re-reading — cements information far more deeply. Past papers are your best friend: they show you the format, common question types, and areas the examiner considers important.

## Protecting Sleep

Sleep is not a luxury during exams — it is when your brain consolidates what you've learned. Pulling all-nighters before exams actively impairs memory retrieval and cognitive function. Aim for 7-8 hours consistently. Establish a wind-down routine before bed and keep your phone out of the room.

## Managing Exam Anxiety in the Moment

If anxiety spikes in the exam room: pause, take three slow deep breaths, and remind yourself that you have prepared. Read every question fully before beginning. If you get stuck, move on and return. Write something — a partial answer is better than a blank page.

## After Exams

Give yourself permission to rest and recover. Many students swing from intense study to guilt about resting — both are counterproductive. Rest is part of the performance cycle. Celebrate effort, not just results, and reflect on what study strategies worked for next time.`,
  },
  {
    id: 7,
    title: "5-Minute Box Breathing Exercise",
    category: "Anxiety",
    type: "video",
    desc: "A guided breathing technique to calm your nervous system during stressful moments.",
    readTime: "5 min",
    author: "Dr. Amina Wanjiku",
    videoId: "tybOi4hjZFQ",
  },
  {
    id: 8,
    title: "Mindfulness Meditation for Beginners",
    category: "Self-Care",
    type: "video",
    desc: "Start your mindfulness journey with this beginner-friendly guided meditation session.",
    readTime: "10 min",
    author: "Joyce Muthoni",
    videoId: "ZToicYcHIOU",
  },
  {
    id: 9,
    title: "Progressive Muscle Relaxation",
    category: "Anxiety",
    type: "video",
    desc: "Step-by-step guided video to release physical tension caused by stress and anxiety.",
    readTime: "12 min",
    author: "Dr. Hassan Ali",
    videoId: "1nZEdqcGMzo",
  },
  {
    id: 10,
    title: "Student Wellness Toolkit",
    category: "Self-Care",
    type: "pdf",
    desc: "A downloadable reference guide covering daily habits, crisis contacts, and wellness strategies for JKUAT students.",
    readTime: "15 min",
    author: "MindCare Team",
    content: `STUDENT WELLNESS TOOLKIT
MindCare — JKUAT Mental Health Support
=========================================

DAILY MENTAL HEALTH HABITS
---------------------------
• Sleep 7–8 hours consistently every night
• Move your body for at least 30 minutes daily
• Eat regular meals — avoid skipping breakfast
• Limit caffeine to 2 cups before noon
• Spend 10 minutes in nature or sunlight each day
• Connect meaningfully with one person each day
• Practice 5 minutes of deep breathing morning and night
• Limit social media to 30 minutes per day

STUDY WELLNESS
--------------
• Use the Pomodoro method: 25 min study, 5 min break
• Take a full day off from studying once per week
• Study in dedicated spaces, away from your bed
• Avoid all-nighters — sleep consolidates memory
• Celebrate small wins, not just big results

CRISIS CONTACTS
---------------
• MindCare Emergency Line: 0800 000 000 (24/7, free)
• Befrienders Kenya: 0800 723 253 (24/7, free)
• JKUAT Health Unit: +254 067 52711
• Nearest Emergency Room: JKUAT Hospital, Gate C

GROUNDING TECHNIQUE (5-4-3-2-1)
---------------------------------
When anxious, name:
5 things you can SEE
4 things you can TOUCH
3 things you can HEAR
2 things you can SMELL
1 thing you can TASTE

BOX BREATHING
-------------
Inhale for 4 counts
Hold for 4 counts
Exhale for 4 counts
Hold for 4 counts
Repeat 4 times

WHEN TO SEEK HELP
-----------------
Seek support if you experience for more than 2 weeks:
• Persistent low mood or numbness
• Loss of interest in things you used to enjoy
• Significant changes in sleep or appetite
• Difficulty functioning in daily life
• Thoughts of harming yourself or others

Remember: Seeking help is a sign of strength, not weakness.
=========================================
MindCare | mindcare.jkuat.ac.ke`,
  },
  {
    id: 11,
    title: "Exam Anxiety Quick-Reference Card",
    category: "Academic Stress",
    type: "pdf",
    desc: "A printable quick-reference card with immediate strategies for managing exam anxiety.",
    readTime: "3 min",
    author: "Dr. Peter Ochieng",
    content: `EXAM ANXIETY QUICK-REFERENCE CARD
MindCare — JKUAT
===================================

BEFORE THE EXAM
---------------
✓ Prepare a bag the night before
✓ Set two alarms
✓ Eat a light, nutritious meal
✓ Arrive 15 minutes early
✓ Avoid comparing with classmates
✓ Do box breathing in the queue

IN THE EXAM ROOM
----------------
✓ Read ALL questions before writing anything
✓ Underline keywords in each question
✓ Start with what you know best
✓ If stuck, skip and return later
✓ Write partial answers — never leave blank
✓ Watch your time: divide equally per question

IF PANIC STRIKES
----------------
1. Put your pen down
2. Close your eyes
3. Take 3 slow, deep breaths
4. Say: "I am prepared. I can do this."
5. Open your eyes and continue

AFTER THE EXAM
--------------
✓ Resist dissecting your answers with friends
✓ Do something enjoyable
✓ Get adequate sleep before the next exam
✓ Celebrate the effort, not just the outcome

EMERGENCY SUPPORT
-----------------
MindCare: 0800 000 000 (24/7)
Befrienders: 0800 723 253 (24/7)
===================================`,
  },
];

const categories = ["All", "Anxiety", "Depression", "Academic Stress", "Relationships", "Self-Care"];

// ─── Article Reader Dialog ────────────────────────────────────────────────────

function ArticleDialog({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const blocks = (resource.content ?? "").split("\n\n");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-2xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start gap-3 pr-8">
            <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <DialogTitle className="font-display text-lg leading-snug">{resource.title}</DialogTitle>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{resource.author}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{resource.readTime} read</span>
                <Badge variant="secondary" className="rounded-full text-xs">{resource.category}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 py-5">
          <div className="prose-sm max-w-none space-y-3 pb-4">
            {blocks.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h3 key={i} className="font-display font-bold text-base mt-5 mb-1 first:mt-0">
                    {block.slice(3)}
                  </h3>
                );
              }
              return (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Video Dialog ─────────────────────────────────────────────────────────────

function VideoDialog({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 flex-row items-start gap-3">
          <Play className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="flex-1 pr-8">
            <DialogTitle className="font-display text-base leading-snug">{resource.title}</DialogTitle>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{resource.author}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{resource.readTime}</span>
            </div>
          </div>
        </DialogHeader>
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${resource.videoId}?rel=0&modestbranding=1&autoplay=1`}
            title={resource.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-muted-foreground">{resource.desc}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── PDF Preview Dialog ───────────────────────────────────────────────────────

function PdfDialog({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const handleDownload = () => {
    const blob = new Blob([resource.content ?? ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resource.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const blocks = (resource.content ?? "").split("\n");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start gap-3 pr-8">
            <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <DialogTitle className="font-display text-base">{resource.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{resource.author}</span>
                <span>·</span>
                <span>{resource.readTime} read</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 py-4">
          <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
            {blocks.join("\n")}
          </pre>
        </ScrollArea>
        <div className="px-6 py-4 border-t shrink-0">
          <Button onClick={handleDownload} className="w-full rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download as Text File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Resources() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [openResource, setOpenResource] = useState<Resource | null>(null);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  const filtered = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const typeIcon = (type: ResourceType) => {
    if (type === "video") return <Play className="h-3 w-3" />;
    if (type === "pdf") return <Download className="h-3 w-3" />;
    return <FileText className="h-3 w-3" />;
  };

  const typeLabel = (type: ResourceType) => {
    if (type === "video") return "video";
    if (type === "pdf") return "guide";
    return "article";
  };

  const actionLabel = (type: ResourceType) => {
    if (type === "video") return "Watch";
    if (type === "pdf") return "Download";
    return "Read";
  };

  const actionIcon = (type: ResourceType) => {
    if (type === "video") return <Play className="h-3 w-3" />;
    if (type === "pdf") return <Download className="h-3 w-3" />;
    return <BookOpen className="h-3 w-3" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Resource Library</h1>
        <p className="text-muted-foreground">Articles to read, videos to watch, and guides to download — all focused on student wellbeing.</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="pl-10 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((resource) => (
          <Card key={resource.id} className="rounded-2xl hover:shadow-md transition-all group flex flex-col">
            <CardContent className="p-6 flex flex-col flex-1">
              {/* Badges + Bookmark */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="rounded-full text-xs">{resource.category}</Badge>
                  <Badge variant="outline" className="rounded-full text-xs gap-1">
                    {typeIcon(resource.type)}
                    {typeLabel(resource.type)}
                  </Badge>
                </div>
                <button
                  onClick={() => toggleBookmark(resource.id)}
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                  aria-label="Bookmark"
                >
                  {bookmarks.includes(resource.id)
                    ? <BookmarkCheck className="h-5 w-5 text-primary" />
                    : <Bookmark className="h-5 w-5" />}
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                {resource.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{resource.desc}</p>

              {/* Footer: time + author + action */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{resource.author}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <Clock className="h-3 w-3" />{resource.readTime}
                  </span>
                </div>
                <Button
                  onClick={() => setOpenResource(resource)}
                  className="w-full rounded-xl gap-2"
                  variant={resource.type === "pdf" ? "outline" : "default"}
                >
                  {actionIcon(resource.type)}
                  {actionLabel(resource.type)} {typeLabel(resource.type)}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No resources found. Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Dialogs */}
      {openResource?.type === "article" && (
        <ArticleDialog resource={openResource} onClose={() => setOpenResource(null)} />
      )}
      {openResource?.type === "video" && (
        <VideoDialog resource={openResource} onClose={() => setOpenResource(null)} />
      )}
      {openResource?.type === "pdf" && (
        <PdfDialog resource={openResource} onClose={() => setOpenResource(null)} />
      )}
    </div>
  );
}
