'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input'; // Changed from Select
import type { UserRole } from '@/types';
import { Newspaper, LogIn, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('subscriber');
  const [name, setName] = useState<string>(''); // For publisher or subscriber name
  const { login, role: currentRole, isLoading: authIsLoading, userId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authIsLoading && currentRole && userId) {
      if (currentRole === 'publisher') router.push('/publisher');
      else router.push('/subscriber');
    }
  }, [currentRole, userId, authIsLoading, router]);
  

  const handleLogin = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: `Please enter a ${selectedRole} name.`,
        variant: "destructive",
      });
      return;
    }
    await login(selectedRole, name.trim());
  };

  if (authIsLoading || (!authIsLoading && currentRole && userId)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Newspaper className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Newspaper className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome to NewsWave</CardTitle>
          <CardDescription>Please select your role and enter your name to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role-selection" className="text-base">I am a...</Label>
            <RadioGroup
              id="role-selection"
              value={selectedRole}
              onValueChange={(value: string) => setSelectedRole(value as UserRole)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subscriber" id="role-subscriber" />
                <Label htmlFor="role-subscriber" className="text-base">Subscriber</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="publisher" id="role-publisher" />
                <Label htmlFor="role-publisher" className="text-base">Publisher</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name-input" className="text-base">
              {selectedRole === 'publisher' ? 'Publisher Name' : 'Subscriber Name'}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="name-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder={`Enter your ${selectedRole} name`}
                className="pl-10"
              />
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleLogin} 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
            size="lg"
            disabled={authIsLoading}
          >
            {authIsLoading ? <Newspaper className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
            Login as {selectedRole === 'publisher' ? 'Publisher' : 'Subscriber'}
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        NewsWave &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
