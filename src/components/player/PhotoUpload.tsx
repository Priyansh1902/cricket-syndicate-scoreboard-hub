
import { Button } from "@/components/ui/button";
import { Upload, User, Image as ImageIcon } from "lucide-react";

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
          <User className="h-16 w-16 text-gray-500" />
        )}
      </div>
      <div className="flex gap-2">
        <label htmlFor="camera-upload">
          <Button 
            type="button" 
            variant="outline" 
            className="cursor-pointer flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Camera
          </Button>
          <input 
            id="camera-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            capture="user"
            onChange={onPhotoChange}
          />
        </label>
        <label htmlFor="gallery-upload">
          <Button 
            type="button" 
            variant="outline" 
            className="cursor-pointer flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Gallery
          </Button>
          <input 
            id="gallery-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={onPhotoChange}
          />
        </label>
      </div>
    </div>
  );
};
