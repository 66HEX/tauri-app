import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UserPlus, MoreVertical, SlidersHorizontal, Activity } from 'lucide-react';
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

type Client = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
};

const initialClients: Client[] = [
  { id: 1, fullName: 'Anna Smith', email: 'anna.smith@example.com', phone: '123-456-7890', status: 'active' },
  { id: 2, fullName: 'John Miller', email: 'john.miller@example.com', phone: '987-654-3210', status: 'active' },
  { id: 3, fullName: 'Mary Johnson', email: 'mary.johnson@example.com', phone: '555-555-5555', status: 'inactive' }
];

const ActionsCell = ({ row }: { row: any }) => {
  const client = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => alert(`Edit functionality would go here for ${client.fullName}`)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => alert(`Delete functionality would go here for ${client.fullName}`)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusCell = ({ value }: { value: string }) => {
  const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
  return (
    <Badge variant={value === 'active' ? 'default' : 'secondary'}>
      {displayValue}
    </Badge>
  );
};

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, boolean>>({
    active: true,
    inactive: true
  });
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [statusSearchInput, setStatusSearchInput] = useState<string>('');

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [

      { accessorKey: 'fullName', header: 'Full Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone', header: 'Phone' },
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
    const statuses = [...new Set(clients.map(client => client.status))];
    return statuses;
  }, [clients]);

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
    
    return clients.filter(client => {
      const nameMatch = !nameFilter || 
        client.fullName.toLowerCase().includes(nameFilter.toLowerCase());
      
      // Only show clients with statuses that are checked
      const statusMatch = hasSelectedStatuses ? selectedStatuses[client.status] : false;
      
      return nameMatch && statusMatch;
    });
  }, [clients, nameFilter, selectedStatuses]);

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
              <CardTitle>Client List</CardTitle>
              <CardDescription>Manage and view all your clients in one place.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => alert('Invite functionality would go here')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Client
              </Button>
              <Button onClick={() => alert('Add functionality would go here')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Input
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-48 h-8"
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
                      className="mb-2 h-8"
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