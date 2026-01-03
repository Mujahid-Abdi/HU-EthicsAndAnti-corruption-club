# 🤖 Telegram Bot Setup Guide for HUEC

## Step 1: Create Telegram Bot

### 1.1 Contact BotFather
1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command

### 1.2 Create Your Bot
1. **Bot Name**: `HUEC Ethics Bot`
2. **Username**: `huec_ethics_bot` (must end with 'bot')
3. **Copy the token** you receive (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Create Telegram Channel

### 2.1 Create Channel
1. In Telegram, create a new channel
2. **Channel Name**: `HUEC Ethics & Anti-Corruption`
3. **Channel Username**: `@huec_ethics` (optional but recommended)
4. Set channel description and photo

### 2.2 Add Bot as Admin
1. Go to your channel settings
2. Click "Administrators"
3. Click "Add Administrator"
4. Search for your bot username (`@huec_ethics_bot`)
5. Add the bot and give it "Post Messages" permission

### 2.3 Get Channel ID
1. Add your bot to the channel
2. Send a test message to the channel
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":-1001234567890}` - this is your channel ID

## Step 3: Configure Environment Variables

Update your `.env` file:

```env
# Telegram Bot Configuration
VITE_TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
VITE_TELEGRAM_CHANNEL_ID=-1001234567890
```

## Step 4: Test Integration

### 4.1 Test Bot Connection
1. Start your development server: `npm run dev`
2. Go to Admin Panel → News
3. Create a test news article
4. Check "Published" and "Post to Telegram"
5. Save the article
6. Check your Telegram channel for the post

### 4.2 Test Report Notifications
1. Go to the Report page
2. Submit an anonymous report
3. Check your Telegram channel for admin notification

## Features Included

### ✅ **News Integration**
- Automatically posts published news to Telegram channel
- Includes title, excerpt, date, and link back to website
- Supports images in posts
- Admin toggle to enable/disable per article

### ✅ **Announcements Integration**
- Posts announcements with priority indicators
- Shows expiration dates
- Different emojis for different priority levels
- Admin toggle to enable/disable per announcement

### ✅ **Report Notifications**
- Sends admin alerts when new reports are submitted
- Includes report category and priority
- Maintains anonymity (no personal details shared)
- Helps admins respond quickly to reports

### ✅ **Resource Sharing**
- Can post new resources to channel
- Shows category and access level
- Includes direct links to documents

## Message Formats

### News Posts
```
📰 HUEC News Update

**Article Title Here**

Brief excerpt of the article content...

📅 January 3, 2025
🔗 Read more: https://yoursite.com/news

#HUECNews #EthicsClub #HaramayaUniversity
```

### Announcements
```
🚨 HUEC Announcement

**Important Notice Title**

Full announcement content here...

⏰ Valid until: January 10, 2025

#HUECAnnouncement #EthicsClub #HaramayaUniversity
```

### Report Alerts (Admin Only)
```
🚨 New Anonymous Report Submitted

📋 Title: Academic Misconduct Report
📂 Category: Academic
⚠️ Priority: Medium

👨‍💼 Please check the admin panel for details.

#NewReport #AdminAlert #EthicsClub
```

## Security Notes

- ✅ **Bot token is secure** - stored in environment variables
- ✅ **No personal data** shared in report notifications
- ✅ **Admin-only notifications** for sensitive content
- ✅ **Public channel** only receives approved content
- ✅ **Graceful fallback** if Telegram is unavailable

## Troubleshooting

### Bot Not Posting
1. Check bot token is correct in `.env`
2. Verify bot is admin in the channel
3. Ensure channel ID is correct (starts with `-100`)
4. Check browser console for error messages

### Channel ID Issues
- Channel ID must start with `-100` for supergroups/channels
- Use the `getUpdates` API method to find correct ID
- Make sure bot has been added to the channel

### Permission Errors
- Bot needs "Post Messages" permission in channel
- Bot must be added as administrator, not just member
- Check that channel allows bots to post

## Optional Enhancements

You can extend this integration by:
- Adding more message templates
- Creating scheduled posts
- Adding interactive buttons
- Setting up webhooks for real-time updates
- Creating separate channels for different content types

---

**Need Help?** Check the Telegram Bot API documentation: https://core.telegram.org/bots/api