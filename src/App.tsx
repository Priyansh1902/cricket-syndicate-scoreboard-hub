
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Players from "./pages/Players";
import NewPlayer from "./pages/NewPlayer";
import EditPlayer from "./pages/EditPlayer";
import Teams from "./pages/Teams";
import NewTeam from "./pages/NewTeam";
import Matches from "./pages/Matches";
import NewMatch from "./pages/NewMatch";
import Tournaments from "./pages/Tournaments";
import SetupGuide from "./pages/SetupGuide";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/new" element={<NewPlayer />} />
        <Route path="/players/:id/edit" element={<EditPlayer />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/new" element={<NewTeam />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/new" element={<NewMatch />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/setup-guide" element={<SetupGuide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
