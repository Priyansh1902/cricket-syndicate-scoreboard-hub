
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import NewMatch from "./pages/NewMatch";
import Teams from "./pages/Teams";
import NewTeam from "./pages/NewTeam";
import Players from "./pages/Players";
import NewPlayer from "./pages/NewPlayer";
import Tournaments from "./pages/Tournaments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/new" element={<NewMatch />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/new" element={<NewTeam />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/new" element={<NewPlayer />} />
          <Route path="/players/edit/:id" element={<EditPlayer />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
