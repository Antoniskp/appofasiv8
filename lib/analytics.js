// Google Analytics utility functions

/**
 * Send a pageview event to Google Analytics
 * @param {string} url - The URL of the page being viewed
 */
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Send a custom event to Google Analytics
 * @param {string} action - The action being performed
 * @param {object} params - Additional parameters for the event
 * @param {string} params.category - Event category
 * @param {string} params.label - Event label
 * @param {number} params.value - Event value
 */
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track article views
 * @param {string} articleId - The ID of the article
 * @param {string} articleTitle - The title of the article
 */
export const trackArticleView = (articleId, articleTitle) => {
  event({
    action: 'view_article',
    category: 'Article',
    label: articleTitle,
  });
};

/**
 * Track poll votes
 * @param {string} pollId - The ID of the poll
 * @param {string} pollTitle - The title of the poll
 */
export const trackPollVote = (pollId, pollTitle) => {
  event({
    action: 'vote_poll',
    category: 'Poll',
    label: pollTitle,
  });
};

/**
 * Track user authentication events
 * @param {string} action - The authentication action (login, register, logout)
 */
export const trackAuth = (action) => {
  event({
    action,
    category: 'Authentication',
  });
};

/**
 * Track search events
 * @param {string} searchTerm - The search term used
 */
export const trackSearch = (searchTerm) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchTerm,
  });
};
