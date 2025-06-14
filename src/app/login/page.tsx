'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPublishers } from '@/data/mock';
import type { UserRole, Publisher } from '@/types';
import { Newspaper, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('subscriber');
  const [selectedPublisherId, setSelectedPublisherId] = useState<string>('');
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const { login, role: currentRole, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && currentRole) {
      if (currentRole === 'publisher') router.push('/publisher');
      else router.push('/subscriber');
    }
  }, [currentRole, authIsLoading, router]);
  
  useEffect(() => {
    // In a real app, fetch publishers. Here we use mock.
    setPublishers(mockPublishers);
    if (mockPublishers.length > 0) {
      setSelectedPublisherId(mockPublishers[0].id);
    }
  }, []);

  const handleLogin = () => {
    if (selectedRole === 'publisher') {
      if (!selectedPublisherId) {
        alert('Please select a publisher.'); // Or use a toast
        return;
      }
      login(selectedRole, selectedPublisherId);
    } else {
      login(selectedRole);
    }
  };

  if (authIsLoading || (!authIsLoading && currentRole)) {
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
          <CardDescription>Please select your role to continue.</CardDescription>
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

          {selectedRole === 'publisher' && (
            <div className="space-y-2">
              <Label htmlFor="publisher-select" className="text-base">Select Publisher</Label>
              <Select value={selectedPublisherId} onValueChange={setSelectedPublisherId}>
                <SelectTrigger id="publisher-select" className="w-full">
                  <SelectValue placeholder="Select a publisher" />
                </SelectTrigger>
                <SelectContent>
                  {publishers.map((publisher) => (
                    <SelectItem key={publisher.id} value={publisher.id}>
                      {publisher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            <LogIn className="mr-2 h-5 w-5" />
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
