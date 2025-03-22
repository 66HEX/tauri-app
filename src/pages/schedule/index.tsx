import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, MoreVertical, SlidersHorizontal, Clock, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { apiRequest, getCurrentUser, getClientAppointments, getTrainerAppointments } from '@/lib/api';
import { Appointment, ApiAppointment, mapApiAppointmentToAppointment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Appointment type is now imported from types.ts

const ActionsCell = ({ row }: { row: any }) => {
  const appointment = row.original;
  const { toast } = useToast();
  
  // Function to update appointment status
  const updateAppointmentStatus = async (status: string) => {
    try {
      await apiRequest(`/api/appointments/${appointment.id}`, 'PUT', { status });
      
      // Show success toast
      toast({
        title: 'Success',
        description: `Appointment ${status === 'completed' ? 'marked as completed' : status === 'cancelled' ? 'cancelled' : 'marked as no-show'}.`,
      });
      
      // Refresh appointments (this would trigger the useEffect)
      window.location.reload();
    } catch (error) {
      console.error(`Failed to update appointment status:`, error);
      toast({
        title: 'Error',
        description: 'Failed to update appointment status. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {
          toast({
            title: 'Info',
            description: 'Edit functionality is not implemented yet.'
          });
        }}>Edit</DropdownMenuItem>
        {appointment.status === 'scheduled' && (
          <>
            <DropdownMenuItem onClick={() => {
              toast({
                title: 'Info',
                description: 'Reschedule functionality is not implemented yet.'
              });
            }}>Reschedule</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateAppointmentStatus('completed')}>Mark as Completed</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => updateAppointmentStatus('cancelled')}>Cancel</DropdownMenuItem>
          </>
        )}
        {appointment.status === 'scheduled' && (
          <DropdownMenuItem className="text-amber-600" onClick={() => updateAppointmentStatus('no-show')}>Mark as No-show</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => {
          toast({
            title: 'Info',
            description: 'Add Notes functionality is not implemented yet.'
          });
        }}>Add Notes</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusCell = ({ value }: { value: string }) => {
  const displayValue = value === 'no-show' ? 'No-show' : value.charAt(0).toUpperCase() + value.slice(1);
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  
  if (value === 'scheduled') badgeVariant = 'secondary';
  if (value === 'completed') badgeVariant = 'default';
  if (value === 'cancelled') badgeVariant = 'destructive';
  if (value === 'no-show') badgeVariant = 'outline';
  
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
      {displayValue}
    </Badge>
  );
};

export function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Get current user and fetch appointments based on role
        const user = getCurrentUser();
        let response;
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        if (user.role === 'client') {
          response = await getClientAppointments();
        } else if (user.role === 'trainer') {
          response = await getTrainerAppointments();
        } else if (user.role === 'admin') {
          // Admins can see all appointments
          response = await apiRequest('/api/appointments');
        } else {
          throw new Error('Unknown user role');
        }
        
        // Map API appointments to UI appointments
        const mappedAppointments = response.map((appointment: ApiAppointment) => 
          mapApiAppointmentToAppointment(appointment)
        );
        
        setAppointments(mappedAppointments);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load appointments. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [toast]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, boolean>>({
    scheduled: true,
    completed: true,
    cancelled: true,
    'no-show': true
  });
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
    training: true,
    consultation: true,
    assessment: true,
    'check-in': true
  });
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [statusSearchInput, setStatusSearchInput] = useState<string>('');
  const [typeSearchInput, setTypeSearchInput] = useState<string>('');

  // Get current user to determine which columns to show
  const currentUser = useMemo(() => getCurrentUser(), []);
  
  // Initialize column visibility based on user role
  useEffect(() => {
    if (currentUser) {
      setColumnVisibility({
        clientName: currentUser.role !== 'client',
        trainerName: currentUser.role !== 'trainer'
      });
    }
  }, [currentUser]);
  
  const columns = useMemo<ColumnDef<Appointment>[]>(
    () => [
      { 
        accessorKey: 'clientName', 
        header: 'Client',
        // Hide Client column for clients, show for trainers and admins
        enableHiding: true
      },
      { 
        accessorKey: 'trainerName', 
        header: 'Trainer',
        // Hide Trainer column for trainers, show for clients and admins
        enableHiding: true
      },
      { accessorKey: 'date', header: 'Date', 
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return date.toLocaleDateString();
        }
      },
      { accessorKey: 'time', header: 'Time' },
      { accessorKey: 'duration', header: 'Duration' },
      { accessorKey: 'location', header: 'Location' },
      { 
        accessorKey: 'type', 
        header: 'Type',
        cell: ({ row }) => <TypeCell value={row.getValue('type')} />
      },
      { 
        accessorKey: 'status', 
        header: 'Status',
        cell: ({ row }) => <StatusCell value={row.getValue('status')} />
      },
      {
        id: 'actions',
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell row={row} />
      }
    ],
    [currentUser?.role]
  );

  // Get unique status values for the dropdown
  const statusOptions = useMemo(() => {
    const statuses = [...new Set(appointments.map(appointment => appointment.status))];
    return statuses;
  }, [appointments]);

  // Get unique type values for the dropdown
  const typeOptions = useMemo(() => {
    const types = [...new Set(appointments.map(appointment => appointment.type))];
    return types;
  }, [appointments]);

  // Filter displayed statuses based on search input
  const filteredStatusOptions = useMemo(() => {
    if (!statusSearchInput) return statusOptions;
    return statusOptions.filter(status => 
      status.toLowerCase().includes(statusSearchInput.toLowerCase())
    );
  }, [statusOptions, statusSearchInput]);

  // Filter displayed types based on search input
  const filteredTypeOptions = useMemo(() => {
    if (!typeSearchInput) return typeOptions;
    return typeOptions.filter(type => 
      type.toLowerCase().includes(typeSearchInput.toLowerCase())
    );
  }, [typeOptions, typeSearchInput]);

  // Filter data based on name, selected statuses and types
  const filteredData = useMemo(() => {
    // If no statuses or types are selected, show no results
    const hasSelectedStatuses = Object.values(selectedStatuses).some(value => value);
    const hasSelectedTypes = Object.values(selectedTypes).some(value => value);
    
    return appointments.filter(appointment => {
      const nameMatch = !nameFilter || 
        appointment.clientName.toLowerCase().includes(nameFilter.toLowerCase()) ||
        appointment.location.toLowerCase().includes(nameFilter.toLowerCase());
      
      // Only show appointments with statuses and types that are checked
      const statusMatch = hasSelectedStatuses ? selectedStatuses[appointment.status] : false;
      const typeMatch = hasSelectedTypes ? selectedTypes[appointment.type] : false;
      
      return nameMatch && statusMatch && typeMatch;
    });
  }, [appointments, nameFilter, selectedStatuses, selectedTypes]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        clientName: currentUser?.role !== 'client',
        trainerName: currentUser?.role !== 'trainer'
      }
    }
  });

  return (
    <div className="overflow-auto">
      <Card>
        <CardHeader>
          <div className='flex flex-row justify-between'>
            <div className="flex flex-col gap-2">
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Manage all your appointments and sessions in one place.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => alert('Calendar View functionality would go here')}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
              <Button onClick={() => alert('Add Appointment functionality would go here')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Input
                placeholder="Filter by client or location..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-64 h-8"
              />
              
              {/* Status Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Clock className="h-4 w-4 mr-1" />
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <div className="p-2">
                    <Input
                      placeholder="Search status..."
                      value={statusSearchInput}
                      onChange={(e) => setStatusSearchInput(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  {filteredStatusOptions.map((status) => (
                    <DropdownMenuCheckboxItem 
                      key={status} 
                      checked={!!selectedStatuses[status]}
                      onCheckedChange={(checked) => {
                        setSelectedStatuses(prev => ({
                          ...prev,
                          [status]: checked
                        }));
                      }}
                    >
                      {status === 'no-show' ? 'No-show' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Type Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Filter className="h-4 w-4 mr-1" />
                    Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <div className="p-2">
                    <Input
                      placeholder="Search type..."
                      value={typeSearchInput}
                      onChange={(e) => setTypeSearchInput(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  {filteredTypeOptions.map((type) => (
                    <DropdownMenuCheckboxItem 
                      key={type} 
                      checked={!!selectedTypes[type]}
                      onCheckedChange={(checked) => {
                        setSelectedTypes(prev => ({
                          ...prev,
                          [type]: checked
                        }));
                      }}
                    >
                      {type === 'check-in' ? 'Check-in' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* View Columns Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" className="ml-2">
                    <SlidersHorizontal className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      // Use the header text if available, otherwise use the column ID
                      const headerText = typeof column.columnDef.header === 'string' 
                        ? column.columnDef.header 
                        : column.id;
                        
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {headerText}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <p>Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-24 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}