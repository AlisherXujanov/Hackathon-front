# English Dashboard Architecture Documentation

## Overview

The English Dashboard is a refactored, DRY (Don't Repeat Yourself) implementation that provides a unified interface for learning English across multiple categories: Grammar, Reading, Listening, Writing, Vocabulary, and Testing. The architecture follows a component-based, hook-driven pattern that eliminates code duplication and maximizes reusability.

### Key Principles

- **DRY**: Single source of truth for category logic
- **Component Reusability**: Generic components used across all categories
- **Separation of Concerns**: Logic, UI, and data loading are separated
- **Performance**: Memoization and debouncing for optimal rendering
- **Maintainability**: Changes in one place affect all categories

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    English Dashboard                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────────────────────┐    │
│  │   Layout     │──────│   EnglishSidebar              │    │
│  │  (layout.jsx)│      │   (Navigation)                │    │
│  └──────────────┘      └──────────────────────────────┘    │
│         │                                                    │
│         ├─────────────────────────────────────────────┐    │
│         │                                               │    │
│  ┌──────▼──────────────────────────────────────────┐   │    │
│  │  Category Pages (grammar, reading, etc.)        │   │    │
│  │  (~15 lines each)                                │   │    │
│  │                                                  │   │    │
│  │  ┌──────────────────────────────────────────┐ │   │    │
│  │  │  EnglishCategoryPage (Generic Component)   │ │   │    │
│  │  │  - Uses useEnglishCategory hook            │ │   │    │
│  │  │  - Renders reusable UI components          │ │   │    │
│  │  └──────────────────────────────────────────┘ │   │    │
│  └──────────────────────────────────────────────────┘   │    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
EnglishCategoryPage (Generic Component)
├── CategoryHeader (Icon, Title, Description)
├── LevelSelector (Level dropdown)
├── LoadingState (Loading spinner)
├── ErrorState (Error message with retry)
├── EmptyState (Empty state with icon)
├── TopicsGrid (TopicCard components)
└── Pagination (Page navigation)
```

### Data Flow

```
JSON Files (src/store/english/{category}/{level}.json)
    ↓
dataLoader.js (Unified loader with transformers)
    ↓
useEnglishCategory Hook (State management + pagination)
    ↓
EnglishCategoryPage Component (Renders UI)
    ↓
Category Pages (grammar/page.jsx, etc.)
```

## Folder Structure

```
src/app/english/
├── layout.jsx              # Shared layout with sidebar
├── page.jsx                # Main entry (redirects to grammar)
├── grammar/
│   └── page.jsx            # Grammar category page (~15 lines)
├── reading/
│   └── page.jsx            # Reading category page (~15 lines)
├── listening/
│   └── page.jsx            # Listening category page (~15 lines)
├── writing/
│   └── page.jsx            # Writing category page (~15 lines)
├── vocabulary/
│   └── page.jsx            # Vocabulary category page (~15 lines)
└── testing/
    └── page.jsx            # Testing page (Coming soon)
```

## Key Files and Their Purpose

### Configuration

**`src/config/englishCategories.js`**
- **Purpose**: Centralized configuration for all English categories
- **Exports**:
  - `ENGLISH_LEVELS`: Array of level options (A1-C2)
  - `ENGLISH_CATEGORIES`: Category configuration objects with icons, colors, loaders
- **Usage**: Imported by category pages and components
- **When to modify**: Adding new categories or changing category metadata

### Hooks

**`src/hooks/useEnglishCategory.js`**
- **Purpose**: Core logic hook for category pages
- **Responsibilities**:
  - State management (topics, loading, error, pagination)
  - Data loading with error handling
  - Level change handling
  - Pagination calculations
- **Returns**: Complete category page state and handlers
- **Usage**: Used by `EnglishCategoryPage` component

**`src/hooks/usePagination.js`**
- **Purpose**: Responsive pagination calculation
- **Features**:
  - Calculates items per page based on screen size (4/8/12)
  - Debounced resize events (150ms)
  - Pagination utility function
- **Usage**: Used by `useEnglishCategory` hook

### Components

**`src/components/english/EnglishCategoryPage.jsx`**
- **Purpose**: Generic reusable page component for all categories
- **Props**:
  - `category`: Category config object from `ENGLISH_CATEGORIES`
  - `topicCardPropsMapper`: Function to map topic data to TopicCard props
  - `onTopicClick`: Optional custom click handler
- **Usage**: Used by all category pages (grammar, reading, etc.)
- **Features**: Memoized topic cards, integrated pagination, error handling

**`src/components/english/CategoryHeader.jsx`**
- **Purpose**: Displays category header with icon, title, and description
- **Props**: `icon`, `title`, `description`, `color`
- **Usage**: Used by `EnglishCategoryPage`

**`src/components/english/LevelSelector.jsx`**
- **Purpose**: Level selection dropdown
- **Props**: `value`, `onChange`
- **Usage**: Used by `EnglishCategoryPage`

**`src/components/english/LoadingState.jsx`**
- **Purpose**: Standardized loading indicator
- **Props**: `message` (optional)
- **Usage**: Used by `EnglishCategoryPage`

**`src/components/english/ErrorState.jsx`**
- **Purpose**: Error display with retry button
- **Props**: `message`, `onRetry` (optional)
- **Usage**: Used by `EnglishCategoryPage`

**`src/components/english/EmptyState.jsx`**
- **Purpose**: Empty state display
- **Props**: `icon`, `title`, `message`
- **Usage**: Used by `EnglishCategoryPage`

**`src/components/english/TopicCard.jsx`**
- **Purpose**: Reusable card component for displaying topics
- **Props**: `title`, `description`, `level`, `difficulty`, `estimatedHours`, `duration`, `wordCount`, `questionCount`, `onClick`
- **Usage**: Used by `EnglishCategoryPage` to render topic grid

**`src/components/english/EnglishSidebar.jsx`**
- **Purpose**: Sidebar navigation for English categories
- **Features**: Mobile-responsive, active state highlighting
- **Usage**: Used by `layout.jsx`

**`src/components/Pagination.jsx`**
- **Purpose**: Pagination controls with page numbers and prev/next
- **Props**: `currentPage`, `totalPages`, `onPageChange`, `totalItems`, `itemsPerPage`
- **Usage**: Used by `EnglishCategoryPage`

### Utilities

**`src/utils/english/dataLoader.js`**
- **Purpose**: Unified data loading with category-specific transformers
- **Exports**:
  - `loadCategoryTopics(category, level)`: Unified loader
  - Individual loaders: `loadGrammarTopics`, `loadReadingTopics`, etc.
  - `loadTopics(category, level)`: Alias for unified loader
- **Features**:
  - Level validation and normalization
  - Category-specific data transformation
  - Error handling
- **Data Sources**: `src/store/english/{category}/{level}.json`

**`src/utils/english/topicMappers.js`**
- **Purpose**: Maps normalized topic data to TopicCard props
- **Exports**: `topicCardMappers` object with category-specific mappers
- **Usage**: Used by category pages to transform topic data

## Data Flow Detailed

### 1. Page Load Flow

```
User visits /english/grammar
    ↓
GrammarPage component renders
    ↓
Passes ENGLISH_CATEGORIES.grammar to EnglishCategoryPage
    ↓
EnglishCategoryPage uses useEnglishCategory hook
    ↓
Hook calls categoryConfig.loader (loadGrammarTopics)
    ↓
dataLoader.js loads JSON from src/store/english/grammar/a1.json
    ↓
Transformer normalizes data structure
    ↓
Hook updates state (topics, loading, error)
    ↓
Pagination calculates paginatedItems
    ↓
EnglishCategoryPage renders UI with topic cards
```

### 2. Level Change Flow

```
User selects new level (e.g., B1)
    ↓
LevelSelector onChange triggers handleLevelChange
    ↓
useEnglishCategory updates selectedLevel state
    ↓
useEffect detects level change
    ↓
Resets currentPage to 1
    ↓
Calls loadTopics with new level
    ↓
Data loader fetches new JSON file
    ↓
UI updates with new topics
```

### 3. Pagination Flow

```
User clicks page 2
    ↓
Pagination component calls handlePageChange(2)
    ↓
useEnglishCategory updates currentPage state
    ↓
Pagination calculations recompute (useMemo)
    ↓
paginatedItems updates with new slice
    ↓
Topic cards re-render with new items
    ↓
Scroll to top (handled by Pagination component)
```

## Category Page Structure

Each category page follows this minimal structure:

```javascript
'use client'

import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function GrammarPage() {
  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.grammar}
      topicCardPropsMapper={topicCardMappers.grammar}
      onTopicClick={(topic) => {
        // Custom navigation logic
      }}
    />
  )
}
```

**Key Points**:
- Only ~15 lines of code per page
- Uses generic `EnglishCategoryPage` component
- References category config from `englishCategories.js`
- Uses topic mapper from `topicMappers.js`
- Can customize `onTopicClick` handler

## Adding a New Category

### Step 1: Add JSON Data
Create JSON files in `src/store/english/{category}/`:
- `a1.json`, `a2.json`, `b1.json`, `b2.json`, `c1.json`, `c2.json`

### Step 2: Add Data Loader
In `src/utils/english/dataLoader.js`:
1. Add transformer function in `transformers` object
2. Add individual loader function (e.g., `loadNewCategoryTopics`)
3. Export the loader function

### Step 3: Add Category Configuration
In `src/config/englishCategories.js`:
1. Import the loader function
2. Import the icon from `react-icons/hi`
3. Add entry to `ENGLISH_CATEGORIES` object:
```javascript
newCategory: {
  id: 'newCategory',
  name: 'New Category Name',
  description: 'Category description',
  icon: HiIconName,
  color: 'from-color-500 to-color-500',
  loader: loadNewCategoryTopics,
  route: '/english/newCategory'
}
```

### Step 4: Add Topic Mapper
In `src/utils/english/topicMappers.js`:
```javascript
newCategory: (topic) => ({
  title: topic.title,
  description: topic.description,
  level: topic.level,
  // ... other props
})
```

### Step 5: Create Page File
Create `src/app/english/newCategory/page.jsx`:
```javascript
'use client'

