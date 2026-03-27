

# Mental Health Resource Center — JKUAT

## Design System
- **Colors**: Soft pink (`#F2A7B3`) as primary, black (`#1A1A2E`) for text/accents, white/neutral backgrounds, calming gradients
- **Typography**: Rounded, friendly fonts (Inter for body, plus a warm display font for headings)
- **Components**: Rounded corners (lg/xl), soft shadows, calming card layouts, WCAG-compliant contrast
- **Tone**: Warm, non-judgmental, emotionally supportive throughout

## Pages & Features

### 1. Landing Page
- Hero with supportive message ("You're not alone"), calming illustration/gradient
- CTA buttons: "Get Help", "Explore Resources"
- Quick-access cards: Mood Tracker, Self-Assessment, Find a Counselor
- Testimonials/impact stories section
- Footer with contacts & resources

### 2. Auth (Sign Up / Login)
- Email & password authentication via Lovable Cloud
- User profiles table (name, avatar, preferences)
- Warm, welcoming auth pages matching the calming design

### 3. User Dashboard
- Personalized greeting with user's name
- Mood tracker widget (daily emoji/scale check-in, stored in DB)
- Recommended resources cards
- Upcoming appointments list
- Quick-access cards: Community Forum, Self-Assessments, Emergency Help

### 4. Resource Library
- Searchable, filterable card grid
- Categories: Anxiety, Depression, Academic Stress, Relationships, Self-Care
- Article/video cards with save/bookmark feature (persisted per user)

### 5. Counselor Directory
- Profile cards: name, specialization, photo, rating
- Filters: specialization, availability
- "Book Appointment" button on each card

### 6. Self-Assessment Quiz
- Step-by-step questionnaire with progress bar
- Clean one-question-at-a-time UI
- Results page with score, severity level, suggested next steps & resources

### 7. Community Forum
- Anonymous posting option (toggle)
- Discussion threads with like, reply features
- Safe, supportive UI with content guidelines visible

### 8. Appointment Booking
- Calendar-based scheduling UI
- Time slot selection grid
- Confirmation modal with details summary

### 9. Emergency Support Page
- Bold, urgent design with red accents
- Prominent "Get Help Now" button
- Hotline numbers (Kenya crisis lines, JKUAT counseling)
- Minimal distractions, immediate access

### 10. AI Chatbot (UI Only)
- Floating chat bubble on all pages
- Chat interface with message bubbles (no AI connected yet)
- Placeholder responses, ready for future AI integration

## Navigation
- Top navbar (logo, main links, profile dropdown)
- Dashboard sidebar for logged-in users
- Mobile-responsive hamburger menu
- Emergency help always accessible (≤ 2 clicks)

## Backend (Lovable Cloud)
- Auth with email/password
- Tables: profiles, mood_entries, bookmarks, appointments, forum_posts, forum_replies, assessment_results
- RLS policies for user data privacy

## Extra
- Dark mode toggle
- Toast notifications for actions
- Mobile-responsive across all pages

