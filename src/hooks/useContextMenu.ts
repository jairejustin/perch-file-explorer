import { useState, useEffect, useCallback } from 'react';

export function useContextMenu<T>() {
  const [menuState, setMenuState] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    data: null as T | null,
  });

  const openMenu = useCallback(
    (e: React.MouseEvent | React.PointerEvent, data: T) => {
      e.preventDefault();
      setMenuState({
        isOpen: true,
        x: e.clientX,
        y: e.clientY,
        data,
      });
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setMenuState((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
  }, []);

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    document.addEventListener('contextmenu', closeMenu);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', closeMenu);
      document.removeEventListener('contextmenu', closeMenu);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu]);

  return { ...menuState, openMenu, closeMenu };
}
