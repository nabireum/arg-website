# Como editar (e adicionar) mensagens do "Inspecionar elemento"

Este projeto usa comentários HTML no DOM para exibir mensagens escondidas no inspetor.

## 1) Editar a mensagem da Home

A mensagem da Home está em:

- `client/src/pages/Home.tsx`
- constante `INSPECT_MESSAGE`

### Passo a passo no GitHub Web

1. Abra o repositório no GitHub.
2. Entre em **`client/src/pages/Home.tsx`**.
3. Clique em **Edit this file** (ícone de lápis).
4. Encontre:

```ts
const INSPECT_MESSAGE = "...";
```

5. Troque o texto entre aspas.
6. Clique em **Commit changes** (direto na branch ou via branch/PR).
7. Aguarde o deploy e valide no navegador com `F12` / **Inspecionar**.

---

## 2) Adicionar mensagem em outra página (ex.: `/room1/amongus`)

Agora existe um hook reutilizável para isso:

- `client/src/hooks/useInspectComment.ts`

### Exemplo já implementado em `/room1/:slug`

No arquivo `client/src/pages/Puzzle.tsx`, a rota `/room1/amongus` já usa uma mensagem específica via mapa:

```ts
const INSPECT_MESSAGES_BY_SLUG: Record<string, string> = {
  amongus: '...'
};
```

Se quiser adicionar para outras páginas/enigmas dessa rota, basta incluir outro item no mapa:

```ts
const INSPECT_MESSAGES_BY_SLUG: Record<string, string> = {
  amongus: 'Mensagem do amongus',
  tucupi: 'Mensagem do tucupi',
  festa: 'Mensagem da festa'
};
```

### Como aplicar em qualquer nova página React

1. Abra/crie a página (ex.: `NovaPagina.tsx`).
2. Importe o hook e `useRef`:

```ts
import { useRef } from 'react';
import { useInspectComment } from '@/hooks/useInspectComment';
```

3. Crie a constante da mensagem e o `ref`:

```ts
const INSPECT_MESSAGE = 'Sua mensagem escondida';
const pageRef = useRef<HTMLDivElement>(null);
useInspectComment(pageRef, INSPECT_MESSAGE);
```

4. Passe o `ref` no container principal:

```tsx
<div ref={pageRef}>...</div>
```

5. Commit, deploy e valide no inspetor.

---

## Observação técnica

O hook injeta o comentário usando `document.createComment(...)` e adiciona no início do container com `prepend(...)`. Ao desmontar a página, ele remove o comentário automaticamente.
