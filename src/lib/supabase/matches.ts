import { supabase } from './client';
import { Match, Innings, Ball } from '@/types';
import { toast } from 'sonner';

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
        team1_id: match.team1Id,
        team2_id: match.team2Id,
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

export async function createInnings(innings: Omit<Innings, 'id' | 'overs'>) {
  try {
    const { data, error } = await supabase
      .from('innings')
      .insert({
        match_id: innings.match_id,
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
        ball_number: ball.ball_number,
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
