
import React from 'react';
import { 
  Inbox, 
  Calendar, 
  CheckCircle2, 
  User, 
  Dumbbell, 
  Briefcase, 
  ShoppingCart, 
  Heart, 
  DollarSign, 
  Plane,
  Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  activeTab: 'inbox' | 'upcoming' | 'completed' | 'today' | string;
  onTabChange: (tab: string) => void;
  todoCounts: {
    inbox: number;
    upcoming: number;
    completed: number;
    today: number;
    categories: { [key: string]: number };
  };
}

const CATEGORY_ICONS = {
  Personal: Home,
  Work: Briefcase,
  Grocery: ShoppingCart,
  Gym: Dumbbell,
  Health: Heart,
  Finance: DollarSign,
  Travel: Plane,
};

export function AppSidebar({ activeTab, onTabChange, todoCounts }: AppSidebarProps) {
  const taskItems = [
    { key: 'today', label: 'Today', icon: Calendar, count: todoCounts.today },
    { key: 'inbox', label: 'Inbox', icon: Inbox, count: todoCounts.inbox },
    { key: 'upcoming', label: 'Upcoming', icon: Calendar, count: todoCounts.upcoming },
    { key: 'completed', label: 'Completed', icon: CheckCircle2, count: todoCounts.completed },
  ];

  const categories = Object.entries(todoCounts.categories).filter(([_, count]) => count > 0);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent className="p-4">
        {/* Tasks Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Tasks
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {taskItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.key)}
                    className={cn(
                      "w-full justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeTab === item.key
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-4 h-4 mr-3" />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        activeTab === item.key
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-200 text-gray-600"
                      )}>
                        {item.count}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories Section */}
        {categories.length > 0 && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Categories
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {categories.map(([category, count]) => {
                  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Home;
                  return (
                    <SidebarMenuItem key={category}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(category)}
                        className={cn(
                          "w-full justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          activeTab === category
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-3" />
                          <span>{category}</span>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          activeTab === category
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-200 text-gray-600"
                        )}>
                          {count}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Me Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Me
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTabChange('profile')}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === 'profile'
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3" />
                    <span>Profile & Stats</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
