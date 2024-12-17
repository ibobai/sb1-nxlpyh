import { Plus } from 'lucide-react';
import type { WebhookConfig } from '../../utils/webhookUtils';

interface WebhookListProps {
  webhooks: WebhookConfig[];
  onCreateWebhook: () => void;
}

export function WebhookList({ webhooks, onCreateWebhook }: WebhookListProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Webhooks</h4>
        <button
          onClick={onCreateWebhook}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create Webhook
        </button>
      </div>

      {webhooks.length > 0 ? (
        <div className="space-y-3">
          {webhooks.map((webhook, index) => (
            <div 
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Endpoint URL
                  </p>
                  <p className="text-sm text-gray-600">
                    {webhook.url}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  webhook.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {webhook.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {webhook.events.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">
                    Events
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {webhook.events.map((event, eventIndex) => (
                      <span
                        key={eventIndex}
                        className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No webhooks configured. Click the button above to create one.
        </p>
      )}
    </div>
  );
}