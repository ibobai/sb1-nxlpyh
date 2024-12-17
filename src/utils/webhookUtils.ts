export const WEBHOOK_URLS = {
  PAYPAL_CONNECT: "https://d90e-2a02-842a-112f-3301-484-dddf-eb42-5817.ngrok-free.app/api/paypal/connectio/connect",
  STRIPE_CONNECT: "https://d90e-2a02-842a-112f-3301-484-dddf-eb42-5817.ngrok-free.app/api/stripe/connection/connect",
  PAYPAL_WEBHOOK_CREATE: "https://d90e-2a02-842a-112f-3301-484-dddf-eb42-5817.ngrok-free.app/api/paypal/webhook/create",
  STRIPE_WEBHOOK_CREATE: "https://d90e-2a02-842a-112f-3301-484-dddf-eb42-5817.ngrok-free.app/api/stripe/webhook/create"
} as const;

export interface WebhookConfig {
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export interface ConnectionStatus {
  connected: boolean;
  accountId?: string;
  name?: string;
  email?: string;
  webhooks?: WebhookConfig[];
}

export function getConnectionStatus(searchParams: URLSearchParams): {
  isConnected: boolean;
  provider?: 'stripe' | 'paypal';
} {
  const status = searchParams.get('status');
  const source = searchParams.get('source');

  if (status === 'connected' && (source === 'stripe' || source === 'paypal')) {
    return {
      isConnected: true,
      provider: source
    };
  }

  return { isConnected: false };
}

export function getStorageKey(provider: string): string {
  return `${provider}WebhookConnection`;
}