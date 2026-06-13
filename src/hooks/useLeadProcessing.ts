'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AiResult, Lead } from '@/lib/demo-data';

interface UseLeadProcessingOptions {
  onLeadCreated: (lead: Lead) => void;
}

export function useLeadProcessing({ onLeadCreated }: UseLeadProcessingOptions) {
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AiResult | null>(null);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearPipelineTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const schedulePipelineStep = useCallback((callback: () => void, delayMs: number) => {
    const timerId = setTimeout(callback, delayMs);
    timersRef.current.push(timerId);
  }, []);

  useEffect(() => clearPipelineTimers, [clearPipelineTimers]);

  const handleSubmit = useCallback(async () => {
    const message = inputMessage.trim();
    if (!message || isProcessing) return;

    clearPipelineTimers();
    setIsProcessing(true);
    setActiveStep(1);
    setCurrentResult(null);
    setCurrentLead(null);
    setShowNotification(false);
    setShowResult(false);
    setWarnings([]);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, source: 'Web form' }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.error || 'Не удалось обработать заявку. Попробуйте ещё раз.');
        setIsProcessing(false);
        setActiveStep(0);
        return;
      }

      setCurrentResult(data.aiResult);
      setCurrentLead(data.lead);
      onLeadCreated(data.lead);
      if (data._warnings?.length) setWarnings(data._warnings);

      setActiveStep(2);
      schedulePipelineStep(() => setActiveStep(3), 600);
      schedulePipelineStep(() => {
        setActiveStep(4);
        setShowNotification(true);
      }, 1200);
      schedulePipelineStep(() => {
        setActiveStep(5);
        setShowResult(true);
        setIsProcessing(false);
      }, 1800);
    } catch {
      setErrorMessage('Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.');
      setIsProcessing(false);
      setActiveStep(0);
    }
  }, [clearPipelineTimers, inputMessage, isProcessing, onLeadCreated, schedulePipelineStep]);

  return {
    inputMessage,
    setInputMessage,
    isProcessing,
    currentResult,
    currentLead,
    activeStep,
    showNotification,
    showResult,
    warnings,
    errorMessage,
    handleSubmit,
  };
}