import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function NewCategoryPage() {
  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.newCategory}
      topicCardPropsMapper={topicCardMappers.newCategory}
      onTopicClick={(topic) => {
        // Navigation logic
      }}
    />
  )
}
```

### Step 6: Update Sidebar (if needed)
The sidebar automatically picks up categories from `ENGLISH_CATEGORIES`, but verify the route matches.

## File Reference Quick Guide

| File | Purpose | Key Exports/Features |
|------|---------|---------------------|
| `src/config/englishCategories.js` | Category configuration | `ENGLISH_LEVELS`, `ENGLISH_CATEGORIES` |
| `src/hooks/useEnglishCategory.js` | Category page logic | State, handlers, pagination |
| `src/hooks/usePagination.js` | Pagination calculation | Responsive items per page |
| `src/components/english/EnglishCategoryPage.jsx` | Generic page component | Main reusable component |
| `src/components/english/CategoryHeader.jsx` | Header section | Icon, title, description |
| `src/components/english/LevelSelector.jsx` | Level dropdown | Uses ENGLISH_LEVELS |
| `src/components/english/LoadingState.jsx` | Loading indicator | Spinner with message |
| `src/components/english/ErrorState.jsx` | Error display | Message + retry button |
| `src/components/english/EmptyState.jsx` | Empty state | Icon + message |
| `src/components/english/TopicCard.jsx` | Topic card | Reusable card component |
| `src/components/english/EnglishSidebar.jsx` | Sidebar navigation | Category navigation |
| `src/components/Pagination.jsx` | Pagination controls | Page numbers + prev/next |
| `src/utils/english/dataLoader.js` | Data loading | Unified loader + transformers |
| `src/utils/english/topicMappers.js` | Topic prop mapping | Category-specific mappers |
| `src/app/english/{category}/page.jsx` | Category pages | ~15 lines, uses generic component |

## Component Dependencies

```
EnglishCategoryPage
├── Depends on: useEnglishCategory hook
├── Uses: CategoryHeader, LevelSelector, LoadingState, ErrorState, EmptyState, TopicCard, Pagination
└── Receives: category config, topicCardPropsMapper, onTopicClick

