# Visual Guide - Careers Page Application

## 🎨 Design Overview

### Color Palette
```
Primary Gradient:   #667eea → #764ba2 (Purple to Violet)
Success Color:      #10b981 (Green)
Warning Color:      #f59e0b (Amber)
Error Color:        #ef4444 (Red)
Background:         #ffffff (White)
Text Primary:       #1e293b (Slate 800)
Text Secondary:     #64748b (Slate 500)
Border:             #e2e8f0 (Slate 200)
```

### Typography
```
Font Family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
Heading 1:   2.5rem (40px), Weight: 700
Heading 2:   2rem (32px), Weight: 700
Heading 3:   1.5rem (24px), Weight: 600
Body:        1rem (16px), Weight: 400
Small:       0.875rem (14px), Weight: 400
```

## 📐 Layout Structure

### Desktop View (1200px+)
```
┌─────────────────────────────────────────────────────────────┐
│                         NAVBAR                              │
│  [Logo]  Jobs  Login  [Sign Up]                            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    PAGE HEADER                              │
│  Career Opportunities                                       │
│  Discover your next career move with us                     │
│                                                             │
│  [🔍 Search...]                                             │
│  [Department ▼] [Job Type ▼] [Location ▼]                  │
└─────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────────┐
│              │                                              │
│   JOB LIST   │           JOB DETAILS                        │
│   (380px)    │           (Flexible)                         │
│              │                                              │
│  ┌────────┐  │  ┌──────────────────────────────────────┐   │
│  │ Job 1  │  │  │  Senior Frontend Developer           │   │
│  │ ✓      │  │  │  Engineering • Remote • Full-time    │   │
│  └────────┘  │  │  $120k - $150k                       │   │
│              │  │                                       │   │
│  ┌────────┐  │  │  [Summary] [Workflow] [Eligibility]  │   │
│  │ Job 2  │  │  │  ┌────────────────────────────────┐  │   │
│  └────────┘  │  │  │                                │  │   │
│              │  │  │  Overview                       │  │   │
│  ┌────────┐  │  │  │  We are looking for...          │  │   │
│  │ Job 3  │  │  │  │                                 │  │   │
│  └────────┘  │  │  │  Key Responsibilities           │  │   │
│              │  │  │  ✓ Develop and maintain...      │  │   │
│  ┌────────┐  │  │  │  ✓ Collaborate with...          │  │   │
│  │ Job 4  │  │  │  │                                 │  │   │
│  └────────┘  │  │  │  [Apply Now]                    │  │   │
│              │  │  └────────────────────────────────┘  │   │
│  ┌────────┐  │  │                                       │   │
│  │ Job 5  │  │  │                                       │   │
│  └────────┘  │  │                                       │   │
│              │  │                                       │   │
│  ┌────────┐  │  │                                       │   │
│  │ Job 6  │  │  │                                       │   │
│  └────────┘  │  │                                       │   │
│              │  │                                       │   │
└──────────────┴──────────────────────────────────────────────┘
```

### Mobile View (<768px)
```
┌─────────────────────────────┐
│         NAVBAR              │
│  [Logo]  [☰]               │
└─────────────────────────────┘
┌─────────────────────────────┐
│      PAGE HEADER            │
│  Career Opportunities       │
│                             │
│  [🔍 Search...]             │
│  [Department ▼]             │
│  [Job Type ▼]               │
│  [Location ▼]               │
└─────────────────────────────┘
┌─────────────────────────────┐
│       JOB LIST              │
│  ┌───────────────────────┐  │
│  │ Job 1                 │  │
│  │ Engineering • Remote  │  │
│  │ $120k - $150k         │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Job 2                 │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Job 3                 │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
┌─────────────────────────────┐
│     JOB DETAILS             │
│  Senior Frontend Developer  │
│  Engineering • Remote       │
│                             │
│  [Summary] [Workflow]       │
│  [Eligibility]              │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │  Overview             │  │
│  │  We are looking...    │  │
│  │                       │  │
│  │  [Apply Now]          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

## 🎯 Component Breakdown

### 1. Navbar Component
```
┌──────────────────────────────────────────────────────┐
│  [💼 CareerHub]    Jobs    Login    [Sign Up]        │
└──────────────────────────────────────────────────────┘
```

**Features**:
- Brand logo with icon
- Navigation links
- CTA button
- Responsive hamburger menu (mobile)

### 2. Search Bar Component
```
┌──────────────────────────────────────────────────────┐
│  🔍  Search by job title or department...           │
└──────────────────────────────────────────────────────┘
```

**States**:
- Default: Light background
- Focus: White background with border highlight
- Active: Shows search results

### 3. Filter Dropdown Component
```
┌──────────────────────────────────────┐
│  Department                    ▼     │
└──────────────────────────────────────┘

When Open:
┌──────────────────────────────────────┐
│  All Department                      │
├──────────────────────────────────────┤
│  Engineering                         │
│  Product                             │
│  Design                              │
│  Marketing                           │
└──────────────────────────────────────┘
```

### 4. Job Card Component
```
┌──────────────────────────────────────┐
│  Senior Frontend Developer      Active│
│                                      │
│  💼 Engineering                      │
│  📍 Remote                           │
│  🕐 Full-time                        │
│                                      │
│  $120k - $150k      👥 45 applicants │
│                                      │
│  Posted Jan 15, 2024                 │
└──────────────────────────────────────┘

