
import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onAvatarChange?: (newAvatarUrl: string) => void;
}

export function AvatarUpload({ currentAvatar, userName, onAvatarChange }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { updateUser } = useUser();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 URL for preview (in a real app, you'd upload to a server)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newAvatarUrl = e.target?.result as string;
        
        // Update user profile with new avatar
        await updateUser({ avatar: newAvatarUrl });
        
        // Call the callback if provided
        onAvatarChange?.(newAvatarUrl);
        
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully."
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update your avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      <Avatar className="w-16 h-16 cursor-pointer" onClick={handleUploadClick}>
        <AvatarImage src={currentAvatar} alt={userName} />
        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
      
      {/* Upload overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={handleUploadClick}
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <Camera className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button for mobile/accessibility */}
      <Button
        variant="outline"
        size="sm"
        className="mt-2 w-full"
        onClick={handleUploadClick}
        disabled={isUploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Change Photo'}
      </Button>
    </div>
  );
}
