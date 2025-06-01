import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Calendar, Flag, Edit2, Trash2, Clock, CheckCircle2, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, startOfDay, isToday, isTomorrow, addDays } from 'date-fns';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ProfileSection } from '@/components/ProfileSection';
import { EmailReminderForm } from '@/components/EmailReminderForm';

interface Todo {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  completedDate?: string;
}

const PRIORITY_COLORS = {
  low: 'border-green-400 text-green-600 bg-green-50',
  medium: 'border-yellow-400 text-yellow-600 bg-yellow-50', 
  high: 'border-red-400 text-red-600 bg-red-50'
};

const PRIORITY_DOTS = {
  low: 'bg-green-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-400'
};

const CATEGORIES = ['Personal', 'Work', 'Grocery', 'Gym', 'Health', 'Finance', 'Travel'];

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'upcoming' | 'completed' | 'today' | 'profile' | string>('today');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
    category: 'Personal'
  });

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const createTodo = () => {
    if (!newTodo.title.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description,
      createdDate: new Date().toISOString(),
      dueDate: newTodo.dueDate,
      priority: newTodo.priority,
      category: newTodo.category,
      completed: false
    };

    setTodos(prev => [...prev, todo]);
    setNewTodo({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'Personal'
    });
    setIsAddDialogOpen(false);
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
    setEditingTodo(null);
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedDate: !todo.completed ? new Date().toISOString() : undefined
          }
        : todo
    ));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(getFilteredTodos());
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const otherTodos = todos.filter(todo => !getFilteredTodos().includes(todo));
    setTodos([...otherTodos, ...items]);
  };

  const getFilteredTodos = () => {
    const now = new Date();
    const today = startOfDay(new Date());
    
    let filteredTodos: Todo[] = [];
    
    switch (activeTab) {
      case 'today':
        filteredTodos = todos.filter(todo => 
          !todo.completed && 
          todo.dueDate && 
          isSameDay(parseISO(todo.dueDate), today)
        );
        break;
      case 'inbox':
        filteredTodos = todos.filter(todo => !todo.completed && !todo.dueDate);
        break;
      case 'upcoming':
        filteredTodos = todos.filter(todo => !todo.completed && todo.dueDate && new Date(todo.dueDate) > today);
        break;
      case 'completed':
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
        // Category filter
        if (CATEGORIES.includes(activeTab)) {
          filteredTodos = todos.filter(todo => !todo.completed && todo.category === activeTab);
        } else {
          filteredTodos = [];
        }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => 
        todo.title.toLowerCase().includes(query) || 
        todo.description.toLowerCase().includes(query)
      );
    }

    return filteredTodos;
  };

  const getTodoCounts = () => {
    const today = startOfDay(new Date());
    
    const counts = {
      today: todos.filter(todo => 
        !todo.completed && 
        todo.dueDate && 
        isSameDay(parseISO(todo.dueDate), today)
      ).length,
      inbox: todos.filter(todo => !todo.completed && !todo.dueDate).length,
      upcoming: todos.filter(todo => !todo.completed && todo.dueDate && new Date(todo.dueDate) > today).length,
      completed: todos.filter(todo => todo.completed).length,
      categories: {} as { [key: string]: number }
    };

    CATEGORIES.forEach(category => {
      counts.categories[category] = todos.filter(todo => 
        !todo.completed && todo.category === category
      ).length;
    });

    return counts;
  };

  const groupTodosByDate = (todoList: Todo[]) => {
    const groups: { [key: string]: Todo[] } = {};
    
    todoList.forEach(todo => {
      if (!todo.dueDate) return;
      
      const date = parseISO(todo.dueDate);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(todo);
    });

    // Sort groups by date
    const sortedGroups = Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as { [key: string]: Todo[] });

    return sortedGroups;
  };

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE, MMMM d');
    }
  };

  const renderUpcomingTodos = () => {
    const groupedTodos = groupTodosByDate(getFilteredTodos());
    
    return (
      <div className="space-y-6">
        {Object.entries(groupedTodos).map(([dateKey, dateTodos]) => (
          <div key={dateKey} className="space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {getDateLabel(dateKey)}
              </h3>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {dateTodos.length}
              </span>
            </div>
            <div className="space-y-2">
              {dateTodos.map((todo, index) => (
                <TodoItem key={todo.id} todo={todo} index={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TodoItem = ({ todo, index }: { todo: Todo; index: number }) => (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 group",
            snapshot.isDragging && "shadow-lg rotate-1 scale-105",
            isOverdue(todo.dueDate) && "border-red-200 bg-red-50/30",
            todo.completed && "opacity-60"
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="flex items-center pt-0.5">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleComplete(todo.id)}
                className={cn(
                  "border-2 rounded-full w-5 h-5",
                  `border-${PRIORITY_DOTS[todo.priority].replace('bg-', '')}`
                )}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium text-gray-900 text-base",
                    todo.completed && "line-through text-gray-500"
                  )}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={cn(
                      "text-sm text-gray-600 mt-1",
                      todo.completed && "line-through"
                    )}>
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1">
                      <div className={cn("w-2 h-2 rounded-full", PRIORITY_DOTS[todo.priority])} />
                      <span className="text-xs text-gray-500">{todo.category}</span>
                    </div>
                    
                    {todo.dueDate && activeTab !== 'upcoming' && (
                      <span className={cn(
                        "text-xs flex items-center",
                        isOverdue(todo.dueDate) ? "text-red-600" : "text-gray-500"
                      )}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(todo.dueDate)}
                      </span>
                    )}
                    
                    {todo.completed && todo.completedDate && (
                      <span className="text-xs text-green-600 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {formatDate(todo.completedDate)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <EmailReminderForm
                    taskId={todo.id}
                    taskTitle={todo.title}
                    onReminderSet={(reminderData) => {
                      console.log('Reminder set for task:', todo.id, reminderData);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTodo(todo)}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  const getTodayProgress = () => {
    const today = startOfDay(new Date());
    const todayTodos = todos.filter(todo => 
      todo.dueDate && isSameDay(parseISO(todo.dueDate), today)
    );
    const completedToday = todayTodos.filter(todo => todo.completed).length;
    return todayTodos.length > 0 ? (completedToday / todayTodos.length) * 100 : 0;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && activeTab !== 'completed';
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'today': return 'Today';
      case 'inbox': return 'Inbox';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'profile': return 'Profile & Stats';
      default: return activeTab;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          todoCounts={getTodoCounts()} 
        />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search tasks..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 border-gray-200 focus:border-red-400 focus:ring-red-400"
                    />
                  </div>
                  
                  {/* Add Task Dialog */}
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Add task</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Input
                            placeholder="Task name"
                            value={newTodo.title}
                            onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                            className="text-base border-0 border-b border-gray-200 rounded-none px-0 focus:border-red-400 focus:ring-red-400"
                          />
                        </div>
                        <div>
                          <Textarea
                            placeholder="Description"
                            value={newTodo.description}
                            onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                            className="resize-none border-0 border-b border-gray-200 rounded-none px-0 focus:border-red-400 focus:ring-0"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label className="text-sm text-gray-600">Due date</Label>
                            <Input
                              type="date"
                              value={newTodo.dueDate}
                              onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Priority</Label>
                            <Select value={newTodo.priority} onValueChange={(value: any) => setNewTodo(prev => ({ ...prev, priority: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Project</Label>
                            <Select value={newTodo.category} onValueChange={(value) => setNewTodo(prev => ({ ...prev, category: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                          <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={createTodo} className="bg-red-500 hover:bg-red-600 text-white">
                            Add task
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            {activeTab === 'profile' ? (
              <ProfileSection todos={todos} />
            ) : (
              <>
                {/* Show search results info */}
                {searchQuery.trim() && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      {getFilteredTodos().length} task{getFilteredTodos().length !== 1 ? 's' : ''} found for "{searchQuery}"
                    </p>
                  </div>
                )}

                {/* Progress Section - Only show for today and no search */}
                {activeTab === 'today' && !searchQuery.trim() && (
                  <div className="mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
                        <span className="text-sm text-gray-500">{Math.round(getTodayProgress())}% complete</span>
                      </div>
                      <Progress value={getTodayProgress()} className="h-3 bg-gray-100" />
                      <p className="text-sm text-gray-500 mt-2">
                        {todos.filter(t => t.completed && t.dueDate && isSameDay(parseISO(t.dueDate), startOfDay(new Date()))).length} of {todos.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), startOfDay(new Date()))).length} tasks completed today
                      </p>
                    </div>
                  </div>
                )}

                {/* Todo List */}
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="todos">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {activeTab === 'upcoming' && !searchQuery.trim() ? (
                          renderUpcomingTodos()
                        ) : (
                          <div className="space-y-2">
                            {getFilteredTodos().map((todo, index) => (
                              <TodoItem key={todo.id} todo={todo} index={index} />
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                        
                        {getFilteredTodos().length === 0 && (
                          <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              {searchQuery.trim() ? (
                                <Search className="w-8 h-8 text-gray-400" />
                              ) : (
                                <Clock className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {searchQuery.trim() ? "No tasks found" : (
                                <>
                                  {activeTab === 'today' && "No tasks for today"}
                                  {activeTab === 'inbox' && "Your inbox is empty"}
                                  {activeTab === 'upcoming' && "No upcoming tasks"}
                                  {activeTab === 'completed' && "No completed tasks"}
                                  {CATEGORIES.includes(activeTab) && `No ${activeTab.toLowerCase()} tasks`}
                                </>
                              )}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {searchQuery.trim() ? (
                                `No tasks match "${searchQuery}" in title or description.`
                              ) : (
                                <>
                                  {activeTab === 'today' && "Enjoy your free time!"}
                                  {activeTab === 'inbox' && "Tasks without due dates will appear here."}
                                  {activeTab === 'upcoming' && "You're all caught up with your scheduled tasks."}
                                  {activeTab === 'completed' && "Completed tasks will appear here."}
                                  {CATEGORIES.includes(activeTab) && `${activeTab} tasks will appear here.`}
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}

            {/* Edit Todo Dialog */}
            {editingTodo && (
              <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Edit task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Input
                        placeholder="Task name"
                        value={editingTodo.title}
                        onChange={(e) => setEditingTodo(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="text-base border-0 border-b border-gray-200 rounded-none px-0 focus:border-red-400 focus:ring-0"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Description"
                        value={editingTodo.description}
                        onChange={(e) => setEditingTodo(prev => prev ? { ...prev, description: e.target.value } : null)}
                        className="resize-none border-0 border-b border-gray-200 rounded-none px-0 focus:border-red-400 focus:ring-0"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm text-gray-600">Due date</Label>
                        <Input
                          type="date"
                          value={editingTodo.dueDate}
                          onChange={(e) => setEditingTodo(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Priority</Label>
                        <Select value={editingTodo.priority} onValueChange={(value: any) => setEditingTodo(prev => prev ? { ...prev, priority: value } : null)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Project</Label>
                        <Select value={editingTodo.category} onValueChange={(value) => setEditingTodo(prev => prev ? { ...prev, category: value } : null)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="ghost" onClick={() => setEditingTodo(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => editingTodo && updateTodo(editingTodo)} className="bg-red-500 hover:bg-red-600 text-white">
                        Save task
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
