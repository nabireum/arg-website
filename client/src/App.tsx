import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { GameProvider } from "./contexts/GameContext";
import Home from "./pages/Home";
import Puzzle from "./pages/Puzzle";
import Room1 from "./pages/Room1";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/room1" component={Room1} />
      <Route path="/room1/:slug" component={Puzzle} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
