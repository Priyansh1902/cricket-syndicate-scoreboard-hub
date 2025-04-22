
export interface Player {
  id: string;
  name: string;
  photoUrl?: string;
  battingHand: 'Right' | 'Left';
  bowlingHand: 'Right' | 'Left';
  bowlingType: 'Spinner' | 'Pacer' | 'All-rounder' | 'None';
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  players: Player[];
  captain?: Player;
  viceCaptain?: Player;
  wicketKeeper?: Player;
}

export interface Match {
  id: string;
  date: Date;
  venue?: string;
  overs: number;
  teams: {
    team1: Team;
    team2: Team;
  };
  tossWinner?: Team;
  battingFirst?: Team;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Super Over';
  innings: Innings[];
  tournament?: Tournament;
  result?: {
    winner: Team;
    margin: string;
    manOfTheMatch?: Player;
  };
}

export interface Innings {
  id: string;
  teamBatting: Team;
  teamBowling: Team;
  overs: Over[];
  totalRuns: number;
  totalWickets: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };
  completed: boolean;
}

export interface Over {
  id: string;
  overNumber: number;
  bowler: Player;
  balls: Ball[];
  runs: number;
  wickets: number;
  extras: number;
  completed: boolean;
}

export interface Ball {
  id: string;
  ballNumber: number;
  batsman: Player;
  bowler: Player;
  runs: number;
  extras?: {
    type: 'Wide' | 'No Ball' | 'Bye' | 'Leg Bye';
    runs: number;
  };
  wicket?: {
    type: 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket';
    playerOut: Player;
    fielder?: Player;
  };
}

export interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  matches: Match[];
  teams: Team[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface PlayerStats {
  playerId: string;
  matches: number;
  batting: {
    innings: number;
    runs: number;
    ballsFaced: number;
    highestScore: number;
    fifties: number;
    hundreds: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    average: number;
    notOuts: number;
  };
  bowling: {
    innings: number;
    overs: number;
    runs: number;
    wickets: number;
    bestBowling: string;
    economy: number;
    average: number;
  };
}
