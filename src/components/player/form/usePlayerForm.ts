
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { playerSchema, PlayerFormValues } from "./schema";
import { Player } from "@/types";
import { createPlayer, uploadPlayerPhoto, updatePlayer, getPlayerById } from "@/lib/supabase";

export const usePlayerForm = (playerId?: string) => {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const isEditMode = !!playerId;

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      battingHand: "Right",
      bowlingHand: "Right",
      bowlingType: "None",
    },
  });

  useEffect(() => {
    if (playerId) {
      setIsLoading(true);
      getPlayerById(playerId)
        .then((player) => {
          if (player) {
            setCurrentPlayer(player);
            form.reset({
              name: player.name,
              battingHand: player.battingHand,
              bowlingHand: player.bowlingHand,
              bowlingType: player.bowlingType,
            });
            
            if (player.photoUrl) {
              setPhotoPreview(player.photoUrl);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching player:", error);
          toast.error("Failed to load player information");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [playerId, form]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo must be less than 5MB");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: PlayerFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && currentPlayer) {
        const updatedPlayer = await updatePlayer(playerId, {
          name: values.name,
          battingHand: values.battingHand,
          bowlingHand: values.bowlingHand,
          bowlingType: values.bowlingType,
        });

        if (updatedPlayer && photoFile) {
          const photoUrl = await uploadPlayerPhoto(playerId, photoFile);
          if (!photoUrl) {
            toast.error("Failed to upload photo");
          }
        }

        if (updatedPlayer) {
          toast.success("Player updated successfully!");
          navigate("/players");
        }
      } else {
        const player = await createPlayer({
          name: values.name,
          battingHand: values.battingHand,
          bowlingHand: values.bowlingHand,
          bowlingType: values.bowlingType,
          photoUrl: null,
        });

        if (player && photoFile) {
          const photoUrl = await uploadPlayerPhoto(player.id, photoFile);
          if (!photoUrl) {
            toast.error("Failed to upload photo");
          }
        }

        if (player) {
          toast.success("Player created successfully!");
          navigate("/players");
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} player:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} player`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    photoPreview,
    handlePhotoChange,
    onSubmit,
    isSubmitting,
    isLoading,
    isEditMode,
  };
};
