'use client';

import { useEffect } from 'react';

export const useKeyboardShortcuts = (callbacks: {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (!modKey) return;

      // Ctrl/Cmd + Z : Undo
      if (e.key === 'z' && !e.shiftKey && callbacks.onUndo) {
        e.preventDefault();
        callbacks.onUndo();
      }

      // Ctrl/Cmd + Shift + Z : Redo
      if (e.key === 'z' && e.shiftKey && callbacks.onRedo) {
        e.preventDefault();
        callbacks.onRedo();
      }

      // Ctrl/Cmd + S : Save (Download PDF)
      if (e.key === 's' && callbacks.onSave) {
        e.preventDefault();
        callbacks.onSave();
      }

      // Ctrl/Cmd + P : Print
      if (e.key === 'p' && callbacks.onPrint) {
        e.preventDefault();
        callbacks.onPrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};
