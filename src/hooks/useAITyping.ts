import { useState, useRef, useCallback } from 'react';

interface TypingOptions {
  speed: 'slow' | 'normal' | 'fast';
  onComplete?: () => void;
  onProgress?: (text: string) => void;
}

const SPEED_MAP = {
  slow: { min: 20, max: 80, pauseMin: 300, pauseMax: 600 },
  normal: { min: 10, max: 40, pauseMin: 150, pauseMax: 400 },
  fast: { min: 2, max: 15, pauseMin: 50, pauseMax: 150 },
};

export const useAITyping = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const typingRef = useRef<boolean>(false);
  const pauseRef = useRef<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const type = useCallback(async (text: string, options: TypingOptions) => {
    if (typingRef.current) return;
    
    setIsTyping(true);
    typingRef.current = true;
    setIsPaused(false);
    pauseRef.current = false;
    abortRef.current = new AbortController();

    const { speed, onProgress, onComplete } = options;
    const config = SPEED_MAP[speed];
    let currentText = '';

    for (let i = 0; i < text.length; i++) {
      if (abortRef.current?.signal.aborted) break;

      // Handle pause
      while (pauseRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (abortRef.current?.signal.aborted) break;
      }
      if (abortRef.current?.signal.aborted) break;

      currentText += text[i];
      if (onProgress) onProgress(currentText);

      // Realistic typing delay
      const charDelay = Math.random() * (config.max - config.min) + config.min;
      await new Promise(resolve => setTimeout(resolve, charDelay));

      // Occasional "thinking" pause
      if (Math.random() < 0.05) {
        const pauseDelay = Math.random() * (config.pauseMax - config.pauseMin) + config.pauseMin;
        await new Promise(resolve => setTimeout(resolve, pauseDelay));
      }
    }

    setIsTyping(false);
    typingRef.current = false;
    if (onComplete) onComplete();
  }, []);

  const pause = () => {
    setIsPaused(true);
    pauseRef.current = true;
  };

  const resume = () => {
    setIsPaused(false);
    pauseRef.current = false;
  };

  const cancel = () => {
    abortRef.current?.abort();
    setIsTyping(false);
    typingRef.current = false;
    setIsPaused(false);
    pauseRef.current = false;
  };

  return { type, pause, resume, cancel, isTyping, isPaused };
};
