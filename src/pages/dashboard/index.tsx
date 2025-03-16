import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  MoreVertical, 
  Plus, 
  SlidersHorizontal, 
  Activity,
  TrendingUp,
  Users,
  CalendarClock,
  Clock,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [metricFilter, setMetricFilter] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Weekly Sessions Data
  const sessionData = useMemo(() => {
    if (timeRange === 'week') {
      return [
        { name: 'Mon', sessions: 12, clients: 8, completion: 92 },
        { name: 'Tue', sessions: 15, clients: 10, completion: 87 },
        { name: 'Wed', sessions: 10, clients: 7, completion: 90 },
        { name: 'Thu', sessions: 14, clients: 9, completion: 95 },
        { name: 'Fri', sessions: 16, clients: 11, completion: 88 },
        { name: 'Sat', sessions: 8, clients: 6, completion: 100 },
        { name: 'Sun', sessions: 5, clients: 4, completion: 100 }
      ];
    } else if (timeRange === 'month') {
      return [
        { name: 'Week 1', sessions: 45, clients: 22, completion: 90 },
        { name: 'Week 2', sessions: 50, clients: 25, completion: 88 },
        { name: 'Week 3', sessions: 47, clients: 24, completion: 92 },
        { name: 'Week 4', sessions: 55, clients: 28, completion: 91 }
      ];
    } else {
      return [
        { name: 'Jan', sessions: 180, clients: 30, completion: 87 },
        { name: 'Feb', sessions: 190, clients: 32, completion: 89 },
        { name: 'Mar', sessions: 210, clients: 35, completion: 91 },
        { name: 'Apr', sessions: 195, clients: 33, completion: 90 },
        { name: 'May', sessions: 220, clients: 36, completion: 88 },
        { name: 'Jun', sessions: 205, clients: 34, completion: 92 },
        { name: 'Jul', sessions: 230, clients: 38, completion: 91 },
        { name: 'Aug', sessions: 215, clients: 36, completion: 89 },
        { name: 'Sep', sessions: 240, clients: 40, completion: 93 },
        { name: 'Oct', sessions: 230, clients: 38, completion: 90 },
        { name: 'Nov', sessions: 245, clients: 42, completion: 92 },
        { name: 'Dec', sessions: 210, clients: 36, completion: 88 }
      ];
    }
  }, [timeRange]);

  // Client plan distribution data
  const planDistributionData = [
    { name: 'Strength', value: 45, color: '#3b82f6' },
    { name: 'Cardio', value: 25, color: '#10b981' },
    { name: 'Mobility', value: 15, color: '#f59e0b' },
    { name: 'Conditioning', value: 15, color: '#6366f1' }
  ];

  // Client growth data
  const clientGrowthData = useMemo(() => {
    if (timeRange === 'week') {
      return [
        { name: 'Mon', active: 32, new: 1 },
        { name: 'Tue', active: 33, new: 1 },
        { name: 'Wed', active: 33, new: 0 },
        { name: 'Thu', active: 34, new: 1 },
        { name: 'Fri', active: 35, new: 1 },
        { name: 'Sat', active: 35, new: 0 },
        { name: 'Sun', active: 35, new: 0 }
      ];
    } else if (timeRange === 'month') {
      return [
        { name: 'Week 1', active: 30, new: 3 },
        { name: 'Week 2', active: 33, new: 3 },
        { name: 'Week 3', active: 35, new: 2 },
        { name: 'Week 4', active: 38, new: 3 }
      ];
    } else {
      return [
        { name: 'Jan', active: 25, new: 5 },
        { name: 'Feb', active: 30, new: 5 },
        { name: 'Mar', active: 35, new: 5 },
        { name: 'Apr', active: 38, new: 3 },
        { name: 'May', active: 41, new: 3 },
        { name: 'Jun', active: 43, new: 2 },
        { name: 'Jul', active: 45, new: 2 },
        { name: 'Aug', active: 44, new: 0 },
        { name: 'Sep', active: 46, new: 2 },
        { name: 'Oct', active: 50, new: 4 },
        { name: 'Nov', active: 52, new: 2 },
        { name: 'Dec', active: 55, new: 3 }
      ];
    }
  }, [timeRange]);

  // Recent clients data
  const recentClientsData = [
    { id: 1, name: 'Anna Smith', planName: 'Full Body Strength', planCategory: 'Strength', progress: '75%', lastActivity: '2 hours ago', status: 'active' },
    { id: 2, name: 'John Miller', planName: 'Marathon Training', planCategory: 'Cardio', progress: '82%', lastActivity: '5 hours ago', status: 'active' },
    { id: 3, name: 'Sarah Johnson', planName: 'Flexibility Routine', planCategory: 'Mobility', progress: '45%', lastActivity: '1 day ago', status: 'paused' },
    { id: 4, name: 'Robert Davis', planName: 'HIIT Circuit', planCategory: 'Conditioning', progress: '60%', lastActivity: '3 hours ago', status: 'active' },
    { id: 5, name: 'Emma Wilson', planName: 'Full Body Strength', planCategory: 'Strength', progress: '30%', lastActivity: '2 days ago', status: 'inactive' }
  ];

  // Upcoming sessions data
  const upcomingSessionsData = [
    { id: 1, clientName: 'Anna Smith', date: '2025-03-17', time: '09:00', duration: '60 min', type: 'training', status: 'scheduled', location: 'Gym A' },
    { id: 2, clientName: 'John Miller', date: '2025-03-17', time: '11:00', duration: '30 min', type: 'check-in', status: 'scheduled', location: 'Online' },
    { id: 3, clientName: 'Robert Davis', date: '2025-03-18', time: '16:00', duration: '60 min', type: 'assessment', status: 'scheduled', location: 'Gym B' },
    { id: 4, clientName: 'Michael Brown', date: '2025-03-19', time: '13:00', duration: '60 min', type: 'training', status: 'scheduled', location: 'Gym A' }
  ];

  // Status cell component for consistency with other tables
  const StatusCell = ({ value }: { value: string }) => {
    const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
    
    if (value === 'paused') badgeVariant = 'outline';
    if (value === 'inactive') badgeVariant = 'secondary';
    
    return (
      <Badge variant={badgeVariant}>
        {displayValue}
      </Badge>
    );
  };

  const TypeCell = ({ value }: { value: string }) => {
    const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    
    if (value === 'training') badgeVariant = 'default';
    if (value === 'consultation') badgeVariant = 'secondary';
    if (value === 'assessment') badgeVariant = 'outline';
    if (value === 'check-in') badgeVariant = 'outline';
    
    return (
      <Badge variant={badgeVariant}>
        {displayValue === 'Check-in' ? 'Check-in' : displayValue}
      </Badge>
    );
  };

  return (
    <div className="overflow-auto">
      {/* Page Header with Title and Time Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your training business and client activity
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className={timeRange === 'week' ? 'bg-muted' : ''} 
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={timeRange === 'month' ? 'bg-muted' : ''} 
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={timeRange === 'year' ? 'bg-muted' : ''} 
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {/* First Row: Quick Stats + Today's Schedule */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Quick Stats Summary - Left Column */}
          <div className="md:col-span-2 space-y-4">
            {/* Key Metrics Cards - 2x2 Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex flex-col space-y-1">
                    <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  </div>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientGrowthData[clientGrowthData.length - 1].active}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{clientGrowthData.reduce((sum, item) => sum + item.new, 0)} new this {timeRange}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex flex-col space-y-1">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  </div>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sessionData.reduce((sum, item) => sum + item.sessions, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(sessionData.reduce((sum, item) => sum + item.completion, 0) / sessionData.length)}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex flex-col space-y-1">
                    <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  </div>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingSessionsData.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next: Today at {upcomingSessionsData[0].time}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Client Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
                <CardDescription>Active and new client acquisition</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={clientGrowthData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                    <XAxis tick={{ fill: '#666', fontSize: 12 }} dataKey="name" />
                    <YAxis tick={{ fill: '#666', fontSize: 12 }}  />
                    <Tooltip 
                      cursor={false} 
                      contentStyle={{ 
                        background: 'oklch(0.205 0 0)', 
                        borderColor: 'oklch(1 0 0 / 10%)' ,
                        borderRadius: '6px',
                        fontSize: '14px'
                      }} 
                    />
                    <Legend
                      iconType="circle"
                      iconSize={5}  
                      layout="horizontal"
                      align="center"
                      wrapperStyle={{
                        fontSize: "14px",
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="active" 
                      name="Active Clients" 
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorActive)"
                      strokeWidth={2}
                      stackId="1"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="new" 
                      name="New Clients" 
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorNew)"
                      strokeWidth={2}
                      stackId="2"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Today's Schedule - Right Column */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Today's Schedule</CardTitle>
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="sr-only">View calendar</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessionsData.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                    <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2 text-center min-w-14">
                      <span className="text-xs font-medium">{session.time}</span>
                      <span className="text-xs text-muted-foreground">{session.duration}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{session.clientName}</div>
                      <div className="flex items-center mt-1">
                        <TypeCell value={session.type} />
                        <span className="text-xs text-muted-foreground ml-2">{session.location}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Appointments
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Third Row: Recent Client Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Client Activity</CardTitle>
                <CardDescription>Client progress and last activity</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                View All Clients
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClientsData.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.planName}</TableCell>
                    <TableCell>{client.progress}</TableCell>
                    <TableCell>{client.lastActivity}</TableCell>
                    <TableCell><StatusCell value={client.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}