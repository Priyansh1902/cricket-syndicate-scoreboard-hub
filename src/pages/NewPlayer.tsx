
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPlayer } from "@/lib/supabase";
import { toast } from "sonner";

const playerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  battingHand: z.enum(["Right", "Left"]),
  bowlingHand: z.enum(["Right", "Left"]),
  bowlingType: z.enum(["Spinner", "Pacer", "All-rounder", "None"]),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

const NewPlayer = () => {
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
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: PlayerFormValues) => {
    setIsSubmitting(true);
    try {
      const player = await createPlayer(values);
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
    <div className="min-h-screen bg-cricket-darkest text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/players">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <Link to="/" className="text-cricket-primary hover:text-cricket-accent font-bold text-xl">
                Cricket Syndicate
              </Link>
              <h1 className="text-2xl font-bold mt-1">New Player</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="cricket-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Player Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-cricket-darker flex items-center justify-center mb-4 overflow-hidden">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Player preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-500" />
                    )}
                  </div>
                  <label htmlFor="photo-upload">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <input 
                      id="photo-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter player name" {...field} className="cricket-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="battingHand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batting Hand</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="cricket-input">
                              <SelectValue placeholder="Select batting hand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Right">Right Handed</SelectItem>
                            <SelectItem value="Left">Left Handed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bowlingHand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bowling Hand</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="cricket-input">
                              <SelectValue placeholder="Select bowling hand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Right">Right Handed</SelectItem>
                            <SelectItem value="Left">Left Handed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bowlingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bowling Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cricket-input">
                            <SelectValue placeholder="Select bowling type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Spinner">Spinner</SelectItem>
                          <SelectItem value="Pacer">Pacer</SelectItem>
                          <SelectItem value="All-rounder">All-rounder</SelectItem>
                          <SelectItem value="None">None (Batsman only)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewPlayer;
