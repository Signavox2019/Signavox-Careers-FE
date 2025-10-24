# Scripts Reference Guide

## 📦 Available npm Scripts

### Development Scripts

#### `npm run dev`
Start the development server with hot module replacement.

**Usage**:
```bash
npm run dev
```

**Output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Features**:
- Hot Module Replacement (HMR)
- Fast refresh
- Instant updates on file changes
- Source maps enabled

**Options**:
```bash
# Use custom port
npm run dev -- --port 3000

# Expose to network
npm run dev -- --host

# Open in browser automatically
npm run dev -- --open
```

---

#### `npm run build`
Build the application for production.

**Usage**:
```bash
npm run build
```

**Output**:
```
vite v5.x.x building for production...
✓ 123 modules transformed.
dist/index.html                  0.45 kB
dist/assets/index-abc123.js      145.23 kB │ gzip: 46.32 kB
dist/assets/index-def456.css     12.45 kB │ gzip: 3.21 kB
```

**Features**:
- Minification
- Tree shaking
- Code splitting
- Asset optimization
- Production-ready output

**Output Location**: `dist/` directory

---

#### `npm run preview`
Preview the production build locally.

**Usage**:
```bash
npm run build
npm run preview
```

**Output**:
```
➜  Local:   http://localhost:4173/
➜  Network: use --host to expose
```

**Use Cases**:
- Test production build locally
- Verify build output
- Debug production issues

---

#### `npm run lint`
Run ESLint to check code quality.

**Usage**:
```bash
npm run lint
```

**Output**:
```
✓ No linting errors found
```

**Features**:
- Code quality checks
- Style enforcement
- Best practices validation

**Fix Issues Automatically**:
```bash
npm run lint -- --fix
```

---

### Package Management Scripts

#### `npm install`
Install all dependencies from package.json.

**Usage**:
```bash
npm install
```

**When to Use**:
- First time setup
- After pulling new code
- When dependencies are added

---

#### `npm install <package>`
Install a new package.

**Usage**:
```bash
# Install and save to dependencies
npm install react-router-dom

# Install and save to devDependencies
npm install -D @types/react

# Install specific version
npm install react@18.2.0
```

---

#### `npm uninstall <package>`
Remove a package.

**Usage**:
```bash
npm uninstall react-router-dom
```

---

#### `npm update`
Update all packages to latest versions.

**Usage**:
```bash
npm update
```

**Check for Updates**:
```bash
npm outdated
```

---

### Utility Scripts

#### `npm run clean`
Clean build artifacts (if configured).

**Usage**:
```bash
npm run clean
```

---

#### `npm run format`
Format code with Prettier (if configured).

**Usage**:
```bash
npm run format
```

---

## 🔧 Custom Scripts

### Add to package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "clean": "rm -rf dist node_modules/.vite",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

## 🚀 Development Workflow

### Initial Setup
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173
```

### Daily Development
```bash
# Start dev server
npm run dev

# Make changes to files
# See instant updates in browser

# Check code quality
npm run lint
```

### Before Committing
```bash
# 1. Run linter
npm run lint

# 2. Fix any issues
npm run lint -- --fix

# 3. Build to verify
npm run build

# 4. Test production build
npm run preview

# 5. Commit changes
git add .
git commit -m "Your commit message"
```

### Production Deployment
```bash
# 1. Build for production
npm run build

# 2. Test production build
npm run preview

# 3. Deploy dist/ folder
# (Upload to hosting service)
```

---

## 🐛 Troubleshooting Scripts

### Port Already in Use
```bash
# Find process using port 5173
# Windows:
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

### Clear Cache
```bash
# Remove node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Fix Dependencies
```bash
# Remove lock file and reinstall
rm package-lock.json
rm -rf node_modules
npm install
```

---

## 📊 Script Performance

### Development Server
- **Start Time**: ~1-2 seconds
- **HMR Speed**: Instant (<100ms)
- **Memory Usage**: ~200-300 MB

### Production Build
- **Build Time**: ~5-10 seconds
- **Bundle Size**: ~150-200 KB (gzipped)
- **Output**: Optimized for production

---

## 🎯 Common Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --port 3000  # Custom port

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Quality
npm run lint             # Check code quality
npm run lint -- --fix    # Fix linting issues

# Dependencies
npm install              # Install all dependencies
npm install <pkg>        # Install package
npm uninstall <pkg>      # Remove package
npm update               # Update packages

# Cleanup
rm -rf node_modules      # Remove dependencies
rm package-lock.json     # Remove lock file
npm cache clean --force  # Clear npm cache
```

---

## 🔍 Debugging

### Enable Debug Mode
```bash
DEBUG=vite:* npm run dev
```

### Verbose Output
```bash
npm run dev -- --debug
```

### Profile Build
```bash
npm run build -- --mode production --profile
```

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [npm Documentation](https://docs.npmjs.com)
- [ESLint Documentation](https://eslint.org)
- [React Documentation](https://react.dev)

---

**Last Updated**: 2024
**Vite Version**: 5.x
**Node Version**: 18+

