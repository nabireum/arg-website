import { useEffect, type RefObject } from 'react';

/**
 * Adiciona um comentário HTML no início de um elemento para aparecer no inspetor.
 */
export function useInspectComment(
  containerRef: RefObject<HTMLElement | null>,
  message?: string | null,
) {
  useEffect(() => {
    if (!containerRef.current || !message?.trim()) return;

    const commentNode = document.createComment(` ${message} `);
    containerRef.current.prepend(commentNode);

    return () => {
      if (containerRef.current?.contains(commentNode)) {
        containerRef.current.removeChild(commentNode);
      }
    };
  }, [containerRef, message]);
}
