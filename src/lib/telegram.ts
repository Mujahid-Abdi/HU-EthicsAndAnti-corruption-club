import { SystemSettings } from '@/types';

/**
 * Service to interact with the Telegram Bot API.
 * This is used for automatic cross-posting from the admin dashboard to a Telegram channel.
 */
export class TelegramService {
  /**
   * Helper to get all channel IDs from settings.
   */
  private static getChannelIds(settings: SystemSettings): string[] {
    if (!settings.telegramChannelId) return [];
    return settings.telegramChannelId
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
  }

  /**
   * Sends a message to all configured Telegram channels.
   * Returns a map of channelId -> messageId.
   */
  static async sendPost(settings: SystemSettings, content: {
    title: string;
    text: string;
    imageUrl?: string | null;
    link?: string;
    type: 'News' | 'Announcement' | 'Event';
  }): Promise<Record<string, string>> {
    if (!settings.telegramEnabled || !settings.telegramBotToken) {
      return {};
    }

    const channelIds = this.getChannelIds(settings);
    const botToken = settings.telegramBotToken;
    const results: Record<string, string> = {};

    // Construct the message text
    let message = `🆕 *${content.type}: ${content.title}*\n\n`;
    message += `${content.text.length > 500 ? content.text.substring(0, 500) + '...' : content.text}\n\n`;
    
    if (content.link) {
      message += `🔗 [Read more online](${content.link})`;
    }

    for (const channelId of channelIds) {
      try {
        let url = `https://api.telegram.org/bot${botToken}/`;
        let body: any = {
          chat_id: channelId,
          parse_mode: 'Markdown',
        };

        if (content.imageUrl) {
          url += 'sendPhoto';
          body.photo = content.imageUrl;
          body.caption = message;
        } else {
          url += 'sendMessage';
          body.text = message;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        if (data.ok) {
          results[channelId] = data.result.message_id.toString();
        } else {
          console.error(`Telegram API error for channel ${channelId}:`, data);
        }
      } catch (error) {
        console.error(`Failed to send Telegram message to channel ${channelId}:`, error);
      }
    }

    return results;
  }

  /**
   * Updates existing messages on all configured Telegram channels.
   */
  static async updatePost(
    settings: SystemSettings, 
    messageIds: Record<string, string>, 
    content: {
      title: string;
      text: string;
      imageUrl?: string | null;
      link?: string;
      type: 'News' | 'Announcement' | 'Event';
    }
  ): Promise<Record<string, string>> {
    if (!settings.telegramEnabled || !settings.telegramBotToken || !messageIds) {
      return messageIds || {};
    }

    const botToken = settings.telegramBotToken;
    const currentResults: Record<string, string> = { ...messageIds };
    
    let message = `✏️ *EDITED: ${content.type}: ${content.title}*\n\n`;
    message += `${content.text.length > 500 ? content.text.substring(0, 500) + '...' : content.text}\n\n`;
    
    if (content.link) {
      message += `🔗 [Read more online](${content.link})`;
    }

    // Iterate through provided message IDs to update them
    for (const [channelId, messageId] of Object.entries(messageIds)) {
      try {
        const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: channelId,
            message_id: parseInt(messageId),
            text: message,
            parse_mode: 'Markdown',
          }),
        });

        const data = await response.json();
        if (!data.ok && !data.description.includes('message is not modified')) {
          console.error(`Failed to update message on channel ${channelId}:`, data);
        }
      } catch (error) {
        console.error(`Error updating Telegram message on channel ${channelId}:`, error);
      }
    }

    // Also check if there are NEW channels added that don't have a messageId yet
    const allChannelIds = this.getChannelIds(settings);
    const missingChannelIds = allChannelIds.filter(id => !messageIds[id]);

    if (missingChannelIds.length > 0) {
      const newSettings = { ...settings, telegramChannelId: missingChannelIds.join(',') };
      const newResults = await this.sendPost(newSettings, content);
      return { ...currentResults, ...newResults };
    }

    return currentResults;
  }

  /**
   * Deletes messages from all configured Telegram channels.
   */
  static async deletePost(settings: SystemSettings, messageIds: Record<string, string>): Promise<boolean> {
    if (!settings.telegramBotToken || !messageIds) {
      return false;
    }

    const botToken = settings.telegramBotToken;
    let overallSuccess = true;

    for (const [channelId, messageId] of Object.entries(messageIds)) {
      try {
        const url = `https://api.telegram.org/bot${botToken}/deleteMessage`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: channelId,
            message_id: parseInt(messageId),
          }),
        });

        const data = await response.json();
        if (!data.ok) {
          overallSuccess = false;
          console.error(`Failed to delete message on channel ${channelId}:`, data);
        }
      } catch (error) {
        overallSuccess = false;
        console.error(`Error deleting Telegram message on channel ${channelId}:`, error);
      }
    }

    return overallSuccess;
  }
}
