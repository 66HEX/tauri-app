import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UserPlus, MoreVertical, SlidersHorizontal, Activity, CalendarClock } from 'lucide-react';
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

type PlanAssignment = {
  id: number;
  clientName: string;
  planName: string;
  planCategory: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
};

const initialAssignments: PlanAssignment[] = [
  { id: 1, planName: 'Full Body Strength', planCategory: 'Strength', clientName: 'Anna Smith', startDate: '2025-02-15', endDate: '2025-04-12', status: 'active' },
  { id: 2, planName: 'Marathon Training', planCategory: 'Cardio', clientName: 'John Miller', startDate: '2025-01-10', endDate: '2025-04-05', status: 'active' },
  { id: 3, planName: 'Flexibility Routine', planCategory: 'Mobility', clientName: 'Sarah Johnson', startDate: '2025-02-01', endDate: '2025-03-01', status: 'completed' },
  { id: 4, planName: 'HIIT Circuit', planCategory: 'Conditioning', clientName: 'Robert Davis', startDate: '2025-02-10', endDate: '2025-03-24', status: 'paused' },
  { id: 5, planName: 'Full Body Strength', planCategory: 'Strength', clientName: 'Emma Wilson', startDate: '2025-01-20', endDate: '2025-03-17', status: 'cancelled' },
  { id: 6, planName: 'Marathon Training', planCategory: 'Cardio', clientName: 'Michael Brown', startDate: '2025-03-01', endDate: '2025-05-24', status: 'active' }
];

const ActionsCell = ({ row }: { row: any }) => {
  const assignment = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => alert(`Edit functionality would go here for ${assignment.clientName}'s ${assignment.planName}`)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert(`View Progress functionality would go here for ${assignment.clientName}'s ${assignment.planName}`)}>View Progress</DropdownMenuItem>
        {assignment.status === 'active' && (
          <DropdownMenuItem onClick={() => alert(`Pause functionality would go here for ${assignment.clientName}'s ${assignment.planName}`)}>Pause</DropdownMenuItem>
        )}
        {assignment.status === 'paused' && (
          <DropdownMenuItem onClick={() => alert(`Resume functionality would go here for ${assignment.clientName}'s ${assignment.planName}`)}>Resume</DropdownMenuItem>
        )}
        {(assignment.status === 'active' || assignment.status === 'paused') && (
          <DropdownMenuItem className="text-red-600" onClick={() => alert(`Cancel functionality would go here for ${assignment.clientName}'s ${assignment.planName}`)}>Cancel</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusCell = ({ value }: { value: string }) => {
  const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  
  if (value === 'completed') badgeVariant = 'default';
  if (value === 'active') badgeVariant = 'secondary';
  if (value === 'paused') badgeVariant = 'outline';
  if (value === 'cancelled') badgeVariant = 'destructive';
  
  return (
    <Badge variant={badgeVariant}>
      {displayValue}
    </Badge>
  );
};



export function PlansPage() {
  const [assignments, setAssignments] = useState<PlanAssignment[]>(initialAssignments);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, boolean>>({
    active: true,
    completed: true,
    paused: true,
    cancelled: true
  });
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [statusSearchInput, setStatusSearchInput] = useState<string>('');

  const columns = useMemo<ColumnDef<PlanAssignment>[]>(
    () => [
      { accessorKey: 'clientName', header: 'Client' },
      { accessorKey: 'planName', header: 'Plan Name' },
      { accessorKey: 'planCategory', header: 'Category' },
      { 
        accessorKey: 'startDate', 
        header: 'Start Date',
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return date.toLocaleDateString();
        }
      },
      { 
        accessorKey: 'endDate', 
        header: 'End Date',
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return date.toLocaleDateString();
        }
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
    const statuses = [...new Set(assignments.map(assignment => assignment.status))];
    return statuses;
  }, [assignments]);

  // Filter displayed statuses based on search input
  const filteredStatusOptions = useMemo(() => {
    if (!statusSearchInput) return statusOptions;
    return statusOptions.filter(status => 
      status.toLowerCase().includes(statusSearchInput.toLowerCase())
    );
  }, [statusOptions, statusSearchInput]);

  // Filter data based on both name and selected statuses
  const filteredData = useMemo(() => {
    // If no statuses are selected, show no results
    const hasSelectedStatuses = Object.values(selectedStatuses).some(value => value);
    
    return assignments.filter(assignment => {
      const nameMatch = !nameFilter || 
        assignment.planName.toLowerCase().includes(nameFilter.toLowerCase()) ||
        assignment.clientName.toLowerCase().includes(nameFilter.toLowerCase()) ||
        assignment.planCategory.toLowerCase().includes(nameFilter.toLowerCase());
      
      // Only show assignments with statuses that are checked
      const statusMatch = hasSelectedStatuses ? selectedStatuses[assignment.status] : false;
      
      return nameMatch && statusMatch;
    });
  }, [assignments, nameFilter, selectedStatuses]);

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
              <CardTitle>Training Plans</CardTitle>
              <CardDescription>Manage and view all your training plans in one place.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => alert('Progress Report functionality would go here')}>
                <CalendarClock className="h-4 w-4 mr-2" />
                Progress Reports
              </Button>
              <Button onClick={() => alert('New Assignment functionality would go here')}>
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Input
                placeholder="Filter by plan or client name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-64 h-8"
              />
              
              {/* Status Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Activity className="h-4 w-4 mr-1" />
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
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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