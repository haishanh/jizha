import ky, { HTTPError, KyInstance } from 'ky';

type KeyboardButton = {
  text: string;
};
type ReplyKeyboardMarkup = {
  keyboard: Array<Array<KeyboardButton>>;
  resize_keyboard?: boolean;
};
// https://core.telegram.org/bots/api#sendmessage
type SendMessageParams = {
  chat_id: number;
  text: string;
  parse_mode?: string;
  reply_markup?: ReplyKeyboardMarkup;
};

export class TelegramService {
  private client: KyInstance;

  constructor(token: string) {
    this.client = ky.create({
      prefix: 'https://api.telegram.org/bot' + token,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(body: SendMessageParams) {
    try {
      await this.client.post('sendMessage', {
        json: {
          parse_mode: 'MarkdownV2',
          ...body,
        },
      });
    } catch (e) {
      await this.handleAPIError(e);
    }
  }

  private async handleAPIError(e: unknown): Promise<never> {
    if (e instanceof HTTPError) {
      const msg = await e.response.text();
      throw new Error(`${e.response.status}:${msg}`);
    }

    if (e instanceof Error) {
      throw new Error(`network:error:${e.message}`);
    }

    throw e;
  }
}
