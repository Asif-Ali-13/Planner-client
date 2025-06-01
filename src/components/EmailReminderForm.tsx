
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailReminderData {
  reminderTime: string;
  reminderDate: string;
  emailMessage?: string;
}

interface EmailReminderFormProps {
  taskId: string;
  taskTitle: string;
  onReminderSet?: (reminderData: EmailReminderData) => void;
}

export function EmailReminderForm({ taskId, taskTitle, onReminderSet }: EmailReminderFormProps) {
  const [reminderData, setReminderData] = useState<EmailReminderData>({
    reminderTime: '',
    reminderDate: '',
    emailMessage: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSetReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reminderData.reminderDate || !reminderData.reminderTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the reminder.",
        variant: "destructive",
      });
      return;
    }

    console.log('Setting email reminder for task:', taskId, reminderData);
    
    // TODO: Call backend API to set email reminder
    // const response = await emailReminderService.setReminder({
    //   taskId,
    //   reminderDateTime: `${reminderData.reminderDate}T${reminderData.reminderTime}`,
    //   message: reminderData.emailMessage || `Reminder: ${taskTitle}`
    // });

    toast({
      title: "Reminder Set",
      description: `Email reminder scheduled for ${reminderData.reminderDate} at ${reminderData.reminderTime}`,
    });

    onReminderSet?.(reminderData);
    setIsOpen(false);
    setReminderData({ reminderTime: '', reminderDate: '', emailMessage: '' });
  };

  // Get today's date for min date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Set Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-red-500" />
            Set Email Reminder
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Task: {taskTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetReminder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reminder-date" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Reminder Date
                  </Label>
                  <Input
                    id="reminder-date"
                    type="date"
                    min={today}
                    required
                    value={reminderData.reminderDate}
                    onChange={(e) => setReminderData({
                      ...reminderData, 
                      reminderDate: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Reminder Time</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    required
                    value={reminderData.reminderTime}
                    onChange={(e) => setReminderData({
                      ...reminderData, 
                      reminderTime: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-message">Custom Message (Optional)</Label>
                <Input
                  id="email-message"
                  type="text"
                  placeholder="Custom reminder message..."
                  value={reminderData.emailMessage}
                  onChange={(e) => setReminderData({
                    ...reminderData, 
                    emailMessage: e.target.value
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  Leave blank to use default message: "Reminder: {taskTitle}"
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-500 hover:bg-red-600">
                  Set Reminder
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