Selected State:
┌──────────────────────────────────────┐
│  Senior Frontend Developer      Active│
│  (White text on gradient background) │
│                                      │
│  💼 Engineering                      │
│  📍 Remote                           │
│  🕐 Full-time                        │
│                                      │
│  $120k - $150k      👥 45 applicants │
│                                      │
│  Posted Jan 15, 2024                 │
└──────────────────────────────────────┘
```

### 5. Job Details Component
```
┌──────────────────────────────────────────────────────┐
│  Senior Frontend Developer                    Active  │
│                                                      │
│  💼 Engineering  📍 Remote  🕐 Full-time  💰 $120k  │
│                                                      │
│  👥 45 applicants  📅 Posted January 15, 2024       │
├──────────────────────────────────────────────────────┤
│  [Summary]  [Hiring Workflow]  [Eligibility Criteria]│
├──────────────────────────────────────────────────────┤
│                                                      │
│  Overview                                            │
│  We are looking for a talented Senior Frontend...   │
│                                                      │
│  Key Responsibilities                                │
│  ✓ Develop and maintain responsive web applications │
│  ✓ Collaborate with designers and backend...        │
│  ✓ Write clean, maintainable, and well-documented...│
│                                                      │
│  Required Qualifications                             │
│  → 5+ years of experience in frontend development   │
│  → Strong proficiency in React, JavaScript...       │
│                                                      │
│  [Apply Now]                                         │
└──────────────────────────────────────────────────────┘
```

## 🎬 Animation & Interactions

### Hover Effects
1. **Job Cards**
   - Slight lift (translateY: -2px)
   - Shadow increase
   - Border color change

2. **Buttons**
   - Background color change
   - Shadow increase
   - Scale effect

3. **Links**
   - Color change
   - Underline animation

### Transitions
- All transitions: 0.3s ease
- Smooth color changes
- Smooth size changes
- Smooth position changes

### Loading States (Planned)
```
┌──────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────────────┘
```

## 🎨 Design Patterns

### Card Pattern
```
┌──────────────────────────────────────┐
│  Header                              │
├──────────────────────────────────────┤
│  Content                             │
│                                      │
│                                      │
├──────────────────────────────────────┤
│  Footer                              │
└──────────────────────────────────────┘
```

**Usage**: Job cards, application cards, etc.

### Tab Pattern
```
┌──────────────────────────────────────┐
│  [Tab 1]  [Tab 2]  [Tab 3]          │
├──────────────────────────────────────┤
│                                      │
│  Tab Content                         │
│                                      │
└──────────────────────────────────────┘
```

**Usage**: Job details, user dashboard, etc.

### Modal Pattern (Planned)
```
┌──────────────────────────────────────┐
│  ╔════════════════════════════════╗  │
│  ║  Modal Title            [X]    ║  │
│  ╠════════════════════════════════╣  │
│  ║                                ║  │
│  ║  Modal Content                 ║  │
│  ║                                ║  │
│  ║  [Cancel]  [Confirm]           ║  │
│  ╚════════════════════════════════╝  │
└──────────────────────────────────────┘
```

**Usage**: Confirmations, forms, details

## 📱 Responsive Breakpoints

```
Mobile:    < 768px   (Stacked layout)
Tablet:    768-1199px (Adjusted columns)
Desktop:   1200px+   (Full two-column)
```

## 🎭 User States

### Default State
- Clean, professional look
- Subtle colors
- Clear hierarchy

### Hover State
- Interactive elements highlight
- Smooth transitions
- Visual feedback

### Active/Selected State
- Gradient background
- White text
- Prominent display

### Disabled State (Planned)
- Reduced opacity
- No interaction
- Visual indicator

## 🎨 Visual Hierarchy

```
Level 1: Page Title (2.5rem, Bold)
Level 2: Section Headers (1.5rem, Semi-bold)
Level 3: Job Titles (1.125rem, Semi-bold)
Level 4: Body Text (1rem, Regular)
Level 5: Metadata (0.875rem, Regular)
Level 6: Small Text (0.75rem, Regular)
```

## 🌈 Color Usage

### Primary Gradient
- Page background
- Selected job cards
- CTA buttons
- Active tab indicator

### Success Green
- Active status badges
- Positive actions
- Checkmarks

### Warning Amber
- Preferred qualifications
- Alerts

### Error Red
- Error states
- Delete actions

### Neutral Grays
- Text
- Borders
- Backgrounds
- Disabled states

## 📐 Spacing System

```
xs:  0.25rem (4px)
sm:  0.5rem (8px)
md:  1rem (16px)
lg:  1.5rem (24px)
xl:  2rem (32px)
2xl: 2.5rem (40px)
3xl: 3rem (48px)
```

## 🎯 Interactive Elements

### Buttons
- Primary: Gradient background
- Secondary: Light background
- Text: Minimal styling
- Icon: Icon + text

### Inputs
- Rounded corners (12px)
- Border on focus
- Shadow on focus
- Clear visual states

### Dropdowns
- Smooth open/close
- Highlight on hover
- Clear selection
- Keyboard navigation

---

**Design System Version**: 1.0
**Last Updated**: 2024

