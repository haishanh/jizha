import ky, { HTTPError, KyInstance } from 'ky';

export class TgProxyService {
  private client: KyInstance;

  constructor(token: string) {
    this.client = ky.create({
      prefix: 'https://api.telegram.org/bot' + token,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // only supporting POST method for now
  async proxy(endpoint: string, payload: unknown) {
    console.log({ endpoint, payload });
    try {
      return await this.client.post(endpoint, { json: payload }).json();
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
