# Project Structure & Development Guide

## 📂 Complete File Structure

```
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.jsx           # Main layout with navbar
│   │   │   ├── SearchBar.jsx        # Reusable search component
│   │   │   └── FilterDropdown.jsx   # Reusable filter dropdown
│   │   └── job/
│   │       ├── JobCard.jsx          # Job card for list view
│   │       └── JobDetails.jsx       # Detailed job view with tabs
│   ├── pages/
│   │   └── JobListPage.jsx          # Main job listing page
│   ├── data/
│   │   └── jobData.js               # Dummy job data
│   ├── styles/
│   │   ├── jobListPage.css          # Job list page styles
│   │   └── layout.css               # Layout and navbar styles
│   ├── utils/
│   │   ├── constants.js             # App-wide constants
│   │   └── helpers.js               # Utility functions
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # App entry point
│   └── index.css                    # Global styles
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── README.md
└── PROJECT_STRUCTURE.md             # This file
```

## 🎯 Component Architecture

### 1. Layout Component (`src/components/common/Layout.jsx`)
**Purpose**: Provides consistent navigation and structure across all pages

**Features**:
- Responsive navbar with brand logo
- Role-based navigation (Admin, Recruiter, User, Guest)
- Authentication state management
- Mobile-friendly design

**Usage**:
```jsx
import Layout from './components/common/Layout';

function App() {
  return (
    <Layout>
      {/* Your page content */}
    </Layout>
  );
}
```

### 2. SearchBar Component (`src/components/common/SearchBar.jsx`)
**Purpose**: Reusable search input with icon

**Props**:
- `value`: Current search value
- `onChange`: Callback when value changes
- `placeholder`: Input placeholder text

**Usage**:
```jsx
<SearchBar 
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search jobs..."
/>
```

### 3. FilterDropdown Component (`src/components/common/FilterDropdown.jsx`)
**Purpose**: Reusable dropdown filter with custom options

**Props**:
- `label`: Filter label
- `options`: Array of filter options
- `value`: Current selected value
- `onChange`: Callback when selection changes

**Usage**:
```jsx
<FilterDropdown
  label="Department"
  options={['Engineering', 'Design', 'Marketing']}
  value={departmentFilter}
  onChange={setDepartmentFilter}
/>
```

### 4. JobCard Component (`src/components/job/JobCard.jsx`)
**Purpose**: Display job information in list view

**Props**:
- `job`: Job object with all details
- `isSelected`: Boolean for selected state
- `onClick`: Callback when card is clicked

**Usage**:
```jsx
<JobCard
  job={job}
  isSelected={selectedJob?.id === job.id}
  onClick={() => setSelectedJob(job)}
/>
```

### 5. JobDetails Component (`src/components/job/JobDetails.jsx`)
**Purpose**: Display detailed job information with tabs

**Props**:
- `job`: Job object with all details

**Features**:
- Three tabs: Summary, Hiring Workflow, Eligibility Criteria
- Rich content display with icons
- Apply button
- Empty state when no job selected

**Usage**:
```jsx
<JobDetails job={selectedJob} />
```

## 📊 Data Structure

### Job Object Structure
```javascript
{
  id: Number,
  title: String,
  department: String,
  location: String,
  type: String,
  experience: String,
  salary: String,
  postedDate: String (ISO format),
  applicants: Number,
  status: String,
  summary: {
    overview: String,
    responsibilities: Array<String>,
    qualifications: Array<String>
  },
  hiringWorkflow: {
    stages: Array<{
      stage: String,
      description: String,
      duration: String,
      icon: String
    }>,
    timeline: String
  },
  eligibilityCriteria: {
    required: Array<String>,
    preferred: Array<String>,
    skills: Array<String>
  }
}
```

## 🎨 Styling Architecture

### CSS Organization
1. **Global Styles** (`index.css`): Base styles, resets, typography
2. **Layout Styles** (`layout.css`): Navbar, layout components
3. **Page Styles** (`jobListPage.css`): Job list page specific styles

### Design System
- **Colors**: Defined in `constants.js`
- **Gradients**: Purple/blue gradient theme
- **Spacing**: Consistent padding and margins
- **Typography**: Inter font family
- **Components**: Rounded corners (10-20px), smooth transitions

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🚀 Adding New Pages

