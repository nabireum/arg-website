# Guia: Como Adicionar Novos Enigmas ao ARG

## Visão Geral

O sistema de enigmas do ARG usa **slugs personalizados** em vez de números. Cada enigma tem um identificador único (slug) que aparece na URL, funcionando como uma dica para o jogador.

**Exemplo de URL:**
```
www.segredobalian.com/cofre
www.segredobalian.com/arquivo
www.segredobalian.com/segredo
```

O slug "cofre" é uma dica - o jogador já resolveu um enigma anterior cuja resposta era a senha de um cofre.

---

## Estrutura de um Enigma

Cada enigma é um objeto com a seguinte estrutura:

```typescript
{
  slug: 'nome-unico',           // Identificador único (usado na URL)
  title: 'TITULO',              // Título do enigma (aparece na página)
  question: 'Sua pergunta...',  // Texto do enigma
  hint: 'Sua dica...',          // Dica que o jogador pode revelar
  answer: 'resposta',           // Resposta correta (case-insensitive)
  nextSlug: 'proximo-slug',     // Slug do próximo enigma (null se for o último)
}
```

---

## Passo a Passo: Adicionar um Novo Enigma

### 1. Abra o arquivo `client/src/pages/Puzzle.tsx`

### 2. Localize o objeto `PUZZLES_BY_SLUG`

Você encontrará algo assim:

```typescript
const PUZZLES_BY_SLUG: Record<string, Puzzle> = {
  cofre: {
    slug: 'cofre',
    title: 'COFRE',
    question: `Se está lendo isso, então provavelmente...`,
    hint: 'A resposta está nos documentos que você encontrou anteriormente',
    answer: '7Q!mZ9@F#2KxR$A8',
    nextSlug: null,
  },
};
```

### 3. Adicione o novo enigma

Adicione uma vírgula após o enigma anterior e insira o novo:

```typescript
const PUZZLES_BY_SLUG: Record<string, Puzzle> = {
  cofre: {
    slug: 'cofre',
    title: 'COFRE',
    question: `Se está lendo isso, então provavelmente...`,
    hint: 'A resposta está nos documentos que você encontrou anteriormente',
    answer: '7Q!mZ9@F#2KxR$A8',
    nextSlug: 'arquivo',  // ← MUDE PARA O PRÓXIMO SLUG
  },
  arquivo: {  // ← NOVO ENIGMA
    slug: 'arquivo',
    title: 'ARQUIVO',
    question: `Qual é a verdade que você procura?`,
    hint: 'Procure nos arquivos pessoais',
    answer: 'verdade',
    nextSlug: null,  // null porque é o último enigma
  },
};
```

### 4. Atualizar o `nextSlug` do enigma anterior

**Importante:** Sempre atualize o `nextSlug` do enigma anterior para apontar para o novo enigma.

---

## Exemplo Completo: Adicionando 3 Enigmas

```typescript
const PUZZLES_BY_SLUG: Record<string, Puzzle> = {
  cofre: {
    slug: 'cofre',
    title: 'COFRE',
    question: `Se está lendo isso, então provavelmente gostaria de saber a verdade...`,
    hint: 'A resposta está nos documentos que você encontrou anteriormente',
    answer: '7Q!mZ9@F#2KxR$A8',
    nextSlug: 'diario',  // Aponta para o próximo
  },
  diario: {
    slug: 'diario',
    title: 'DIÁRIO',
    question: `O diário de Danica contém uma data importante. Qual é?`,
    hint: 'Procure pela data do desaparecimento',
    answer: '15-03-2019',
    nextSlug: 'segredo',  // Aponta para o próximo
  },
  segredo: {
    slug: 'segredo',
    title: 'SEGREDO',
    question: `Qual é o nome da pessoa que Danica mais confiava?`,
    hint: 'Está mencionado em todos os emails',
    answer: 'marcus',
    nextSlug: null,  // null porque é o último
  },
};
```

---

## Dicas Importantes

### ✓ Boas Práticas

- **Slugs descritivos:** Use nomes que façam sentido com a história (ex: `cofre`, `diario`, `email`)
- **Slugs como dicas:** O slug pode ser uma dica para o jogador (ex: `cofre` indica que a resposta anterior era uma senha)
- **Respostas case-insensitive:** A resposta "Verdade" é igual a "verdade" ou "VERDADE"
- **Quebras de linha:** Use `` `texto com quebra de linha` `` para textos longos

### ✗ Evite

- Slugs muito longos (ex: `enigma-muito-comprido-demais`)
- Slugs com caracteres especiais (use apenas letras, números e hífens)
- Deixar `nextSlug` apontando para um enigma que não existe

---

## Testando Seus Enigmas

1. **Modo Normal:** Sem limite de tempo - perfeito para testar a lógica
2. **Modo Difícil:** Com timer de 15 minutos - teste se os enigmas são resolvíveis no tempo

Para testar rapidamente:
- Vá para `http://localhost:3000/cofre` para pular a página inicial
- Teste a resposta correta e a navegação para o próximo enigma

---

## Estrutura de URLs

Quando você adiciona um novo enigma com slug `misterio`, a URL será:

```
www.segredobalian.com/misterio
```

O domínio `www.segredobalian.com` é configurado no seu hosting (Manus ou outro). O slug é a parte que você controla.

---

## Perguntas Frequentes

**P: Como faço para mudar a ordem dos enigmas?**
R: Atualize o `nextSlug` de cada enigma para apontar na ordem desejada.

**P: Posso ter enigmas com respostas que contêm espaços?**
R: Sim! Ex: `answer: 'danica balian'` funcionará normalmente.

**P: O que acontece se o jogador resolver todos os enigmas?**
R: Ele é redirecionado para a página inicial e pode começar novamente.

**P: Posso usar emojis ou caracteres especiais na resposta?**
R: Sim, mas lembre-se que a comparação é case-insensitive, então evite caracteres que mudem com maiúsculas/minúsculas.

---

## Próximos Passos

Após adicionar seus enigmas, você pode:

1. **Criar uma página de conclusão** - Mostrar os emails quando todos os enigmas forem resolvidos
2. **Adicionar efeitos de áudio** - Sons de sucesso/falha
3. **Implementar um sistema de dicas adicionais** - Além da dica principal
4. **Criar um leaderboard** - Rastrear tempos de conclusão no Modo Difícil

