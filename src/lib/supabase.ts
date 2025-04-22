
import { createClient } from '@supabase/supabase-js';
import { Player, Team, Match, Tournament, Innings, Over, Ball } from '@/types';
import { toast } from 'sonner';
import { supabaseConfig } from '@/config';

// Initialize with valid URL patterns to prevent runtime errors
// These will be replaced with real values when connecting to Supabase
const supabaseUrl = supabaseConfig.url;
const supabaseKey = supabaseConfig.anonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Players
export async function getPlayers() {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching players:', error);
    toast.error('Failed to load players');
    return [];
  }
}

export async function createPlayer(player: Omit<Player, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert(player)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Player created successfully');
    return data;
  } catch (error) {
    console.error('Error creating player:', error);
    toast.error('Failed to create player');
    return null;
  }
}

export async function updatePlayer(id: string, updates: Partial<Player>) {
  try {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Player updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating player:', error);
    toast.error('Failed to update player');
    return null;
  }
}

export async function uploadPlayerPhoto(playerId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${playerId}.${fileExt}`;
    const filePath = `player-photos/${fileName}`;
    
    const { error: uploadError } = await supabase
      .storage
      .from('cricket-syndicate')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase
      .storage
      .from('cricket-syndicate')
      .getPublicUrl(filePath);
    
    await updatePlayer(playerId, { photoUrl: urlData.publicUrl });
    
    toast.success('Photo uploaded successfully');
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    toast.error('Failed to upload photo');
    return null;
  }
}

// Teams
export async function getTeams() {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        players:team_players(
          player:players(*)
        ),
        captain:players(*),
        viceCaptain:players(*),
        wicketKeeper:players(*)
      `);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    toast.error('Failed to load teams');
    return [];
  }
}

export async function createTeam(team: Omit<Team, 'id'>) {
  try {
    // First create the team
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: team.name,
        logoUrl: team.logoUrl,
        captain_id: team.captain?.id,
        vice_captain_id: team.viceCaptain?.id,
        wicket_keeper_id: team.wicketKeeper?.id
      })
      .select()
      .single();
    
    if (teamError) throw teamError;
    
    // Then add players to the team
    if (team.players && team.players.length > 0) {
      const teamPlayers = team.players.map(player => ({
        team_id: teamData.id,
        player_id: player.id
      }));
      
      const { error: playersError } = await supabase
        .from('team_players')
        .insert(teamPlayers);
      
      if (playersError) throw playersError;
    }
    
    toast.success('Team created successfully');
    return teamData;
  } catch (error) {
    console.error('Error creating team:', error);
    toast.error('Failed to create team');
    return null;
  }
}

// Matches
export async function getMatches() {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams(*),
        team2:teams(*),
        toss_winner:teams(*),
        batting_first:teams(*),
        tournament:tournaments(*),
        innings:innings(*)
      `)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    toast.error('Failed to load matches');
    return [];
  }
}

export async function createMatch(match: Omit<Match, 'id' | 'innings' | 'result'>) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        date: match.date,
        venue: match.venue,
        overs: match.overs,
        team1_id: match.teams.team1.id,
        team2_id: match.teams.team2.id,
        toss_winner_id: match.tossWinner?.id,
        batting_first_id: match.battingFirst?.id,
        status: match.status,
        tournament_id: match.tournament?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Match created successfully');
    return data;
  } catch (error) {
    console.error('Error creating match:', error);
    toast.error('Failed to create match');
    return null;
  }
}

// Tournaments
export async function getTournaments() {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        matches:matches(*),
        teams:tournament_teams(team:teams(*))
      `)
      .order('startDate', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    toast.error('Failed to load tournaments');
    return [];
  }
}

export async function createTournament(tournament: Omit<Tournament, 'id' | 'matches'>) {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        name: tournament.name,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        status: tournament.status
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add teams to tournament
    if (tournament.teams && tournament.teams.length > 0) {
      const tournamentTeams = tournament.teams.map(team => ({
        tournament_id: data.id,
        team_id: team.id
      }));
      
      const { error: teamsError } = await supabase
        .from('tournament_teams')
        .insert(tournamentTeams);
      
      if (teamsError) throw teamsError;
    }
    
    toast.success('Tournament created successfully');
    return data;
  } catch (error) {
    console.error('Error creating tournament:', error);
    toast.error('Failed to create tournament');
    return null;
  }
}

// Match Scoring
export async function createInnings(innings: Omit<Innings, 'id' | 'overs'>) {
  try {
    const { data, error } = await supabase
      .from('innings')
      .insert({
        match_id: innings.match_id, // Fixed: use match_id instead of id
        team_batting_id: innings.teamBatting.id,
        team_bowling_id: innings.teamBowling.id,
        total_runs: innings.totalRuns,
        total_wickets: innings.totalWickets,
        extras_wides: innings.extras.wides,
        extras_no_balls: innings.extras.noBalls,
        extras_byes: innings.extras.byes,
        extras_leg_byes: innings.extras.legByes,
        completed: innings.completed
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating innings:', error);
    toast.error('Failed to create innings');
    return null;
  }
}

export async function recordBall(matchId: string, inningsId: string, overId: string, ball: Omit<Ball, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('balls')
      .insert({
        innings_id: inningsId,
        over_id: overId,
        ball_number: ball.ball_number,  // Changed from ballNumber to ball_number
        batsman_id: ball.batsman.id,
        bowler_id: ball.bowler.id,
        runs: ball.runs,
        extras_type: ball.extras?.type,
        extras_runs: ball.extras?.runs,
        wicket_type: ball.wicket?.type,
        player_out_id: ball.wicket?.playerOut.id,
        fielder_id: ball.wicket?.fielder?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update player stats
    await updatePlayerStats(ball.batsman.id, ball.bowler.id, ball, ball.wicket?.playerOut.id);
    
    toast.success('Ball recorded');
    return data;
  } catch (error) {
    console.error('Error recording ball:', error);
    toast.error('Failed to record ball');
    return null;
  }
}

async function updatePlayerStats(batsmanId: string, bowlerId: string, ball: Omit<Ball, 'id'>, playerOutId?: string) {
  try {
    // Update batsman stats
    if (ball.runs > 0 && !ball.extras) {
      await supabase.rpc('update_batsman_stats', {
        p_id: batsmanId,
        p_runs: ball.runs,
        p_balls: 1,
        p_fours: ball.runs === 4 ? 1 : 0,
        p_sixes: ball.runs === 6 ? 1 : 0
      });
    }
    
    // Update bowler stats
    const ballRunsForBowler = ball.extras?.type === 'Bye' || ball.extras?.type === 'Leg Bye' 
      ? 0 
      : (ball.runs + (ball.extras?.runs || 0));
      
    await supabase.rpc('update_bowler_stats', {
      p_id: bowlerId,
      p_balls: ball.extras?.type === 'Wide' || ball.extras?.type === 'No Ball' ? 0 : 1,
      p_runs: ballRunsForBowler,
      p_wickets: ball.wicket && ball.wicket.type !== 'Run Out' ? 1 : 0
    });
    
    // Update player out stats if there was a wicket
    if (playerOutId) {
      await supabase.rpc('update_dismissal', {
        p_id: playerOutId
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating player stats:', error);
    return false;
  }
}
