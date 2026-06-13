'use client';

import { useEffect, useState } from 'react';

export interface IntegrationStatus {
  telegram: boolean;
  ai: boolean;
  sheets: boolean;
  mockMode: boolean;
  sheetsUrl?: string | null;
}

export interface BotInfo {
  username: string | null;
  link: string | null;
}

export function useIntegrationStatus() {
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [botInfo, setBotInfo] = useState<BotInfo>({ username: null, link: null });
  const [sheetsUrl, setSheetsUrl] = useState<string | null>(null);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      const healthRequest = fetch('/api/health')
        .then((r) => r.json())
        .then((data) => {
          if (!isMounted) return;

          if (data.success) {
            setIntegrationStatus(data);
            setSheetsUrl(data.sheetsUrl || null);
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setIntegrationStatus({ telegram: false, ai: false, sheets: false, mockMode: true });
        });

      const botInfoRequest = fetch('/api/telegram/bot-info')
        .then((r) => r.json())
        .then((data) => {
          if (!isMounted) return;
          if (data.success) setBotInfo({ username: data.username, link: data.link });
        })
        .catch((err) => console.error('[UI] bot-info fetch failed:', err));

      await Promise.allSettled([healthRequest, botInfoRequest]);
      if (isMounted) setPageReady(true);
    }

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    integrationStatus,
    botInfo,
    sheetsUrl,
    pageReady,
  };
}
