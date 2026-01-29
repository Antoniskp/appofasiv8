# Poll System User Guide

This guide explains how to use the poll and statistics system in the application.

## Overview

The poll system allows you to create interactive polls, collect votes, and visualize results with charts. It supports various poll types and voting methods.

## Features

### Poll Types

1. **Simple Polls**
   - Text-based answer options
   - Quick and easy to create
   - Perfect for straightforward questions

2. **Complex Polls**
   - Options with photos
   - Links to related articles or profiles
   - Rich visual presentation
   - Ideal for comparing people, places, or articles

### Question Types

1. **Single-Choice**
   - Voters select one option
   - Most common poll type
   - Clear winner determination

2. **Ranked-Choice**
   - Voters rank all options in order of preference
   - More nuanced feedback
   - Shows relative preferences

### Additional Features

- **User-Submitted Answers**: Allow participants to add their own options
- **Unauthenticated Voting**: Let non-logged-in users vote
- **Free-Text Responses**: Collect written feedback alongside votes
- **Real-Time Results**: View results with interactive charts

---

## Creating a Poll

### Step 1: Access Poll Creation

1. Log in to your account
2. Click your username in the top navigation
3. Select "Create Poll" from the dropdown menu

Or navigate to `/polls` and click "New Poll"

### Step 2: Fill in Basic Information

**Title** (required)
- Clear, concise question
- Example: "What is the best Greek city?"

**Description** (optional)
- Additional context or instructions
- Example: "Vote for your favorite city to visit"

### Step 3: Configure Poll Settings

**Poll Type**
- **Simple**: Text-only options
- **Complex**: Options with photos and links

**Question Type**
- **Single-Choice**: Vote for one option
- **Ranked-Choice**: Order all options by preference

**Status**
- **Draft**: Not visible to voters yet
- **Active**: Open for voting
- **Closed**: No longer accepting votes

**Additional Options**
- ☑ Allow users to add their own answers
- ☑ Allow voting without login
- ☑ Allow free-text responses

### Step 4: Add Poll Options

Add at least 2 options (no maximum limit).

**For Simple Polls:**
- Enter option text only

**For Complex Polls:**
- **Text**: Name or short description (required)
- **Photo URL**: Link to an image
- **Link URL**: Link to related article or profile

### Step 5: Create and Publish

1. Click "Create Poll"
2. Change status to "Active" to start receiving votes
3. Share the poll URL with others

---

## Voting on Polls

### Finding Polls

1. Navigate to `/polls` or click "Polls" in the top menu
2. Filter by status: Active, Closed, or All
3. Browse available polls

### Casting Your Vote

**For Single-Choice Polls:**
1. Click on your preferred option
2. Optionally, add a free-text response if allowed
3. Click "Submit Vote"

**For Ranked-Choice Polls:**
1. Use ▲ and ▼ buttons to arrange options in order
2. Top = most preferred, Bottom = least preferred
3. Optionally, add free-text response
4. Click "Submit Vote"

**Adding Custom Options** (if enabled):
1. Click "+ Add your own option"
2. Enter your option text
3. For complex polls, optionally add photo and link URLs
4. Click "Add"
5. The new option appears in the list
6. Vote normally

### After Voting

- You can only vote once per poll
- View results immediately after voting
- Return to see updated results anytime

---

## Viewing Results

### Access Results

- Click "Results" button on any poll
- Results are public (visible to all users)
- Updates in real-time as new votes come in

### Understanding Results

**Summary Statistics**
- Total votes received
- Authenticated vs. unauthenticated breakdown

**Option Details**
- Vote count per option
- Percentage of total votes
- Visual progress bars

**Charts**
- **Bar Chart**: Compare votes across options with auth/unauth breakdown
- **Pie Chart**: Visualize vote distribution

**Free-Text Responses**
- All written feedback in one place
- Marked as authenticated or anonymous
- Sorted by submission date

---

## Managing Your Polls

### Editing Polls

1. Navigate to your poll
2. Click "Edit" button (only visible to creator)
3. Modify settings (title, description, status, etc.)
4. **Note**: Cannot edit options after votes are cast

### Closing Polls

1. Edit your poll
2. Change status to "Closed"
3. Poll stops accepting new votes
4. Results remain visible

### Deleting Polls

1. Navigate to your poll
2. Use the delete option (only for creators)
3. Confirm deletion
4. **Warning**: This action cannot be undone

---

## Best Practices

### Creating Effective Polls

1. **Clear Questions**: Make your poll title specific and unambiguous
2. **Balanced Options**: Provide fair, comprehensive choices
3. **Appropriate Type**: Use complex polls for visual subjects (cities, products, people)
4. **Time Limits**: Set end dates for time-sensitive polls
5. **Context**: Use descriptions to provide necessary background

### Encouraging Participation

1. **Share Widely**: Post poll links in articles or social media
2. **Allow Unauth Voting**: Get more responses by not requiring login
3. **Enable User Options**: Let participants add missing choices
4. **Free-Text**: Collect qualitative feedback alongside votes

### Analyzing Results

1. **Wait for Sufficient Data**: Get enough votes before drawing conclusions
2. **Check Auth Ratio**: High unauth votes might indicate ballot stuffing
3. **Read Free-Text**: Valuable insights beyond the numbers
4. **Compare Options**: Use charts to identify clear preferences

---

## Troubleshooting

### "Authentication required to vote"
- Poll creator disabled unauthenticated voting
- Log in to vote

### "You have already voted"
- One vote per poll per user/IP address
- View results to see current standings

### "Poll is not active"
- Poll is in draft or closed status
- Contact poll creator to activate

### Can't add custom option
- Feature disabled by poll creator
- Suggest option in free-text response instead

---

## Tips & Tricks

1. **Preview Before Publishing**: Create as draft, review, then activate
2. **Use Complex Polls for Visual Topics**: Cities, products, people benefit from images
3. **Ranked-Choice for Preferences**: Better than multiple single-choice polls
4. **Monitor Results**: Check periodically for unusual voting patterns
5. **Link to Articles**: Use articleId to embed polls in related content

---

## Technical Notes

- **Vote Privacy**: Individual votes are anonymous
- **IP Tracking**: Only hashed, not stored in plain text
- **Deduplication**: Prevents duplicate votes from same user/IP
- **Real-Time**: Results update immediately after each vote
- **Mobile Friendly**: Works on all devices

---

## Support

For technical issues or feature requests, please contact the site administrators or file an issue in the repository.
