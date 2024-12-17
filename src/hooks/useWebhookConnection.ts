import { useState, useEffect } from 'react';
import { WEBHOOK_URLS, getConnectionStatus, getStorageKey, type ConnectionStatus } from '../utils/webhookUtils';
import toast from 'react-hot-toast';

export function useWebhookConnection(provider: 'stripe' | 'paypal') {
  const [status, setStatus] = useState<ConnectionStatus>(() => {
    const saved = localStorage.getItem(getStorageKey(provider));
    return saved ? JSON.parse(saved) : { connected: false };
  });

  useEffect(() => {
    const handleCallback = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const { isConnected, provider: connectedProvider } = getConnectionStatus(searchParams);
      
      if (isConnected && connectedProvider === provider) {
        const newStatus: ConnectionStatus = {
          connected: true,
          accountId: searchParams.get('client_id') || undefined,
          name: searchParams.get('name') || undefined,
          email: searchParams.get('email') || undefined,
          webhooks: []
        };
        
        setStatus(newStatus);
        localStorage.setItem(getStorageKey(provider), JSON.stringify(newStatus));
        toast.success(`${provider} connected successfully`);
        
        // Clean up the URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    };

    handleCallback();
  }, [provider]);

  const connect = () => {
    const url = new URL(
      provider === 'paypal' ? WEBHOOK_URLS.PAYPAL_CONNECT : WEBHOOK_URLS.STRIPE_CONNECT
    );
    url.searchParams.set('source', provider);
    window.location.href = url.toString();
  };

  const disconnect = () => {
    setStatus({ connected: false });
    localStorage.removeItem(getStorageKey(provider));
    toast.success(`${provider} disconnected successfully`);
  };

  const createWebhook = async () => {
    try {
      const url = provider === 'paypal' 
        ? WEBHOOK_URLS.PAYPAL_WEBHOOK_CREATE 
        : WEBHOOK_URLS.STRIPE_WEBHOOK_CREATE;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: status.accountId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create webhook');
      }

      const webhook = await response.json();
      const updatedStatus = {
        ...status,
        webhooks: [...(status.webhooks || []), webhook],
      };

      setStatus(updatedStatus);
      localStorage.setItem(getStorageKey(provider), JSON.stringify(updatedStatus));
      toast.success('Webhook created successfully');
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook');
    }
  };

  return {
    status,
    connect,
    disconnect,
    createWebhook
  };
}