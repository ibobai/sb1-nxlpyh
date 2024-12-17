import { useWebhookConnection } from '../../hooks/useWebhookConnection';
import { WebhookStatus } from './WebhookStatus';
import { WebhookList } from './WebhookList';

interface WebhookConnectionProps {
  provider: 'stripe' | 'paypal';
}

export function WebhookConnection({ provider }: WebhookConnectionProps) {
  const { status, connect, disconnect, createWebhook } = useWebhookConnection(provider);

  return (
    <div className="space-y-4">
      <WebhookStatus
        status={status}
        provider={provider}
        onConnect={connect}
        onDisconnect={disconnect}
      />
      
      {status.connected && (
        <WebhookList
          webhooks={status.webhooks || []}
          onCreateWebhook={createWebhook}
        />
      )}
    </div>
  );
}