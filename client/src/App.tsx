/**
 * APP.TSX - Componente Principal da Aplicação
 * 
 * Responsável por:
 * - Definir as rotas da aplicação
 * - Configurar os provedores (Theme, Game, etc)
 * - Renderizar o layout principal
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider } from "./contexts/GameContext";
import Home from "./pages/Home";
import Puzzle from "./pages/Puzzle";

/**
 * Router - Define todas as rotas da aplicação
 * 
 * Rotas:
 * / - Página inicial (seleção de modo)
 * /:slug - Página de enigma (ex: /cofre, /arquivo)
 * /404 - Página não encontrada
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/:slug" component={Puzzle} />
      <Route path="/404" component={NotFound} />
      {/* Rota de fallback para páginas não encontradas */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * App - Componente raiz da aplicação
 * 
 * Estrutura de provedores (de fora para dentro):
 * 1. ErrorBoundary - Captura erros e exibe página de erro
 * 2. ThemeProvider - Fornece tema (dark/light)
 * 3. GameProvider - Fornece contexto do jogo (timer, modo, etc)
 * 4. TooltipProvider - Fornece tooltips
 * 5. Toaster - Componente de notificações
 * 6. Router - Renderiza as rotas
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <GameProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </GameProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
