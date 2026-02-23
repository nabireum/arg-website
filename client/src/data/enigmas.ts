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
    title: 'COFRE',
    question: `Se está lendo isso, então provavelmente gostaria de saber a verdade. Mas preciso ter certeza de que a pessoa errada não chegou até aqui por engano. Se teve acesso àqueles documentos, então já sabe o que fazer. Prove que meu segredo está seguro contigo.`,
    hint: 'A resposta está nos documentos que você encontrou anteriormente',
    answer: '7Q!mZ9@F#2KxR$A8',
    nextSlug: 'festa',
  },
  {
    slug: 'festa',
    title: 'FESTA À FANTASIA',
    question: `Monte o quebra-cabeça para revelar a mensagem oculta. Clique nas peças para deslizá-las. Quando terminar, digite a resposta que você vê na imagem.`,
    hint: 'Procure pela data e evento mencionados na imagem',
    answer: 'FarofaDaBlythe',
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
