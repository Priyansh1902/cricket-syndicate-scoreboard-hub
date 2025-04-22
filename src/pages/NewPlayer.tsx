
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { PlayerForm } from "@/components/player/PlayerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewPlayer = () => {
  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <PlayerHeader />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="cricket-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Player Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewPlayer;