useEnglishCategory hook
├── Depends on: usePagination hook, categoryConfig.loader
├── Uses: paginate utility function
└── Returns: State and handlers for category page

dataLoader.js
├── Depends on: JSON files in src/store/english/
├── Uses: Transformers for each category
└── Returns: Normalized topic arrays
```

## Data Structure

### Category Configuration Object
```javascript
{
  id: 'grammar',
  name: 'English Grammar',
  description: 'Learn and practice...',
  icon: HiBookOpen, // React icon component
  color: 'from-blue-500 to-cyan-500', // Tailwind gradient classes
  loader: loadGrammarTopics, // Function from dataLoader.js
  route: '/english/grammar'
}
```

### Normalized Topic Object
All topics are normalized to a common structure:
```javascript
{
  id: string,
  title: string,
  level: string, // A1, A2, B1, etc.
  category: string, // grammar, reading, etc.
  // Category-specific fields:
  description?: string,
  difficulty?: number,
  estimatedHours?: number,
  duration?: number,
  questionCount?: number,
  wordCount?: number,
  // ... other fields
}
```

## Best Practices

### When to Create New Components
- **Create new component**: When UI pattern is reused 3+ times
- **Reuse existing**: When pattern matches existing component
- **Inline**: When code is used only once and simple

### Code Organization
- **Configuration**: All constants and configs in `src/config/`
- **Hooks**: Shared logic in `src/hooks/`
- **Components**: Reusable UI in `src/components/`
- **Utilities**: Helper functions in `src/utils/`
- **Pages**: Minimal page files that compose components

### Performance Considerations
- Use `useMemo` for expensive calculations (pagination, topic cards)
- Use `useCallback` for event handlers passed to children
- Debounce resize events (already implemented in usePagination)
- Memoize topic card props to prevent unnecessary re-renders

### State Management
- **Local state**: Use `useState` for component-specific state
- **Shared logic**: Use custom hooks (useEnglishCategory)
- **Global state**: Not needed for English dashboard (consider context if needed)

## Common Tasks

### How to Change Pagination Items Per Page
Edit `src/hooks/usePagination.js`:
- Modify the breakpoint values (1024, 768)
- Change items per page values (12, 8, 4)

### How to Customize Empty State Message
Pass props to `EnglishCategoryPage`:
```javascript
<EnglishCategoryPage
  category={ENGLISH_CATEGORIES.grammar}
  topicCardPropsMapper={topicCardMappers.grammar}
  emptyStateTitle="Custom title"
  emptyStateMessage="Custom message"
