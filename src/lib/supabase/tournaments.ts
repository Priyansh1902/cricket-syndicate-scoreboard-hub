
import { supabase } from './client';
import { Tournament } from '@/types';
import { toast } from 'sonner';

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
