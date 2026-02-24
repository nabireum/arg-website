export interface Enigma {
  slug: string;
  title: string;
  question: string;
  hint: string;
  answer: string;
  nextSlug: string | null;
}

export const ENIGMAS_LISTA: Enigma[] = [
  {
    slug: 'cofre',
    title: 'O COMEÇO DO FIM',
    question: `Se está lendo isso, então provavelmente gostaria de saber a verdade. Mas preciso ter certeza de que a pessoa errada não chegou até aqui por engano. Se teve acesso àqueles documentos, então já sabe o que fazer. Prove que meu segredo está seguro contigo.`,
    hint: 'A resposta ainda está com você. O fim de algo pode significar um novo começo também, basta entender que há segredos muito mais bem guardados.',
    answer: '7Q!mZ9@F#2KxR$A8',
    nextSlug: 'festa',
  },
  {
    slug: 'festa',
    title: 'PASSARINHO AZUL',
    question: `A Primeira vez. Você se lembra?`,
    hint: 'Se você não estava presente, pode vasculhar as memórias digitando uma hashtag especifica.',
    answer: 'FAROFADABLYTHE',
    nextSlug: 'amongus',
  },
  {
slug: 'amongus',
title: 'QUEMSOUEU?',
question: '🍍,📚,🎧'
hint: 'Na primeira vez, pensou ser pequeno. Na segunda, nem precisou falar. Na última, disse ruídos. Quem ele era?',
answer: 'IMPOSTOR',
nextSlug: null,
},
];

export const ENIGMAS_MAP: Record<string, Enigma> = ENIGMAS_LISTA.reduce(
  (map, enigma) => {
    map[enigma.slug] = enigma;
    return map;
  },
  {} as Record<string, Enigma>
);

export function obterEnigma(slug: string): Enigma | undefined {
  return ENIGMAS_MAP[slug];
}

export function validarResposta(slug: string, resposta: string): boolean {
  const enigma = obterEnigma(slug);
  if (!enigma) return false;
  return resposta.toLowerCase().trim() === enigma.answer.toLowerCase().trim();
}
