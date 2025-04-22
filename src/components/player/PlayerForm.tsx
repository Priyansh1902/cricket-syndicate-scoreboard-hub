
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PhotoUpload } from "./PhotoUpload";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPlayer, uploadPlayerPhoto } from "@/lib/supabase";
import { TextFormField } from "./form-fields/TextFormField";
import { SelectFormField } from "./form-fields/SelectFormField";

const playerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  battingHand: z.enum(["Right", "Left"]),
  bowlingHand: z.enum(["Right", "Left"]),
  bowlingType: z.enum(["Spinner", "Pacer", "All-rounder", "None"]),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

const handOptions = [
  { value: "Right", label: "Right Handed" },
  { value: "Left", label: "Left Handed" },
];

const bowlingOptions = [
  { value: "Spinner", label: "Spinner" },
  { value: "Pacer", label: "Pacer" },
  { value: "All-rounder", label: "All-rounder" },
  { value: "None", label: "None (Batsman only)" },
];

export const PlayerForm = () => {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      battingHand: "Right",
      bowlingHand: "Right",
      bowlingType: "None",
    },
  });

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
    } catch (error) {
      console.error("Error creating player:", error);
      toast.error("Failed to create player");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {isSubmitting ? "Creating..." : "Create Player"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
