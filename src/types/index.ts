
export interface Player {
  id: string;
  name: string;
  battingHand: "Right" | "Left" | "None";
  bowlingHand: "Right" | "Left" | "None";
  bowlingType: "Off Spin" | "Leg Spin" | "Left-arm Orthodox" | "Left-arm Chinaman" | "Medium Fast" | "Fast" | "None";
  photoUrl: string | null;
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string | null;
  captain?: Player | null;
  viceCaptain?: Player | null;
  wicketKeeper?: Player | null;
  players?: Player[];
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  teams: Team[];
  status?: 'Upcoming' | 'Live' | 'Completed' | 'Ongoing';
  matches?: Match[];
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  date: string | Date;
  venue: string;
  overs?: number;
  result?: {
    winner: Team;
    margin: string;
    manOfTheMatch?: Player;
  };
  status?: 'Upcoming' | 'Live' | 'Completed' | 'Super Over';
  teams?: {
    team1: Team;
    team2: Team;
  };
  tossWinner?: Team;
  battingFirst?: Team;
  tournament?: Tournament;
  innings?: Innings[];
  winner?: Team;
  margin?: string;
  manOfTheMatch?: Player;
}

export interface Innings {
  id: string;
  match_id: string;
  teamBatting: Team;
  teamBowling: Team;
  totalRuns: number;
  totalWickets: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };
  completed: boolean;
  overs?: Over[];
}

export interface Over {
  id: string;
  innings_id: string;
  over_number: number;
  bowler: Player;
  runs: number;
  wickets: number;
  balls?: Ball[];
}

export interface Ball {
  id: string;
  innings_id: string;
  over_id: string;
  ball_number: number;
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
