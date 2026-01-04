import { SystemSettings } from "@/types";

// Telegram Bot API Service for HUEC
export class TelegramService {
  private static getApiUrl(token: string) {
    if (import.meta.env.DEV) {
      return `/api-telegram/bot${token}`;
    }
    return `https://api.telegram.org/bot${token}`;
  }

  // Helper to convert base64/Data URI to Blob for Telegram upload
  private static async dataUriToBlob(dataUri: string): Promise<Blob> {
    const response = await fetch(dataUri);
    return await response.blob();
  }

  // Escape HTML special characters for Telegram's HTML mode
  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private static getChannelIds(ids: string): string[] {
    if (!ids) return [];
    return ids
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
  }

  private static truncate(text: string, limit: number): string {
    if (text.length <= limit) return text;
    return text.substring(0, limit - 3) + "...";
  }

  // Determine if we should attempt a Photo post
  private static canSendAsPhoto(url?: string): { canSend: boolean; isUpload: boolean } {
    if (!url) return { canSend: false, isUpload: false };
    const cleanUrl = url.trim();
    
    // 1. Data URI (Base64) - Requires Upload
    if (cleanUrl.startsWith('data:')) return { canSend: true, isUpload: true };
    
    // 2. Public URL - Telegram fetches it
    // Must be HTTP/S and NOT localhost (Telegram servers can't reach localhost)
    if ((cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) && 
        !cleanUrl.includes('localhost') && 
        cleanUrl.includes('.')) {
      return { canSend: true, isUpload: false };
    }

    // 3. Localhost or invalid URL - Fallback to text
    return { canSend: false, isUpload: false };
  }

  static async testConnection(token: string, channelId: string): Promise<{ success: boolean; successfulCount: number; totalCount: number }> {
    if (!token || !channelId || token.includes('YOUR_BOT_TOKEN_HERE')) {
      return { success: false, successfulCount: 0, totalCount: 0 };
    }
    
    const channels = this.getChannelIds(channelId);
    if (channels.length === 0) return { success: false, successfulCount: 0, totalCount: 0 };

    let successfulCount = 0;
    for (const chatId of channels) {
      try {
        const params = new URLSearchParams();
        params.append('chat_id', chatId);
        params.append('text', `🔔 <b>HUEC Bot Test</b>\n\nConnection successful for channel <b>${chatId}</b>! This bot is now linked to your Admin Panel.\n\n#HUEC #AdminTest`);
        params.append('parse_mode', 'HTML');

        const response = await fetch(`${this.getApiUrl(token)}/sendMessage?${params.toString()}`);
        const data = await response.json();
        if (data.ok) {
          successfulCount++;
        }
      } catch (error) {
        console.error(`Telegram Connection Test Failed for ${chatId}:`, error);
      }
    }
    
    return { 
      success: successfulCount > 0, 
      successfulCount, 
      totalCount: channels.length 
    };
  }

  static async sendPost(settings: SystemSettings, content: { title: string; text: string; imageUrl?: string; link?: string; type: 'News' | 'Announcement' | 'Event' | 'Resource' }) {
    if (!settings.telegramEnabled || !settings.telegramBotToken || !settings.telegramChannelId || settings.telegramBotToken.includes('YOUR_BOT_TOKEN_HERE')) {
       return {};
    }

    const channelList = this.getChannelIds(settings.telegramChannelId);
    const messageResults: Record<string, string> = {};

    const photoStatus = this.canSendAsPhoto(content.imageUrl);
    const textLimit = photoStatus.canSend ? 800 : 3500;
    
    const safeContent = {
      ...content,
      title: this.escapeHtml(content.title),
      text: this.escapeHtml(this.truncate(content.text, textLimit))
    };
    
    const formattedMessage = this.formatStandardMessage(safeContent);
    const imageUrl = content.imageUrl?.trim();

    for (const chatId of channelList) {
      try {
        let response;
        
        if (photoStatus.canSend && imageUrl) {
          // For images, we use POST with FormData to support both URLs and File Uploads (Blobs)
          const formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('caption', formattedMessage);
          formData.append('parse_mode', 'HTML');

          if (photoStatus.isUpload) {
            const blob = await this.dataUriToBlob(imageUrl);
            formData.append('photo', blob, `post_image_${Date.now()}.jpg`);
          } else {
            formData.append('photo', imageUrl);
          }

          response = await fetch(`${this.getApiUrl(settings.telegramBotToken)}/sendPhoto`, {
            method: 'POST',
            body: formData
          });
        } else {
          // Standard text message
          const params = new URLSearchParams();
          params.append('chat_id', chatId);
          params.append('text', formattedMessage);
          params.append('parse_mode', 'HTML');
          
          response = await fetch(`${this.getApiUrl(settings.telegramBotToken)}/sendMessage?${params.toString()}`);
        }

        const data = await response.json();
        
        if (data.ok) {
          messageResults[chatId] = data.result.message_id.toString();
        } else {
          console.error(`Telegram API Error for ${chatId}:`, data);
          
          // Fallback to text message if photo upload/fetch fails
          if (photoStatus.canSend) {
            const fallbackParams = new URLSearchParams();
            fallbackParams.append('chat_id', chatId);
            fallbackParams.append('parse_mode', 'HTML');
            const fallbackText = this.truncate(formattedMessage + (imageUrl?.startsWith('http') ? `\n\n🖼️ View Image: ${imageUrl}` : ''), 4000);
            fallbackParams.append('text', fallbackText);
            
            const fallbackRes = await fetch(`${this.getApiUrl(settings.telegramBotToken)}/sendMessage?${fallbackParams.toString()}`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.ok) {
              messageResults[chatId] = fallbackData.result.message_id.toString();
            }
          }
        }
      } catch (error) {
        console.error(`Error sending ${content.type} to ${chatId}:`, error);
      }
    }
    return messageResults;
  }

