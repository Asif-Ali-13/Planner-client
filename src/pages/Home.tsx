import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Calendar, BarChart3, Users, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [signInData, setSignInData] = useState({
    username: '',
    password: ''
  });
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up data:', signUpData);
    
    // TODO: Call authentication API
    // const response = await authService.signUp(signUpData);
    
    toast({
      title: "Account Created",
      description: "Your account has been created successfully!",
    });
    
    setShowSignUp(false);
    setSignUpData({ username: '', email: '', password: '' });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in data:', signInData);
    
    // TODO: Call authentication API
    // const response = await authService.signIn(signInData);
    
    toast({
      title: "Signed In",
      description: "Welcome back!",
    });
    
    setShowSignIn(false);
    setSignInData({ username: '', password: '' });
  };

  const features = [
    {
      icon: CheckCircle2,
      title: "Smart Task Management",
      description: "Organize your tasks by categories, due dates, and priorities with an intuitive interface."
    },
    {
      icon: Calendar,
      title: "Email Reminders",
      description: "Set custom email reminders for your tasks and never miss important deadlines."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your productivity with detailed stats and progress visualizations."
    },
    {
      icon: Users,
      title: "Category Organization",
      description: "Create custom categories like Personal, Work, Gym to keep everything organized."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-red-500 mr-2" />
              <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => setShowSignIn(true)}>
                Sign In
              </Button>
              <Button onClick={() => setShowSignUp(true)} className="bg-red-500 hover:bg-red-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Organize Your Life with
            <span className="text-red-500"> TaskFlow</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The smart task management app that helps you stay organized, track progress, 
            and achieve your goals with ease.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => setShowSignUp(true)} className="bg-red-500 hover:bg-red-600">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Everything you need to stay productive
          </h3>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help you manage tasks efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-card py-16 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              See TaskFlow in Action
            </h3>
            <p className="text-lg text-muted-foreground">
              Here's how easy it is to manage your tasks
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Create Tasks</h4>
              <p className="text-muted-foreground">
                Add tasks with due dates, categories, priorities, and email reminders
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Stay Organized</h4>
              <p className="text-muted-foreground">
                View tasks by Today, Upcoming, or browse by custom categories
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Track Progress</h4>
              <p className="text-muted-foreground">
                Monitor your productivity with detailed stats and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to boost your productivity?
          </h3>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of users who have transformed their task management with TaskFlow
          </p>
          <Button size="lg" variant="secondary" onClick={() => setShowSignUp(true)}>
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-xl font-bold text-foreground">TaskFlow</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-red-500 mr-2" />
              Create Your Account
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-username">Username</Label>
              <Input
                id="signup-username"
                type="text"
                required
                value={signUpData.username}
                onChange={(e) => setSignUpData({...signUpData, username: e.target.value})}
                placeholder="Enter a unique username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                required
                value={signUpData.email}
                onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                required
                value={signUpData.password}
                onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                placeholder="Create a secure password"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowSignUp(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-500 hover:bg-red-600">
                Create Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign In Dialog */}
      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-red-500 mr-2" />
              Welcome Back
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-username">Username</Label>
              <Input
                id="signin-username"
                type="text"
                required
                value={signInData.username}
                onChange={(e) => setSignInData({...signInData, username: e.target.value})}
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                required
                value={signInData.password}
                onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowSignIn(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-500 hover:bg-red-600">
                Sign In
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