/>
```

### How to Add Custom Topic Click Handler
Each category page can provide custom `onTopicClick`:
```javascript
onTopicClick={(topic) => {
  router.push(`/english/grammar/${topic.id}`)
}}
```

### How to Modify Topic Card Display
Edit the mapper in `src/utils/english/topicMappers.js`:
```javascript
grammar: (topic) => ({
  title: topic.title,
  description: topic.levelName,
  // Add or remove props
})
```

## Troubleshooting

### Issue: Topics Not Loading
1. Check `categoryConfig.loader` is defined in `englishCategories.js`
2. Verify JSON file exists at `src/store/english/{category}/{level}.json`
3. Check browser console for import errors
4. Verify transformer function in `dataLoader.js` matches JSON structure

### Issue: Pagination Not Working
1. Verify `usePagination` hook is working (check itemsPerPage value)
2. Check `totalPages` calculation (should be > 1 for pagination to show)
3. Verify `handlePageChange` is connected correctly

### Issue: Level Selector Not Updating
1. Check `handleLevelChange` is passed to `LevelSelector`
2. Verify `selectedLevel` state updates correctly
3. Check `useEffect` dependency array includes `selectedLevel`

### Issue: Topic Cards Not Rendering
1. Verify `topicCardPropsMapper` function returns correct props
2. Check `paginatedItems` has data
3. Verify `TopicCard` component receives all required props

### Issue: Performance Problems
1. Check memoization is applied (useMemo, useCallback)
2. Verify debouncing is working for resize events
3. Check for unnecessary re-renders using React DevTools

## Extension Points

### Adding New Features

**Search/Filter**:
- Add search state to `useEnglishCategory` hook
- Filter topics before pagination
- Add SearchInput component

**Sorting**:
- Add sort state to hook
- Sort topics before pagination
- Add SortSelector component

**Favorites/Bookmarks**:
- Add to context or local storage
- Filter topics based on favorites
- Add favorite button to TopicCard

**Progress Tracking**:
- Add progress state management
- Store in context or backend
- Display progress indicators

## Testing Checklist

When adding or modifying categories:
- [ ] Topics load correctly for all levels (A1-C2)
- [ ] Pagination works (if topics > itemsPerPage)
- [ ] Level selector updates topics
- [ ] Loading state displays during fetch
- [ ] Error state displays on failure
- [ ] Empty state displays when no topics
- [ ] Topic cards render with correct props
- [ ] Responsive behavior (mobile/tablet/desktop)
- [ ] Sidebar navigation works
- [ ] Page scrolls to top on page change

## Related Files

- **Sidebar**: `src/components/english/EnglishSidebar.jsx`
- **Layout**: `src/app/english/layout.jsx`
- **Main Entry**: `src/app/english/page.jsx`
- **Data Files**: `src/store/english/{category}/`
- **Styles**: `src/assets/styles/_settings.scss`

## Notes for AI Agents

When working with the English dashboard:

1. **To modify category pages**: Edit the generic `EnglishCategoryPage` component or the specific category page file
2. **To add new categories**: Follow the "Adding a New Category" section above
3. **To change data structure**: Modify transformers in `dataLoader.js` and mappers in `topicMappers.js`
4. **To customize UI**: Modify individual UI components (CategoryHeader, TopicCard, etc.)
5. **To change pagination**: Edit `usePagination` hook
6. **Configuration is centralized**: All category configs in `src/config/englishCategories.js`
7. **Logic is in hooks**: Core logic in `useEnglishCategory` hook
8. **Pages are minimal**: Category pages are just thin wrappers around `EnglishCategoryPage`

## Architecture Benefits

- **90% code reduction** in category pages (from ~157 lines to ~15 lines)
- **Single source of truth** for category logic
- **Easy to maintain**: Changes propagate to all categories
- **Consistent UI/UX** across all categories
- **Performance optimized** with memoization and debouncing
- **Scalable**: Adding new categories requires minimal code
