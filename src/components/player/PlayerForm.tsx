
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PhotoUpload } from "./PhotoUpload";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPlayer, uploadPlayerPhoto, getPlayerById, updatePlayer } from "@/lib/supabase";
import { TextFormField } from "./form-fields/TextFormField";
import { SelectFormField } from "./form-fields/SelectFormField";
import { Player } from "@/types";

const playerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  battingHand: z.enum(["Right", "Left", "None"]),
  bowlingHand: z.enum(["Right", "Left", "None"]),
  bowlingType: z.enum([
    "Off Spin",
    "Leg Spin",
    "Left-arm Orthodox",
    "Left-arm Chinaman",
    "Medium Fast",
    "Fast",
    "None"
  ]),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

const handOptions = [
  { value: "Right", label: "Right Handed" },
  { value: "Left", label: "Left Handed" },
  { value: "None", label: "None" },
];

const bowlingOptions = [
  { value: "Off Spin", label: "Off Spin" },
  { value: "Leg Spin", label: "Leg Spin" },
  { value: "Left-arm Orthodox", label: "Left-arm Orthodox" },
  { value: "Left-arm Chinaman", label: "Left-arm Chinaman" },
  { value: "Medium Fast", label: "Medium Fast" },
  { value: "Fast", label: "Fast" },
  { value: "None", label: "None (Batsman only)" },
];

interface PlayerFormProps {
  playerId?: string;
}

export const PlayerForm = ({ playerId }: PlayerFormProps) => {
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
        // Update existing player
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
        // Create new player
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-16 h-16 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PhotoUpload 
          photoPreview={photoPreview}
          onPhotoChange={handlePhotoChange}
        />

        <TextFormField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Enter player name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectFormField
            control={form.control}
            name="battingHand"
            label="Batting Hand"
            options={handOptions}
            placeholder="Select batting hand"
          />

          <SelectFormField
            control={form.control}
            name="bowlingHand"
            label="Bowling Hand"
            options={handOptions}
            placeholder="Select bowling hand"
          />
        </div>

        <SelectFormField
          control={form.control}
          name="bowlingType"
          label="Bowling Type"
          options={bowlingOptions}
          placeholder="Select bowling type"
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/players")}>
            Cancel
          </Button>
          <Button type="submit" className="cricket-button" disabled={isSubmitting}>
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Player" : "Create Player")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
