# Frontend Task: Inline `cn()` → Import from `src/lib/utils.ts`

## Status: ✅ Complete

## Summary

Replaced all inline/duplicate `cn()` utility function definitions across the codebase with centralized imports from `src/lib/utils.ts`. This eliminates code duplication and ensures a single source of truth for the classname merging utility.

## Files Changed

| File | Change |
|---|---|
| `src/pages/About.tsx` | Removed inline `cn()` + `clsx`/`twMerge` imports; added `import { cn } from '../lib/utils'` |
| `src/pages/ArticleDetail.tsx` | Same pattern |
| `src/pages/EventDetail.tsx` | Same pattern |
| `src/pages/Home.tsx` | Same pattern |
| `src/pages/Violations.tsx` | Removed inline `cn()` (`.filter(Boolean).join(' ')` variant); added `import { cn } from '../lib/utils'` |
| `src/pages/admin/JobEditor.tsx` | Replaced inline `cn()` + `clsx`/`twMerge` imports with `import { cn } from '../../lib/utils'` |
| `src/pages/News.tsx` | Already had `import { cn }` — no change needed |
| `src/pages/ProjectDetail.tsx` | Already had `import { cn }` — no change needed |
| `src/pages/ProjectsDemo.tsx` | Already had `import { cn }` — no change needed |
| `src/pages/VolunteerPortal.tsx` | Already had `import { cn }` — no change needed |
| `src/pages/VolunteerOpportunityDetail.tsx` | Already had `import { cn }` — no change needed |
| `src/pages/admin/TenderManager.tsx` | Already had `import { cn }` — no change needed |
| `src/pages/admin/VolunteerRegistry.tsx` | Already had `import { cn }` — no change needed |
| `src/components/projects/ProjectCard.tsx` | Already had `import { cn }` — no change needed |

## Acceptance Criteria Checklist

- [x] All inline `function cn(...)` removed from `.tsx` files
- [x] Centralized `cn` import points to `src/lib/utils.ts` (the canonical definition)
- [x] No leftover `clsx`/`twMerge` imports in consumer files
- [x] No build errors expected — import path resolution confirmed for all modified files
- [x] Both `cn` variants (tailwind-merge based and filter-join based) consolidated into single canonical utility
