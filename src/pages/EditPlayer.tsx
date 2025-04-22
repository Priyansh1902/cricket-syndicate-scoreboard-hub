
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { PlayerForm } from "@/components/player/PlayerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

const EditPlayer = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <PlayerHeader />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="cricket-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Edit Player Information</CardTitle>
          </CardHeader>
          <CardContent>
            {id && <PlayerForm playerId={id} />}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditPlayer;
