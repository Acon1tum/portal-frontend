'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { 
  Bell, UserPlus, MessageSquare, AlertTriangle, Check, MoreVertical, 
  ChevronRight, Clock, ExternalLink, Search, Building2, CheckCheck
} from 'lucide-react';

export default function NotificationsPage() {
  // Notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'connection',
      title: 'New Connection Request',
      content: 'Tech Solutions Inc. sent you a connection request.',
      time: '2 hours ago',
      isRead: false,
      image: '/placeholder.png',
      link: '/owner/connections/requests',
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      content: 'Sarah Johnson sent you a message about your recent proposal.',
      time: '4 hours ago',
      isRead: false,
      image: '/avatar-sarah.png',
      link: '/owner/messages/5',
    },
    {
      id: 3,
      type: 'security',
      title: 'Security Alert',
      content: 'New login detected from San Francisco, CA. Was this you?',
      time: 'Yesterday',
      isRead: false,
      link: '/owner/notifications/activity',
    },
    {
      id: 4,
      type: 'system',
      title: 'System Maintenance',
      content: 'The platform will be undergoing maintenance this weekend.',
      time: '2 days ago',
      isRead: true,
    },
    {
      id: 5,
      type: 'message',
      title: 'Message Read',
      content: 'Michael Chen read your message sent on April 10.',
      time: '3 days ago',
      isRead: true,
      image: '/avatar-michael.png',
      link: '/owner/messages/3',
    },
    {
      id: 6,
      type: 'connection',
      title: 'Connection Accepted',
      content: 'Global Manufacturing Co. accepted your connection request.',
      time: '1 week ago',
      isRead: true,
      image: '/company-logo.png',
      link: '/owner/connections/2',
    },
  ]);

  // Mark notification as read
  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Delete notification
  const deleteNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Filter notifications
  const unreadNotifications = notifications.filter(notification => !notification.isRead);
  const allNotifications = notifications;

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'security':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Link href="/owner/notifications/settings">
            <Button variant="outline">
              Settings
            </Button>
          </Link>
          <Button onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread">
            Unread
            {unreadNotifications.length > 0 && (
              <span className="ml-2 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Your latest unread notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-4">
                {unreadNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Check className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You have no unread notifications at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unreadNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className="flex items-start p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="mr-3 mt-1">
                          {notification.image ? (
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={notification.image} alt="" />
                              <AvatarFallback>
                                {getNotificationIcon(notification.type)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            getNotificationIcon(notification.type)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{notification.title}</div>
                          <p className="text-sm text-muted-foreground">
                            {notification.content}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                        <div className="flex items-center ml-2">
                          {notification.link && (
                            <Link href={notification.link}>
                              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => markAsRead(notification.id)}>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <Check className="mr-2 h-4 w-4" />
                                Mark as read
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Your notification history</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-4">
                {allNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You don't have any notifications yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`flex items-start p-3 border rounded-lg hover:bg-slate-50 transition-colors ${notification.isRead ? 'bg-slate-50/50' : ''}`}
                      >
                        <div className="mr-3 mt-1">
                          {notification.image ? (
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={notification.image} alt="" />
                              <AvatarFallback>
                                {getNotificationIcon(notification.type)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            getNotificationIcon(notification.type)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium flex items-center">
                            {notification.title}
                            {!notification.isRead && (
                              <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.content}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                        <div className="flex items-center ml-2">
                          {notification.link && (
                            <Link href={notification.link}>
                              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => markAsRead(notification.id)}>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead ? (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Mark as read
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => setNotifications(prev => 
                                  prev.map(item => 
                                    item.id === notification.id ? { ...item, isRead: false } : item
                                  )
                                )}>
                                  <Bell className="mr-2 h-4 w-4" />
                                  Mark as unread
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}