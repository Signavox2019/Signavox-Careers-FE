# Careers Page - Frontend Application

A modern, professional careers page application built with React, featuring a sophisticated two-column layout for browsing and viewing job opportunities.

## 🚀 Features

### Current Implementation
- **Job List Page** with two-column layout:
  - **Left Column**: Scrollable list of job postings with key information
  - **Right Column**: Detailed job information with tabbed interface
  - **Search & Filters**: Search by job title/department, filter by department, job type, and location
  - **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes

### Job Details Tabs
1. **Summary Tab**: Overview, responsibilities, and qualifications
2. **Hiring Workflow Tab**: Step-by-step hiring process with timeline
3. **Eligibility Criteria Tab**: Required/preferred qualifications and technical skills

### Design Features
- Modern gradient backgrounds and smooth animations
- Professional color scheme with purple/blue gradients
- Interactive hover effects and transitions
- Clean, minimalist UI with excellent UX
- Fully responsive design

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── SearchBar.jsx    # Search input component
│   │   └── FilterDropdown.jsx # Dropdown filter component
│   └── job/                 # Job-specific components
│       ├── JobCard.jsx      # Individual job card for list
│       └── JobDetails.jsx   # Detailed job view with tabs
├── pages/
│   └── JobListPage.jsx      # Main job listing page
├── data/
│   └── jobData.js           # Dummy job data
├── styles/
│   └── jobListPage.css      # Comprehensive styling
├── utils/                   # Utility functions (for future use)
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Application entry point
└── index.css                # Global styles
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Lucide React** - Modern icon library
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

## 🎨 Design Philosophy

The application follows modern design principles:
- **Component-based architecture**: Reusable, modular components
- **Separation of concerns**: Clear separation between data, logic, and presentation
- **Scalable structure**: Easy to add new pages and features
- **Modern aesthetics**: Gradient backgrounds, smooth transitions, and professional styling

## 🔮 Future Enhancements

The project is structured to easily accommodate:
- **User Authentication**: Login/signup pages
- **Admin Dashboard**: Job posting management, recruiter assignment
- **Recruiter Dashboard**: View assigned applications
- **Application System**: Submit and track job applications
- **User Dashboard**: View application status
- **Role-based Access Control**: Admin, recruiter, and user roles

## 📝 Dummy Data

The application currently uses 6 sample job postings across different departments:
- Engineering (Frontend, Backend, DevOps)
- Product Management
- UX Design
- Marketing

Each job includes:
- Basic information (title, department, location, salary)
- Detailed summary with responsibilities and qualifications
- Complete hiring workflow with stages
- Eligibility criteria with required/preferred qualifications

## 🎯 User Roles (Planned)

1. **Guest User**: Can browse jobs without login
2. **Registered User**: Can apply to jobs
3. **Recruiter**: Can manage assigned job applications
4. **Admin**: Full system access and permissions

## 💡 Key Features Implementation

### Search Functionality
- Real-time search across job titles and departments
- Debounced input for better performance

### Filtering
- Multiple filter dropdowns for department, job type, and location
- Filters work in combination with search
- Dynamic filter options based on available jobs

### Two-Column Layout
- Left column (380px): Job list with scrollable content
- Right column (flexible): Job details with tabs
- Responsive: Stacks vertically on mobile devices

### Tabbed Interface
- Smooth tab switching with active state indicators
- Rich content in each tab with proper formatting
- Icons and visual elements for better UX

## 🚦 Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Navigate to `/jobs` to see the job listings page

## 📄 License

This project is part of a careers page application.

---

Built with ❤️ using React and modern web technologies
