import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PaperclipIcon, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Image, 
  Filter,
  MessageSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: {
    id: number;
    name: string;
    type: 'image' | 'document' | 'plan';
    url: string;
  }[];
  isRead: boolean;
};

type Conversation = {
  id: number;
  clientId: number;
  clientName: string;
  clientAvatar?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isOnline: boolean;
  status: 'active' | 'inactive';
};

const currentUserId = 999; // Trainer's ID (just for demo)

const initialConversations: Conversation[] = [
  { 
    id: 1, 
    clientId: 101, 
    clientName: 'Anna Smith', 
    clientAvatar: '/api/placeholder/32/32', 
    lastMessage: 'Thanks for the updated workout plan!', 
    lastMessageTimestamp: '2025-03-16T10:35:00', 
    unreadCount: 2,
    isOnline: true,
    status: 'active'
  },
  { 
    id: 2, 
    clientId: 102, 
    clientName: 'John Miller', 
    clientAvatar: '/api/placeholder/32/32', 
    lastMessage: 'I completed my workout for today', 
    lastMessageTimestamp: '2025-03-15T18:22:00', 
    unreadCount: 0,
    isOnline: false,
    status: 'active'
  },
  { 
    id: 3, 
    clientId: 103, 
    clientName: 'Sarah Johnson', 
    clientAvatar: '/api/placeholder/32/32', 
    lastMessage: "Can we reschedule tomorrow's session?", 
    lastMessageTimestamp: '2025-03-16T09:15:00', 
    unreadCount: 3,
    isOnline: true,
    status: 'active'
  },
  { 
    id: 4, 
    clientId: 104, 
    clientName: 'Robert Davis', 
    lastMessage: "I'll send you my progress photos later", 
    lastMessageTimestamp: '2025-03-14T21:05:00', 
    unreadCount: 0,
    isOnline: false,
    status: 'active'
  },
  { 
    id: 5, 
    clientId: 105, 
    clientName: 'Emma Wilson', 
    clientAvatar: '/api/placeholder/32/32',
    lastMessage: 'I have a question about my diet plan', 
    lastMessageTimestamp: '2025-03-15T11:45:00', 
    unreadCount: 0,
    isOnline: true,
    status: 'inactive'
  },
];

const initialMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderId: 101,
      senderName: 'Anna Smith',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Hi Coach! How are you today?',
      timestamp: '2025-03-16T10:20:00',
      isRead: true
    },
    {
      id: 2,
      senderId: currentUserId,
      senderName: 'Coach',
      content: "Hey Anna! I'm doing great. I've just updated your workout plan for next week.",
      timestamp: '2025-03-16T10:25:00',
      attachments: [
        {
          id: 1,
          name: 'Strength Training Plan - Week 12',
          type: 'plan',
          url: '#'
        }
      ],
      isRead: true
    },
    {
      id: 3,
      senderId: 101,
      senderName: 'Anna Smith',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Thanks for the updated workout plan!',
      timestamp: '2025-03-16T10:35:00',
      isRead: false
    },
    {
      id: 4,
      senderId: 101,
      senderName: 'Anna Smith',
      senderAvatar: '/api/placeholder/32/32',
      content: "I've also been meaning to ask - should I add more protein to my diet?",
      timestamp: '2025-03-16T10:36:00',
      isRead: false
    }
  ],
  3: [
    {
      id: 1,
      senderId: 103,
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Hi Coach, I might need to reschedule our session tomorrow.',
      timestamp: '2025-03-16T09:00:00',
      isRead: true
    },
    {
      id: 2,
      senderId: 103,
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Something urgent came up at work.',
      timestamp: '2025-03-16T09:01:00',
      isRead: true
    },
    {
      id: 3,
      senderId: currentUserId,
      senderName: 'Coach',
      content: 'No problem! When would work better for you?',
      timestamp: '2025-03-16T09:10:00',
      isRead: true
    },
    {
      id: 4,
      senderId: 103,
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: "Can we reschedule tomorrow's session?",
      timestamp: '2025-03-16T09:15:00',
      isRead: false
    },
    {
      id: 5,
      senderId: 103,
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Would Thursday at the same time work?',
      timestamp: '2025-03-16T09:16:00',
      isRead: false
    },
    {
      id: 6,
      senderId: 103,
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Or I could do Friday morning?',
      timestamp: '2025-03-16T09:17:00',
      isRead: false
    }
  ]
};

const StatusCell = ({ value }: { value: string }) => {
  const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  
  if (value === 'inactive') badgeVariant = 'outline';
  
  return (
    <Badge variant={badgeVariant}>
      {displayValue}
    </Badge>
  );
};

const UnreadCell = ({ value }: { value: number }) => {
  if (value === 0) return <span>-</span>;
  
  return (
    <Badge variant="secondary">
      {value}
    </Badge>
  );
};