  static async updatePost(settings: SystemSettings, messageIds: Record<string, string>, content: { title: string; text: string; imageUrl?: string; link?: string; type: 'News' | 'Announcement' | 'Event' | 'Resource' }) {
    if (!settings.telegramEnabled || !settings.telegramBotToken || settings.telegramBotToken.includes('YOUR_BOT_TOKEN_HERE')) return messageIds;

    const photoStatus = this.canSendAsPhoto(content.imageUrl);
    const textLimit = photoStatus.canSend ? 800 : 3500;
    const safeContent = {
      ...content,
      title: this.escapeHtml(content.title),
      text: this.escapeHtml(this.truncate(content.text, textLimit))
    };
    const formattedMessage = this.formatStandardMessage(safeContent);
    const updatedIds: Record<string, string> = { ...messageIds };

    for (const [chatId, messageId] of Object.entries(messageIds)) {
      try {
        // Note: Telegram's editMessageCaption/Text doesn't allow changing MEDIA.
        // If a post transitions from text to image (or vice-versa), or changes photo, 
        // the most reliable way is delete and re-send.
        
        const params = new URLSearchParams();
        params.append('chat_id', chatId);
        params.append('message_id', messageId);
        params.append('parse_mode', 'HTML');

        const endpoint = photoStatus.canSend ? 'editMessageCaption' : 'editMessageText';
        
        if (photoStatus.canSend) {
          params.append('caption', formattedMessage);
        } else {
          params.append('text', formattedMessage);
        }

        const response = await fetch(`${this.getApiUrl(settings.telegramBotToken)}/${endpoint}?${params.toString()}`);
        const data = await response.json();
        
        if (!data.ok) {
          // If update fails (e.g. media type change or message deleted), delete and re-send
          await this.deletePost(settings, { [chatId]: messageId });
          const result = await this.sendPost(settings, content);
          if (result[chatId]) updatedIds[chatId] = result[chatId];
        }
      } catch (error) {
        console.error(`Update failed for ${chatId}:`, error);
      }
    }
    return updatedIds;
  }

  static async deletePost(settings: SystemSettings, messageIds: Record<string, string>) {
    if (!settings.telegramEnabled || !settings.telegramBotToken || settings.telegramBotToken.includes('YOUR_BOT_TOKEN_HERE')) return;

    for (const [chatId, messageId] of Object.entries(messageIds)) {
      try {
        const params = new URLSearchParams();
        params.append('chat_id', chatId);
        params.append('message_id', messageId);

        await fetch(`${this.getApiUrl(settings.telegramBotToken)}/deleteMessage?${params.toString()}`);
      } catch (error) {
        console.error(`Error deleting message ${messageId} from ${chatId}:`, error);
      }
    }
  }

  private static formatStandardMessage(content: { title: string; text: string; type: string; link?: string }) {
    const emojis: Record<string, string> = {
      'News': '📰',
      'Announcement': '📢',
      'Event': '🗓️',
      'Resource': '📚'
    };

    let message = `${emojis[content.type] || '🔔'} <b>HUEC ${content.type} Update</b>\n\n`;
    message += `<b>${content.title}</b>\n\n`;
    message += `${content.text}\n\n`;
    if (content.link) {
      message += `🔗 Read more: ${content.link}\n`;
    } else {
      message += `🔗 Visit website: ${window.location.origin}\n`;
    }
    message += `\n#HUEC #${content.type} #EthicsClub`;
    return message;
  }

