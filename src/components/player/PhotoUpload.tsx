
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

interface PhotoUploadProps {
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotoUpload = ({ photoPreview, onPhotoChange }: PhotoUploadProps) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-32 h-32 rounded-full bg-cricket-darker flex items-center justify-center mb-4 overflow-hidden">
        {photoPreview ? (
          <img 
            src={photoPreview} 
            alt="Player preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <Camera className="h-16 w-16 text-gray-500" />
        )}
      </div>
      <div className="flex gap-2">
        <label htmlFor="camera-upload">
          <Button 
            type="button" 
            variant="outline" 
            className="cursor-pointer"
          >
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </Button>
          <input 
            id="camera-upload" 
            type="file" 
            accept="image/*"
            capture="environment"
            onChange={onPhotoChange}
            className="hidden"
          />
        </label>
        <label htmlFor="gallery-upload">
          <Button 
            type="button" 
            variant="outline" 
            className="cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Gallery
          </Button>
          <input 
            id="gallery-upload" 
            type="file" 
            accept="image/*"
            onChange={onPhotoChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