export function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(1);
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Format timestamp to display time only if today, or date for older messages
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter conversations based on name only
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const nameMatch = !nameFilter || 
        conv.clientName.toLowerCase().includes(nameFilter.toLowerCase());
      
      return nameMatch;
    });
  }, [conversations, nameFilter]);

  const selectedConversation = selectedConversationId 
    ? conversations.find(c => c.id === selectedConversationId) 
    : null;
    
  const conversationMessages = selectedConversationId 
    ? messages[selectedConversationId] || [] 
    : [];



  // Scroll to bottom of messages when messages change or conversation changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages]);

  // Mark messages as read when conversation becomes active
  useEffect(() => {
    if (selectedConversationId) {
      // Mark messages as read
      const updatedMessages = { ...messages };
      if (updatedMessages[selectedConversationId]) {
        updatedMessages[selectedConversationId] = updatedMessages[selectedConversationId].map(msg => ({
          ...msg,
          isRead: true
        }));
        setMessages(updatedMessages);
      }
      
      // Update unread count in conversation list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversationId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    }
  }, [selectedConversationId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    
    const newMsg: Message = {
      id: Date.now(),
      senderId: currentUserId,
      senderName: 'Coach',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    // Add message to the conversation
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMsg]
    }));
    
    // Update last message in conversations list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversationId 
          ? { 
              ...conv, 
              lastMessage: newMessage.trim(),
              lastMessageTimestamp: new Date().toISOString()
            } 
          : conv
      )
    );
    
    setNewMessage('');
  };

  return (
    <div>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <div className='flex flex-row justify-between'>
            <div className="flex flex-col gap-2">
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with your clients and manage conversations.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => alert('View Archived functionality would go here')}>
                <Filter className="h-4 w-4 mr-2" />
                View Archived
              </Button>
              <Button onClick={() => alert('New Message functionality would go here')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="flex h-full border-t">
            {/* Left panel - conversation list */}
            <div className="w-1/3">
              <div className="h-full flex flex-col">
                <div className="sticky top-0 z-10 border-b p-3 flex justify-between items-center">
                  <Input
                    placeholder="Filter by client name..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="w-full h-8"
                  />
                </div>
                <ScrollArea className="flex-1 min-h-96 max-h-96">
                  <table className="w-full">
                    <tbody>
                      {filteredConversations.map((conversation) => (
                        <tr 
                          key={conversation.id}
                          className={`border-b hover:bg-muted/50 cursor-pointer ${selectedConversationId === conversation.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedConversationId(conversation.id)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={conversation.clientAvatar} />
                                  <AvatarFallback>{conversation.clientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {conversation.isOnline && (
                                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{conversation.clientName}</div>
                                <div className="text-xs text-muted-foreground truncate w-64">
                                  {conversation.lastMessage}
                                </div>
                              </div>
                            </div>
                          </td>

                        </tr>
                      ))}
                      {filteredConversations.length === 0 && (
                        <tr>
                          <td className="p-4 text-center text-muted-foreground">
                            No conversations match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>
            
            {/* Right panel - selected conversation */}
            <div className="w-2/3 flex flex-col border">
              {selectedConversation ? (
                <>
                  {/* Chat header */}
                  <div className="p-3 border-b flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedConversation.clientAvatar} />
                        <AvatarFallback>{selectedConversation.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-medium">{selectedConversation.clientName}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={`h-2 w-2 rounded-full ${selectedConversation.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span>{selectedConversation.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => alert('Call functionality would go here')}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => alert('Video call functionality would go here')}>
                        <Video className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert('View Client Profile would go here')}>
                            View Client Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert('View Assignments would go here')}>
                            View Assignments
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert('Schedule Session would go here')}>
                            Schedule Session
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert('Clear Conversation would go here')}>
                            Clear Conversation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Messages area */}
                  <ScrollArea className="flex-1 p-4 min-h-96 max-h-96">
                    <div className="space-y-4">
                      {conversationMessages.map((message) => {
                        const isCurrentUser = message.senderId === currentUserId;
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex gap-3 max-w-[80%]">
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={message.senderAvatar} />
                                  <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}
                              <div>
                                <div 
                                  className={`p-3 rounded-lg ${
                                    isCurrentUser 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p>{message.content}</p>
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                      {message.attachments.map(attachment => (
                                        <div 
                                          key={attachment.id}
                                          className={`flex items-center gap-2 p-2 rounded ${
                                            isCurrentUser ? 'bg-primary-foreground/10' : 'bg-background'
                                          }`}
                                        >
                                          {attachment.type === 'image' ? (
                                            <Image className="h-4 w-4" />
                                          ) : (
                                            <PaperclipIcon className="h-4 w-4" />
                                          )}
                                          <span className="text-sm truncate">{attachment.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                                  {formatMessageTime(message.timestamp)}
                                  {isCurrentUser && message.isRead && (
                                    <span>• Read</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Message input */}
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => alert('Attach file functionality would go here')}>
                        <PaperclipIcon className="h-4 w-4" />
                      </Button>
                      <Input 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="h-9"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button size="sm" onClick={handleSendMessage}>
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/20">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground max-w-md text-sm">
                    Choose a client from the list to view your conversation history
                    and send messages.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}