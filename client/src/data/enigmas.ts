/**
 * ENIGMAS.TS - Banco de Dados de Enigmas do ARG
 * 
 * Este arquivo centraliza TODOS os enigmas do ARG "A Verdade sobre Danica Balian".
 * Aqui você pode facilmente adicionar, editar ou remover enigmas sem mexer no código React.
 * 
 * ESTRUTURA DE UM ENIGMA:
 * {
 *   slug: 'identificador-unico',    // Usado na URL (ex: /cofre, /arquivo)
 *   title: 'TITULO',                 // Título que aparece na página
 *   question: 'Sua pergunta...',     // Texto do enigma
 *   hint: 'Sua dica...',             // Dica que o jogador pode revelar
 *   answer: 'resposta',              // Resposta correta (case-insensitive)
 *   nextSlug: 'proximo-slug',        // Slug do próximo enigma (null se for o último)
 * }
 * 
 * COMO ADICIONAR UM NOVO ENIGMA:
 * 1. Copie o template abaixo
 * 2. Preencha todos os campos
 * 3. Atualize o nextSlug do enigma anterior para apontar para o novo
 * 4. Salve e pronto!
 */

export interface Enigma {
  slug: string;
  title: string;
  question: string;
  hint: string;
  answer: string;
  nextSlug: string | null;
}

/**
 * ENIGMAS_LISTA - Array com todos os enigmas em ordem
 * 
 * Cada enigma deve ter um slug único e apontar para o próximo
 * O último enigma deve ter nextSlug: null
 */
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

  // ==================== TEMPLATE PARA NOVO ENIGMA ====================
  // Descomente e preencha para adicionar um novo enigma:
  // 
  // {
  //   slug: 'seu-slug-aqui',
  //   title: 'SEU TITULO AQUI',
  //   question: `Sua pergunta aqui...`,
  //   hint: 'Sua dica aqui',
  //   answer: 'sua-resposta',
  //   nextSlug: null, // Mude para o próximo slug ou null se for o último
  // },
  // ====================================================================
];

/**
 * ENIGMAS_MAP - Mapa de enigmas por slug (para acesso rápido)
 * 
 * Converte o array em um objeto para busca O(1) em vez de O(n)
 * Exemplo: enigmasMap['cofre'] retorna o enigma do cofre
 */
export const ENIGMAS_MAP: Record<string, Enigma> = ENIGMAS_LISTA.reduce(
  (map, enigma) => {
    map[enigma.slug] = enigma;
    return map;
  },
  {} as Record<string, Enigma>
);

/**
 * FUNCOES UTILITARIAS
 */

/**
 * Obtém um enigma pelo slug
 * @param slug - O slug do enigma (ex: 'cofre')
 * @returns O enigma ou undefined se não encontrado
 */
export function obterEnigma(slug: string): Enigma | undefined {
  return ENIGMAS_MAP[slug];
}

/**
 * Obtém o próximo enigma
 * @param slugAtual - O slug do enigma atual
 * @returns O próximo enigma ou undefined se for o último
 */
export function obterProximoEnigma(slugAtual: string): Enigma | undefined {
  const enigmaAtual = obterEnigma(slugAtual);
  if (!enigmaAtual || !enigmaAtual.nextSlug) {
    return undefined;
  }
  return obterEnigma(enigmaAtual.nextSlug);
}

/**
 * Obtém o total de enigmas
 * @returns Número total de enigmas
 */
export function obterTotalEnigmas(): number {
  return ENIGMAS_LISTA.length;
}

/**
 * Valida se uma resposta está correta
 * @param slug - O slug do enigma
 * @param resposta - A resposta do jogador
 * @returns true se a resposta está correta, false caso contrário
 */
export function validarResposta(slug: string, resposta: string): boolean {
  const enigma = obterEnigma(slug);
  if (!enigma) {
    return false;
  }
  return resposta.toLowerCase().trim() === enigma.answer.toLowerCase().trim();
}
