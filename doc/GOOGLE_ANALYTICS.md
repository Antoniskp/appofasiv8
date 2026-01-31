# Google Analytics Integration

This application includes a ready-to-use Google Analytics integration for tracking user behavior and analytics.

## Setup

### 1. Get a Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Navigate to Admin → Data Streams → Web
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Add your Measurement ID to your environment variables:

```bash
# In your .env file or deployment environment
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Deploy

Once configured, Google Analytics will automatically start tracking:
- Page views
- Navigation events
- User interactions

## Features

### Automatic Tracking

The `GoogleAnalytics` component is integrated into the root layout and automatically tracks:
- **Page Views**: Every page navigation is tracked
- **Initial Page Load**: Tracks when users first visit the site

### Custom Event Tracking

You can track custom events using the analytics utility functions in `/lib/analytics.js`:

#### Track Article Views
```javascript
import { trackArticleView } from '@/lib/analytics';

trackArticleView(articleId, articleTitle);
```

#### Track Poll Votes
```javascript
import { trackPollVote } from '@/lib/analytics';

trackPollVote(pollId, pollTitle);
```

#### Track Authentication Events
```javascript
import { trackAuth } from '@/lib/analytics';

// On login
trackAuth('login');

// On registration
trackAuth('register');

// On logout
trackAuth('logout');
```

#### Track Search
```javascript
import { trackSearch } from '@/lib/analytics';

trackSearch('search term');
```

#### Track Custom Events
```javascript
import { event } from '@/lib/analytics';

event({
  action: 'button_click',
  category: 'User Interaction',
  label: 'Subscribe Button',
  value: 1
});
```

## Implementation Details

### Components

#### `GoogleAnalytics` Component (`/components/GoogleAnalytics.js`)
- Client-side component that loads the Google Analytics script
- Uses Next.js `Script` component for optimized loading
- Automatically initializes GA with the provided Measurement ID
- Returns `null` if no Measurement ID is configured (graceful degradation)

#### Analytics Utilities (`/lib/analytics.js`)
Helper functions for tracking custom events:
- `pageview(url)` - Track page views
- `event({ action, category, label, value })` - Track custom events
- `trackArticleView(articleId, articleTitle)` - Track article views
- `trackPollVote(pollId, pollTitle)` - Track poll votes
- `trackAuth(action)` - Track authentication events
- `trackSearch(searchTerm)` - Track search events

### Integration Points

The Google Analytics component is integrated into:
- **Root Layout** (`/app/layout.js`): Loads the GA script on every page

## Privacy Considerations

- Google Analytics respects user privacy settings and browser Do Not Track settings
- Consider adding a cookie consent banner for GDPR compliance
- The analytics script loads after the page is interactive (`strategy="afterInteractive"`)

## Testing

### Without GA Measurement ID
If no `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, the component gracefully does nothing and doesn't load any scripts.

### With GA Measurement ID
1. Set your Measurement ID in `.env.local`
2. Run the development server: `npm run frontend`
3. Open your browser's Developer Tools → Network tab
4. Navigate through the site and verify that requests are made to `google-analytics.com`
5. Check your Google Analytics dashboard (may take 24-48 hours for data to appear)

## Production Deployment

Ensure your production environment has the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable set:

```bash
# For Vercel, Netlify, etc.
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Troubleshooting

### Analytics not tracking
1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Check browser console for errors
3. Verify the Measurement ID format is correct (`G-XXXXXXXXXX`)
4. Check that the script is loading in the Network tab
5. Ensure you're not blocking Google Analytics with ad blockers

### Data not appearing in GA dashboard
- Data can take 24-48 hours to appear in Google Analytics
- Use the Real-time reports in GA to see immediate data
- Verify you're looking at the correct property and date range

## Example Usage in Components

```javascript
'use client';

import { useEffect } from 'react';
import { trackArticleView } from '@/lib/analytics';

export default function ArticlePage({ article }) {
  useEffect(() => {
    // Track article view when component mounts
    trackArticleView(article.id, article.title);
  }, [article.id, article.title]);

  return (
    <article>
      <h1>{article.title}</h1>
      {/* Article content */}
    </article>
  );
}
```

## Resources

- [Google Analytics Documentation](https://developers.google.com/analytics)
- [Next.js Analytics Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Google Analytics 4 Setup Guide](https://support.google.com/analytics/answer/9304153)
