
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
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  date: string;
  venue: string;
  result: string | null;
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teams: Team[];
}
