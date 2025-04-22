
export interface Tournament {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  teams: Team[];
  status?: 'Upcoming' | 'Live' | 'Completed' | 'Ongoing';  // Added 'Ongoing'
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
  status?: 'Upcoming' | 'Live' | 'Completed' | 'Super Over';  // Added 'Super Over'
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
