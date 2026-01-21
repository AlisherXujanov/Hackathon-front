# FloatingAIAssistant Component Documentation

## Overview

The `FloatingAIAssistant` component is a reusable floating action button that opens a modal dialog for users to interact with an AI assistant. It collects contextual information (subject, topic, category) and user prompts, then sends them to the backend AI endpoint to get intelligent responses.

## Features

- **Floating Action Button**: Fixed position button that's always accessible
- **Modal Dialog**: Professional modal interface with smooth animations
- **Context Preservation**: Automatically includes subject, topic, and category information
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during API requests
- **Accessibility**: Full keyboard navigation, ARIA labels, and focus management
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **JWT Authentication**: Automatic token handling and refresh

## Installation

The component is already included in the project. No additional installation is required.

## Usage

### Basic Example

```jsx
import FloatingAIAssistant from '@/components/FloatingAIAssistant'

export default function GrammarPage() {
  return (
    <div>
      {/* Your page content */}
      
      <FloatingAIAssistant
        subjectName="English Grammar"
        topicName="Present Perfect"
        category="grammar"
        description="Grammar practice interface for advanced students"
      />
    </div>
  )
}
```

### Example: Reading Category

```jsx
<FloatingAIAssistant
  subjectName="English Reading"
  topicName="Academic Articles"
  category="reading"
  description="Reading comprehension interface for B2 level students"
/>
```

### Example: Programming Category

```jsx
<FloatingAIAssistant
  subjectName="JavaScript"
  topicName="Async/Await"
  category="coding"
  description="JavaScript async programming tutorial"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `subjectName` | `string` | ✅ Yes | - | Name of the subject (e.g., "English Grammar") |
| `topicName` | `string` | ✅ Yes | - | Name of the topic (e.g., "Present Perfect") |
| `category` | `string` | ✅ Yes | - | Category type: `"grammar"`, `"reading"`, `"writing"`, `"listening"`, `"vocabulary"`, `"coding"` |
| `description` | `string` | ❌ No | `""` | Hidden description sent to backend for context (not visible to user) |
| `buttonIcon` | `ReactNode` | ❌ No | `<HiSparkles />` | Custom icon for the floating button |
| `buttonLabel` | `string` | ❌ No | `"AI Assistant"` | Text label for the floating button |
| `position` | `string` | ❌ No | `"bottom-right"` | Button position: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"` |
| `className` | `string` | ❌ No | `""` | Additional CSS classes for the floating button |

## Component Behavior

### Modal States

1. **Closed State**: Only the floating button is visible
2. **Open State**: Modal opens with form to enter prompt
3. **Loading State**: Shows spinner while processing request
4. **Error State**: Displays error message if request fails
5. **Response State**: Shows AI response with option to ask another question

### User Flow

1. User clicks the floating button
2. Modal opens with context information displayed (subject, topic, category)
3. User enters their question in the textarea
4. User clicks "Send" button
5. Loading indicator appears
6. AI response is displayed (or error if failed)
7. User can ask another question or close the modal

### Keyboard Shortcuts

- **Escape**: Closes the modal
- **Enter**: Submits the form (when textarea is focused)
- **Tab**: Navigates through focusable elements (with focus trap)

## Backend API Contract

### Endpoint

```
POST /api/v1/ai/chat
```

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "subject_name": "English Grammar",
  "topic_name": "Present Perfect",
  "category": "grammar",
  "description": "Grammar practice interface for advanced students",
  "user_prompt": "Can you explain when to use present perfect?"
}
```

**Field Descriptions:**

- `subject_name` (string, required): The subject name
- `topic_name` (string, required): The specific topic
- `category` (string, required): The category type
- `description` (string, optional): Additional context for the AI (hidden from user)
- `user_prompt` (string, required): The user's question or prompt

### Success Response

```json
{
  "success": true,
  "data": {
    "answer": "The present perfect is used to describe actions that occurred at an unspecified time before now...",
    "metadata": {}
  },
  "meta": {
    "timestamp": "2026-01-20T12:00:00Z",
    "version": "1.0"
  }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "user_prompt": ["This field is required"]
    }
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "Authentication required"
  }
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "An internal server error occurred"
  }
}
```

## Integration Examples

### In English Grammar Page

```jsx
// src/app/english/grammar/[topicId]/page.jsx
'use client'

import FloatingAIAssistant from '@/components/FloatingAIAssistant'

export default function GrammarTopicPage({ params }) {
  const topic = getTopicById(params.topicId) // Your data fetching logic
  
  return (
    <div>
      {/* Page content */}
      
      <FloatingAIAssistant
        subjectName="English Grammar"
        topicName={topic.name}
        category="grammar"
        description={`Grammar practice interface for ${topic.level} level students`}
      />
    </div>
  )
}
```

### In Reading Page

```jsx
// src/app/english/reading/page.jsx
'use client'

import FloatingAIAssistant from '@/components/FloatingAIAssistant'

export default function ReadingPage() {
  const [selectedTopic, setSelectedTopic] = useState(null)
  
  return (
    <div>
      {/* Page content */}
      
      {selectedTopic && (
        <FloatingAIAssistant
          subjectName="English Reading"
          topicName={selectedTopic.title}
          category="reading"
          description="Reading comprehension practice"
        />
      )}
    </div>
  )
}
```

### In Programming Tasks Page

```jsx
// src/app/programming/tasks/page.jsx
'use client'

