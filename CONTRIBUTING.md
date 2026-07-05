# Contributing to PressHouse Vercel

## 🎯 Development Workflow

### Setup

```bash
# Clone repository
git clone https://github.com/press-house/ph-ye.org.git
cd ph-ye.org

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Branch Strategy

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Commit Convention

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

## 📝 Code Style

### TypeScript

- Use strict mode
- Prefer interfaces over types
- Use functional components

### React

- Use hooks
- Prefer composition
- Use React.memo for optimization

### CSS

- Use Tailwind CSS
- Follow mobile-first approach
- Use semantic class names

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type check
npm run type-check
```

## 🚀 Deployment

1. Create Pull Request
2. Wait for CI/CD checks
3. Get code review
4. Merge to main
5. Auto-deploy to Vercel

## 📞 Contact

- GitHub Issues
- Telegram: @PressHouseAdmin_Bot
- Email: dev@ph-ye.org