### Step 1: Create Page Component
```jsx
// src/pages/NewPage.jsx
const NewPage = () => {
  return (
    <div className="new-page">
      <h1>New Page</h1>
    </div>
  );
};

export default NewPage;
```

### Step 2: Create Page Styles
```css
/* src/styles/newPage.css */
.new-page {
  padding: 2rem;
}
```

### Step 3: Add Route
```jsx
// src/App.jsx
import NewPage from './pages/NewPage';
import './styles/newPage.css';

<Route path="/new-page" element={<NewPage />} />
```

## 🔐 Adding Authentication

### Step 1: Create Auth Context
```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Step 2: Wrap App with AuthProvider
```jsx
// src/App.jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          {/* Routes */}
        </Layout>
      </Router>
    </AuthProvider>
  );
}
```

### Step 3: Update Layout Component
```jsx
// Use auth context in Layout.jsx
const { user, isAuthenticated, logout } = useAuth();
```

## 👥 Role-Based Access Control

### Implementation Pattern
```jsx
// src/utils/roleGuard.js
export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    admin: 3,
    recruiter: 2,
    user: 1,
    guest: 0
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Usage in components
if (!hasPermission(userRole, 'admin')) {
  return <Navigate to="/unauthorized" />;
}
```

## 📝 Form Handling

### Recommended Pattern
```jsx
import { useState } from 'react';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and submit
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## 🔄 State Management

### For Simple State: useState
```jsx
const [jobs, setJobs] = useState([]);
const [selectedJob, setSelectedJob] = useState(null);
```

### For Complex State: useReducer
```jsx
const initialState = { jobs: [], loading: false, error: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, jobs: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, initialState);
```

### For Global State: Context API
```jsx
// Create context for shared state
const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  
  return (
    <JobsContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobsContext.Provider>
  );
};
```

## 🧪 Testing Strategy

### Unit Testing (Jest + React Testing Library)
```jsx
// src/components/job/JobCard.test.jsx
import { render, screen } from '@testing-library/react';
import JobCard from './JobCard';

describe('JobCard', () => {
  it('renders job title', () => {
    const job = { id: 1, title: 'Developer' };
    render(<JobCard job={job} />);
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });
});
```

## 📦 API Integration

### Recommended Pattern
```jsx
// src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api';

export const fetchJobs = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs`);
  return response.json();
};

export const createJob = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });
  return response.json();
};
```

## 🎯 Next Steps for Development

### Phase 1: Authentication (Week 1)
- [ ] Create Login page
- [ ] Create Signup page
- [ ] Implement AuthContext
- [ ] Add protected routes
- [ ] Add role-based navigation

### Phase 2: User Features (Week 2)
- [ ] Create User Dashboard
- [ ] Build Application Form
- [ ] Add Application Status Tracking
- [ ] Create User Profile Page

### Phase 3: Recruiter Features (Week 3)
- [ ] Create Recruiter Dashboard
- [ ] Build Application Review Interface
- [ ] Add Interview Scheduling
- [ ] Implement Status Updates

### Phase 4: Admin Features (Week 4)
- [ ] Create Admin Dashboard
- [ ] Build Job Posting Interface
- [ ] Add Recruiter Management
- [ ] Implement Analytics

### Phase 5: Polish (Week 5)
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add animations
- [ ] Optimize performance
- [ ] Write tests

## 📚 Best Practices

1. **Component Organization**: Keep components small and focused
2. **Reusability**: Extract common patterns into reusable components
3. **Naming**: Use descriptive names for variables and functions
4. **Comments**: Add comments for complex logic
5. **Performance**: Use React.memo for expensive components
6. **Accessibility**: Add proper ARIA labels and keyboard navigation
7. **Error Handling**: Always handle errors gracefully
8. **Loading States**: Show loading indicators for async operations

## 🐛 Debugging Tips

1. Use React DevTools for component inspection
2. Add console.logs strategically
3. Use browser DevTools for network debugging
4. Check console for errors and warnings
5. Validate props with PropTypes or TypeScript

## 📖 Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)
- [Vite Documentation](https://vitejs.dev)

---

**Happy Coding! 🚀**