  static async notifyNewReport(settings: SystemSettings, reportData: {
    title?: string;
    category?: string;
    priority?: string;
  }) {
    if (!settings.telegramEnabled || !settings.telegramBotToken || !settings.telegramChannelId || settings.telegramBotToken.includes('YOUR_BOT_TOKEN_HERE')) return null;

    const safeTitle = this.escapeHtml(reportData.title || 'Untitled');
    const safeCategory = this.escapeHtml(reportData.category || 'General');
    const safePriority = this.escapeHtml(reportData.priority || 'Medium');

    const message = `🚨 <b>New Anonymous Report Submitted</b>\n\n` +
      `📋 Title: ${safeTitle}\n` +
      `📂 Category: ${safeCategory}\n` +
      `⚠️ Priority: ${safePriority}\n\n` +
      `👨‍💼 Please check the admin panel for details.\n\n` +
      `#NewReport #AdminAlert #EthicsClub`;

    const channels = this.getChannelIds(settings.telegramChannelId);
    for (const chatId of channels) {
      try {
        const params = new URLSearchParams();
        params.append('chat_id', chatId);
        params.append('text', message);
        params.append('parse_mode', 'HTML');
        await fetch(`${this.getApiUrl(settings.telegramBotToken)}/sendMessage?${params.toString()}`);
      } catch (e) {
        console.error("Failed to notify admin via Telegram", e);
      }
    }
  }

  static async postNews(settings: SystemSettings, news: { title: string; excerpt?: string; imageUrl?: string }) {
    return this.sendPost(settings, {
      title: news.title,
      text: news.excerpt || '',
      imageUrl: news.imageUrl,
      type: 'News',
      link: `${window.location.origin}/news`
    });
  }

  static async postAnnouncement(settings: SystemSettings, announcement: { title: string; content: string }) {
    return this.sendPost(settings, {
      title: announcement.title,
      text: announcement.content,
      type: 'Announcement',
      link: `${window.location.origin}/news`
    });
  }

  static async postEvent(settings: SystemSettings, event: { title: string; description?: string; imageUrl?: string }) {
    return this.sendPost(settings, {
      title: event.title,
      text: event.description || '',
      imageUrl: event.imageUrl,
      type: 'Event',
      link: `${window.location.origin}/programs`
    });
  }

  static async postBlog(blog: { title: string; excerpt?: string; author?: string; tags?: string[]; url?: string }) {
    // Get system settings from localStorage or context
    const storedSettings = localStorage.getItem('system_settings');
    if (!storedSettings) return null;
    
    const settings = JSON.parse(storedSettings);
    if (!settings.telegramEnabled || !settings.telegramBotToken || !settings.telegramChannelId) return null;

    const safeTitle = this.escapeHtml(blog.title);
    const safeExcerpt = this.escapeHtml(blog.excerpt || '');
    const safeAuthor = this.escapeHtml(blog.author || 'HUEC Team');
    
    let message = `✍️ <b>New Blog Post Published</b>\n\n`;
    message += `<b>${safeTitle}</b>\n\n`;
    if (safeExcerpt) {
      message += `${this.truncate(safeExcerpt, 300)}\n\n`;
    }
    message += `👤 By: ${safeAuthor}\n`;
    
    if (blog.tags && blog.tags.length > 0) {
      const safeTags = blog.tags.map(tag => this.escapeHtml(tag)).slice(0, 3);
      message += `🏷️ Tags: ${safeTags.join(', ')}\n`;
    }
    
    if (blog.url) {
      message += `\n🔗 Read full article: ${blog.url}\n`;
    }
    
    message += `\n#HUEC #Blog #EthicsClub`;

    const channels = this.getChannelIds(settings.telegramChannelId);
    for (const chatId of channels) {
      try {
        const params = new URLSearchParams();
        params.append('chat_id', chatId);
        params.append('text', message);
        params.append('parse_mode', 'HTML');
        await fetch(`${this.getApiUrl(settings.telegramBotToken)}/sendMessage?${params.toString()}`);
      } catch (error) {
        console.error(`Error posting blog to Telegram channel ${chatId}:`, error);
      }
    }
  }
}