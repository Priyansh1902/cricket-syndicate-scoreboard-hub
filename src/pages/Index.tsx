
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Play } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cricket-darkest text-white animate-fade-in">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cricket-primary">Cricket Syndicate</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/matches" className="text-gray-300 hover:text-white transition-colors">Matches</Link>
            <Link to="/teams" className="text-gray-300 hover:text-white transition-colors">Teams</Link>
            <Link to="/players" className="text-gray-300 hover:text-white transition-colors">Players</Link>
            <Link to="/tournaments" className="text-gray-300 hover:text-white transition-colors">Tournaments</Link>
          </nav>
          <Button className="cricket-button bg-cricket-primary">
            <Link to="/matches/new">New Match</Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cricket-primary to-purple-400 bg-clip-text text-transparent">
            Track Your Cricket Matches
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cricket Syndicate is your all-in-one platform for recording, analyzing, and celebrating your cricket matches with friends.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button className="cricket-button text-lg py-3 px-6 flex items-center gap-2" asChild>
              <Link to="/matches/new">
                <Play size={20} />
                Start New Match
              </Link>
            </Button>
            <Button variant="outline" className="text-lg py-3 px-6 border-cricket-border text-white hover:bg-cricket-dark" asChild>
              <Link to="/matches">View Matches</Link>
            </Button>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="cricket-card p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cricket-primary/20 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-cricket-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tournaments</h3>
            <p className="text-gray-400 text-center mb-4">Create and manage tournaments with multiple teams and matches.</p>
            <Button variant="ghost" className="mt-auto text-cricket-primary hover:text-white hover:bg-cricket-primary" asChild>
              <Link to="/tournaments">Manage Tournaments</Link>
            </Button>
          </div>
          
          <div className="cricket-card p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cricket-primary/20 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-cricket-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Teams & Players</h3>
            <p className="text-gray-400 text-center mb-4">Register players, create teams, and track individual statistics.</p>
            <Button variant="ghost" className="mt-auto text-cricket-primary hover:text-white hover:bg-cricket-primary" asChild>
              <Link to="/teams">Manage Teams</Link>
            </Button>
          </div>
          
          <div className="cricket-card p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cricket-primary/20 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-cricket-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Match History</h3>
            <p className="text-gray-400 text-center mb-4">Review past matches, analyze statistics, and celebrate achievements.</p>
            <Button variant="ghost" className="mt-auto text-cricket-primary hover:text-white hover:bg-cricket-primary" asChild>
              <Link to="/matches">View History</Link>
            </Button>
          </div>
        </section>
        
        <section className="glass-card p-8 rounded-lg text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
          <p className="text-gray-300 mb-6">
            Set up your first match, create teams, and start recording cricket statistics.
          </p>
          <Button className="cricket-button" asChild>
            <Link to="/setup-guide">Quick Setup Guide</Link>
          </Button>
        </section>
      </main>
      
      <footer className="py-6 px-4 border-t border-cricket-border text-center text-sm text-gray-500">
        <div className="container mx-auto">
          <p>© 2025 Cricket Syndicate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