import FloatingAIAssistant from '@/components/FloatingAIAssistant'

export default function ProgrammingTasksPage() {
  const currentTask = useCurrentTask() // Your state management
  
  return (
    <div>
      {/* Task content */}
      
      <FloatingAIAssistant
        subjectName={currentTask.language}
        topicName={currentTask.title}
        category="coding"
        description={`Coding challenge: ${currentTask.difficulty} level`}
        buttonLabel="Get Help"
      />
    </div>
  )
}
```

## Styling Customization

The component uses SCSS modules and Tailwind CSS. You can customize:

### Custom Button Position

```jsx
<FloatingAIAssistant
  // ... other props
  position="top-left"
/>
```

### Custom Button Label

```jsx
<FloatingAIAssistant
  // ... other props
  buttonLabel="Ask AI"
/>
```

### Custom Icon

```jsx
import { HiLightBulb } from 'react-icons/hi'

<FloatingAIAssistant
  // ... other props
  buttonIcon={<HiLightBulb className="w-6 h-6" />}
/>
```

## Accessibility

The component follows WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard support with focus trap in modal
- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Focus Management**: Auto-focus on textarea when modal opens
- **High Contrast**: Supports high contrast mode
- **Touch Targets**: Minimum 44x44px touch targets for mobile
- **Screen Reader**: Announces modal open/close and error messages

## Error Handling

The component handles various error scenarios:

1. **Network Errors**: Shows "Network error" message
2. **401 Unauthorized**: Attempts token refresh, redirects to login if failed
3. **403 Forbidden**: Shows permission error message
4. **429 Rate Limited**: Shows rate limit message
5. **500 Server Errors**: Shows generic server error message
6. **Validation Errors**: Displays field-specific error messages

All errors are displayed in a user-friendly format with clear instructions.

## Performance Considerations

- **Lazy Loading**: Component is loaded only when rendered
- **Optimized Animations**: Uses CSS transforms and will-change for smooth animations
- **Request Timeout**: 60-second timeout for AI requests
- **Modal State**: Modal content is only rendered when open (AnimatePresence)
- **Body Scroll Lock**: Prevents background scrolling when modal is open

## Troubleshooting

### Modal Doesn't Open

**Problem**: Clicking the button doesn't open the modal.

**Solutions**:
- Check browser console for JavaScript errors
- Ensure required props (`subjectName`, `topicName`, `category`) are provided
- Verify no z-index conflicts with other elements

### API Request Fails

**Problem**: Getting error messages when submitting.

**Solutions**:
- Verify `NEXT_PUBLIC_API_URL` environment variable is set
- Check network tab for actual API request/response
- Ensure user is authenticated (JWT token exists)
- Verify backend endpoint is available at `/api/v1/ai/chat`
- Check backend logs for detailed error information

### Token Refresh Issues

**Problem**: Getting 401 errors even when logged in.

**Solutions**:
- Check if refresh token exists in localStorage
- Verify backend refresh endpoint works
- Check token expiration times
- Ensure CORS is properly configured

### Modal Not Responsive on Mobile

**Problem**: Modal doesn't display correctly on mobile devices.

**Solutions**:
- Check viewport meta tag in layout
- Verify CSS breakpoints are working
- Test on actual device (not just browser dev tools)
- Ensure parent container doesn't have overflow hidden

### Focus Trap Not Working

**Problem**: Tab key navigates outside modal.

**Solutions**:
- Verify modal has proper ref (`modalRef`)
- Check that all focusable elements have correct tabindex
- Ensure no elements have `tabindex="-1"` incorrectly set

## Dependencies

The component depends on:

- `react` - React library
- `framer-motion` - Animation library
- `react-icons` - Icon library
- `axios` - HTTP client
- `@/components/Button` - Button component
- `@/components/Card` - Card component
- `@/components/Textarea` - Textarea component
- `@/components/Badge` - Badge component
- `@/utils/aiService` - AI service utility

## Related Files

- **Component**: `src/components/FloatingAIAssistant.jsx`
- **Styles**: `src/components/FloatingAIAssistant.module.scss`
- **Service**: `src/utils/aiService.js`
- **Settings**: `src/assets/styles/_settings.scss`

## Best Practices

1. **Provide Clear Context**: Always include meaningful `subjectName`, `topicName`, and `category`
2. **Use Description Wisely**: Include relevant context in `description` that helps AI understand the interface
3. **Positioning**: Use appropriate `position` prop based on page layout
4. **Error Handling**: Implement proper error boundaries if needed
5. **Loading States**: Component handles loading states, but you may want to show page-level loading during initial render
6. **Testing**: Test on different screen sizes and devices
7. **Accessibility**: Verify with screen readers and keyboard navigation

## Future Enhancements

Potential improvements for future versions:

- Support for conversation history
- Ability to edit/regenerate responses
- Support for markdown formatting in responses
- File upload capability
- Voice input support
- Response sharing functionality
- Analytics integration

## Support

For issues or questions:
1. Check this documentation first
2. Review component code and comments
3. Check backend API documentation
4. Review browser console for errors
5. Contact the development team

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Basic floating button and modal functionality
- AI integration with backend
- Full accessibility support
- Mobile-responsive design
