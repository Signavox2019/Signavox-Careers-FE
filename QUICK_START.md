# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to `http://localhost:5173`

You should now see the Careers Page with:
- A professional navbar at the top
- Job listings in the left column
- Detailed job information in the right column
- Search and filter options

## 📱 What You'll See

### Main Features
1. **Job List** (Left Column)
   - 6 sample job postings
   - Click any job to view details
   - Selected job is highlighted

2. **Job Details** (Right Column)
   - Three tabs: Summary, Hiring Workflow, Eligibility Criteria
   - Rich information display
   - Apply button

3. **Search & Filters**
   - Search by job title or department
   - Filter by department, job type, or location
   - All filters work together

## 🎨 Design Highlights

- **Modern Gradient Background**: Purple/blue gradient
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Works on all screen sizes
- **Professional UI**: Clean, minimalist design

## 🛠️ Customization

### Change Colors
Edit `src/utils/constants.js`:
```javascript
export const THEME_COLORS = {
  PRIMARY: '#667eea',      // Change primary color
  SECONDARY: '#764ba2',    // Change secondary color
  SUCCESS: '#10b981',
  // ... more colors
};
```

### Add More Jobs
Edit `src/data/jobData.js` and add new job objects following the existing structure.

### Modify Layout
Edit `src/components/common/Layout.jsx` to customize the navbar.

### Update Styling
Edit CSS files in `src/styles/` directory.

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with routing |
| `src/pages/JobListPage.jsx` | Job listings page |
| `src/components/common/Layout.jsx` | Navbar and layout |
| `src/data/jobData.js` | Sample job data |
| `src/styles/jobListPage.css` | Page styling |

## 🎯 Common Tasks

### Add a New Page
1. Create component in `src/pages/NewPage.jsx`
2. Create styles in `src/styles/newPage.css`
3. Add route in `src/App.jsx`:
```jsx
<Route path="/new-page" element={<NewPage />} />
```

### Add a New Component
1. Create component in appropriate folder:
   - `src/components/common/` for reusable components
   - `src/components/job/` for job-specific components
2. Import and use in your page

### Modify Job Data
1. Open `src/data/jobData.js`
2. Edit the `jobListings` array
3. Save and see changes instantly

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styles Not Updating
- Hard refresh browser (Ctrl + Shift + R)
- Clear browser cache
- Restart dev server

## 📚 Next Steps

1. **Read the README**: Understand the full project structure
2. **Check PROJECT_STRUCTURE.md**: Learn about architecture
3. **Explore Components**: Look at existing components
4. **Start Building**: Add your own features

## 💡 Pro Tips

1. **Use React DevTools**: Install browser extension for debugging
2. **Hot Reload**: Changes appear instantly, no refresh needed
3. **Component Isolation**: Each component is self-contained
4. **Reusable Components**: Use existing components as templates

## 🎓 Learning Resources

- **React Basics**: [React Docs](https://react.dev/learn)
- **React Router**: [Router Docs](https://reactrouter.com)
- **CSS Gradients**: [CSS-Tricks](https://css-tricks.com/css3-gradients/)
- **Lucide Icons**: [Icon Library](https://lucide.dev)

## 🆘 Need Help?

1. Check the console for errors
2. Review component imports
3. Verify prop types
4. Check file paths and names
5. Ensure all dependencies are installed

## ✨ Quick Wins

### Change Company Name
Edit `src/components/common/Layout.jsx`:
```jsx
<span>YourCompanyName</span>  // Line 22
```

### Change Page Title
Edit `src/pages/JobListPage.jsx`:
```jsx
<h1 className="page-title">Your Title</h1>  // Line 28
```

### Change Background Gradient
Edit `src/styles/jobListPage.css`:
```css
.job-list-page {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

---

**Ready to build something amazing? Let's go! 🚀**

