import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { obterEnigma } from '@/data/enigmas';

export default function LegacyPuzzleRedirect() {
  const [, params] = useRoute('/:slug');
  const [, navigate] = useLocation();

  useEffect(() => {
    const slug = params?.slug;

    if (slug && obterEnigma(slug)) {
      navigate(`/room1/${slug}`);
      return;
    }

    navigate('/');
  }, [navigate, params?.slug]);

  return null;
}
