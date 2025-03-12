
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, UserRound, Camera, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    // In a real app, this would send updates to the backend
    toast.success('Profile updated successfully!');
    setIsEditing(false);
    
    // Mock update - in a real app this would update the profile via API
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    });
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-md">
            <CardHeader className="border-b bg-muted/40 pb-6 sm:pb-8">
              <CardTitle className="text-xl sm:text-2xl">Profile Settings</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 cursor-pointer border-4 border-background shadow-md transition-all hover:border-primary/20">
                      <AvatarImage 
                        src={selectedImage || formData.avatar} 
                        alt={formData.username} 
                        onClick={isEditing ? handleImageClick : undefined}
                        className={isEditing ? "hover:opacity-80" : ""}
                      />
                      <AvatarFallback className="text-3xl sm:text-4xl">
                        {getInitials(formData.username)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div 
                        className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary/90"
                        onClick={handleImageClick}
                      >
                        <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold">{formData.username}</h3>
                    <p className="text-sm text-muted-foreground">{user?.role}</p>
                  </div>
                  
                  {!isEditing && (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="mt-2"
                      variant="outline"
                      size="sm"
                    >
                      <UserRound className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={user?.role || ''}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            {isEditing && (
              <CardFooter className="border-t bg-muted/40 gap-2 justify-end pt-4 flex-wrap">
                <Button variant="outline" onClick={handleCancel} size="sm">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
