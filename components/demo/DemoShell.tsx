'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '../../store/useDemoStore';
import { demoController } from '../../lib/demo/demoController';
import { DemoTimeline } from './DemoTimeline';
import { DemoControls } from './DemoControls';
import { DemoPresenterPanel } from './DemoPresenterPanel';

export function DemoShell() {
  const router = useRouter();
  const { isDemoActive } = useDemoStore();

  useEffect(() => {
    // Provide router to controller
    demoController.setRouter(router.push.bind(router));
  }, [router]);

  useEffect(() => {
    if (!isDemoActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowRight':
          demoController.nextStep();
          break;
        case 'ArrowLeft':
          demoController.previousStep();
          break;
        case ' ':
          e.preventDefault(); // Prevent scrolling
          const { isPlaying } = useDemoStore.getState();
          if (isPlaying) demoController.pauseDemo();
          else demoController.resumeDemo();
          break;
        case 'Escape':
          demoController.exitDemo();
          break;
        case 'r':
        case 'R':
          const { currentScenarioId } = useDemoStore.getState();
          if (currentScenarioId) demoController.startDemo(currentScenarioId);
          break;
        case 'd':
        case 'D':
          useDemoStore.getState().setPresenterMode(!useDemoStore.getState().isPresenterMode);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDemoActive]);

  if (!isDemoActive) return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <DemoTimeline />
      </div>
      <DemoPresenterPanel />
      <DemoControls />
    </>
  );
}
