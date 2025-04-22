
import { supabase } from './client';
import { Team } from '@/types';
import { toast } from 'sonner';

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
