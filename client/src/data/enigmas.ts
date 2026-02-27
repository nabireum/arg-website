import { PRESCIENCIA_IMAGE_DATA_URL } from './prescienciaImage';
export interface Enigma {
  slug: string;
  title: string;
  question: string;
  hint: string;
  answer: string | string[];
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
    question: '🍍,📚,🎧',
    hint: 'Na primeira vez, pensou ser pequeno. Na segunda, nem precisou falar. Na última, disse ruídos. Quem ele era?',
    answer: 'IMPOSTOR',
    nextSlug: 'tucupi',
  },
  {
    slug: 'tucupi',
    title: 'VOCE É O QUE COME.',
    question:
      'Purê de batata doce, Vagem no vapor com Alho Assado; Arroz com Ervas Finas, Abobrinha Grelhada; Gratin Dauphinois, Vagem Francesa, Purê de Batata, Legumes Glaceados.',
    hint: 'Gasconha, França. Foie Gras.',
    answer: 'Pato',
    nextSlug: 'presciencia',
  },
  {
    slug: 'presciencia',
    title: '',
    question: PRESCIENCIA_IMAGE_DATA_URL,
    hint: 'E sem querer, aquele foi o presságio.',
    answer: 'andheresourfinalnightalive',
    nextSlug: 'vote',
  },
  {
    slug: 'vote',
    title: '',
    question: 'INPUT NAME',
    hint: 'Como prova da sua lealdade, se realmente quiser descobrir a verdade, me dê um nome. Você precisa escolher quem. Só assim eu irei revelar o que procura.',
    answer: [
      'Leigh Ainsworth',
      'LeighAinsworth',
      'Leigh',
      'Amanda de Lavienne',
      'AmandaDeLavienne',
      'Amanda',
      'Dambi Sohn',
      'DambiSohn',
      'Dambi',
      'Saeyoung Kim',
      'SaeyoungKim',
      'Saeyoung',
      'Lilith Cohen',
      'LilithCohen',
      'Lilith',
      'Roy Aquino',
      'RoyAquino',
      'Roy',
      'Li Meiyu',
      'LiMeiyu',
      'Li',
      'Blythe Hopper',
      'BlytheHopper',
      'Blythe',
      'Jason Mendal',
      'JasonMendal',
      'Jason',
      'Thomas Rheault',
      'ThomasRheault',
      'Thomas',
      'Alma Carter',
      'AlmaCarter',
      'Alma',
      'Hyun Sohn',
      'HyunSohn',
      'Hyun',
      'Armin Keenan',
      'ArminKeenan',
      'Armin',
      'Ambre Carello',
      'AmbreCarello',
      'Ambre',
      'Nathaniel Carello',
      'NathanielCarello',
      'Nathaniel',
      'Chani',
      'Priya Diwani',
      'PriyaDiwani',
      'Priya',
      'Castiel Veilmont',
      'CastielVeilmont',
      'Castiel',
      'Joan Bellamy',
      'JoanBellamy',
      'Joan',
      'Charlotte Volkova',
      'CharlotteVolkova',
      'Charlotte',
      'Gabin Roché',
      'GabinRoché',
      'Gabin',
      'Debrah',
      'Ysaline Dolga',
      'YsalineDolga',
      'Ysaline',
      'Olivier Delvis',
      'OlivierDelvis',
      'Olivier',
      'Melody Grace',
      'MelodyGrace',
      'Melody',
      'Devon Okere',
      'DevonOkere',
      'Devon',
      'Kim Phillips',
      'KimPhillips',
      'Kim',
      'Helena Aubinet',
      'HelenaAubinet',
      'Helena',
      'Iris Rheault',
      'IrisRheault',
      'Iris',
      'Lysandre Ainsworth',
      'LysandreAinsworth',
      'Lysandre',
      'Lynn Vienne Darcy',
      'LynnVienneDarcy',
      'Lynn',
      'Violette Delvis',
      'VioletteDelvis',
      'Violette',
      'Nina Zaytseva',
      'NinaZaytseva',
      'Nina',
      'Rosalya de Meilhan',
      'RosalyaDeMeilhan',
      'Rosalya',
    ],
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

  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase()
      .trim();

  const normalizedAnswer = normalize(resposta);
  const possibleAnswers = Array.isArray(enigma.answer) ? enigma.answer : [enigma.answer];

  return possibleAnswers.some((answer) => normalize(answer) === normalizedAnswer);
}
