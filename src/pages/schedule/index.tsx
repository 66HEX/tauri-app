import { useState, useMemo } from 'react';
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

type Appointment = {
  id: number;
  clientName: string;
  date: string;
  time: string;
  duration: string;
  type: 'consultation' | 'training' | 'assessment' | 'check-in';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  location: string;
};

const initialAppointments: Appointment[] = [
  { id: 1, clientName: 'Anna Smith', date: '2025-03-17', time: '09:00', duration: '60 min', type: 'training', status: 'scheduled', location: 'Gym A' },
  { id: 2, clientName: 'John Miller', date: '2025-03-17', time: '11:00', duration: '30 min', type: 'check-in', status: 'scheduled', location: 'Online' },
  { id: 3, clientName: 'Sarah Johnson', date: '2025-03-16', time: '14:30', duration: '45 min', type: 'consultation', status: 'completed', location: 'Office' },
  { id: 4, clientName: 'Robert Davis', date: '2025-03-18', time: '16:00', duration: '60 min', type: 'assessment', status: 'scheduled', location: 'Gym B' },
  { id: 5, clientName: 'Emma Wilson', date: '2025-03-15', time: '10:00', duration: '60 min', type: 'training', status: 'cancelled', location: 'Gym A' },
  { id: 6, clientName: 'Michael Brown', date: '2025-03-16', time: '13:00', duration: '60 min', type: 'training', status: 'no-show', location: 'Gym A' }
];

const ActionsCell = ({ row }: { row: any }) => {
  const appointment = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => alert(`Edit functionality would go here for ${appointment.clientName}'s appointment`)}>Edit</DropdownMenuItem>
        {appointment.status === 'scheduled' && (
          <>
            <DropdownMenuItem onClick={() => alert(`Reschedule functionality would go here for ${appointment.clientName}'s appointment`)}>Reschedule</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Mark as Completed would go here for ${appointment.clientName}'s appointment`)}>Mark as Completed</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => alert(`Cancel functionality would go here for ${appointment.clientName}'s appointment`)}>Cancel</DropdownMenuItem>
          </>
        )}
        {appointment.status === 'scheduled' && (
          <DropdownMenuItem className="text-amber-600" onClick={() => alert(`No-show functionality would go here for ${appointment.clientName}'s appointment`)}>Mark as No-show</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => alert(`Add Notes functionality would go here for ${appointment.clientName}'s appointment`)}>Add Notes</DropdownMenuItem>
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
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
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

  const columns = useMemo<ColumnDef<Appointment>[]>(
    () => [
      { accessorKey: 'clientName', header: 'Client' },
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
    []
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
    getCoreRowModel: getCoreRowModel()
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}