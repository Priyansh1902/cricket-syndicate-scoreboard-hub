
import { supabase } from './client';
import { Player } from '@/types';
import { toast } from 'sonner';

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
