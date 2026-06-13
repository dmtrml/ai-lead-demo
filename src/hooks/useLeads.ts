'use client';

import { useCallback, useEffect, useState } from 'react';
import { initialLeads, type Lead } from '@/lib/demo-data';

export function useLeads(enabled = true) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    fetch('/api/leads')
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;

        if (data.success && data.leads.length > 0) {
          setLeads(data.leads);
        } else {
          setLeads(initialLeads);
        }
      })
      .catch(() => {
        if (isMounted) setLeads(initialLeads);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  const addLead = useCallback((lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
  }, []);

  const updateLeadStatus = useCallback((id: string, status: string) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }, []);

  return {
    leads,
    addLead,
    updateLeadStatus,
  };
}
