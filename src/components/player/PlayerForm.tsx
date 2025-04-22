
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "./PhotoUpload";
import { TextFormField } from "./form-fields/TextFormField";
import { SelectFormField } from "./form-fields/SelectFormField";
import { usePlayerForm } from "./form/usePlayerForm";
import { handOptions, bowlingOptions } from "./form/constants";
import { useNavigate } from "react-router-dom";

interface PlayerFormProps {
  playerId?: string;
}

export const PlayerForm = ({ playerId }: PlayerFormProps) => {
  const navigate = useNavigate();
  const {
    form,
    photoPreview,
    handlePhotoChange,
    onSubmit,
    isSubmitting,
    isLoading,
    isEditMode,
  } = usePlayerForm(playerId);

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
