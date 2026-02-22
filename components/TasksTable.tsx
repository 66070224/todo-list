"use client";

import { TaskCategory, TaskStatus } from "@/app/generated/prisma/enums";
import { useId, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { z } from "zod";
import {
  ColumnFiltersState,
  SortingState,
  useReactTable,
  VisibilityState,
  getCoreRowModel,
  type ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
  Row,
} from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  IconCircleCheckFilled,
  IconLoader,
  IconPlus,
} from "@tabler/icons-react";
import {
  closestCenter,
  DndContext,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircle, AlertCircleIcon, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

const dateSchema = z.preprocess((val) => {
  if (typeof val === "string" || val instanceof Date) {
    return new Date(val);
  }
  return val;
}, z.date());

const assignUserSchema = z
  .object({
    name: z.string().nullable(),
  })
  .nullable();

export const schema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(TaskStatus),
  category: z.enum(TaskCategory),
  assignUserId: z.string().nullable(),
  assignUser: assignUserSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

function TableCellViewer({
  item,
  onUpdate,
}: {
  item: z.infer<typeof schema>;
  onUpdate: (task: z.infer<typeof schema>) => void;
}) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [category, setCategory] = useState(item.category);
  const [assignUserId, setAssignUserId] = useState<string | undefined>(
    item.assignUser?.name || undefined,
  );
  const [error, setError] = useState("");

  async function submitHandle() {
    setError("");
    if (!category) return;
    const origin = process.env.URL || "http://localhost:3000";
    const URI = new URL(`/api/tasks/${item.id}`, origin);
    const response = await fetch(URI, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        category,
        description,
        assignUserId,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      onUpdate(data.task);
      setOpen(false);
    } else {
      setError(data.message);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground px-1.5 text-left">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Add Task</DrawerTitle>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  defaultValue={item.category}
                  onValueChange={(value) => setCategory(value as TaskCategory)}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskCategory.PERSONAL}>
                      Personal
                    </SelectItem>
                    <SelectItem value={TaskCategory.FAMILY}>Family</SelectItem>
                    <SelectItem value={TaskCategory.WORK}>Work</SelectItem>
                    <SelectItem value={TaskCategory.STUDY}>Study</SelectItem>
                    <SelectItem value={TaskCategory.HEALTH}>Health</SelectItem>
                    <SelectItem value={TaskCategory.FINANCE}>
                      Finance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="assign">Assign</Label>
                <Select>
                  <SelectTrigger id="assignUserId" className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button onClick={submitHandle}>Save</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddTaskViewer({
  onAdd,
}: {
  onAdd: (task: z.infer<typeof schema>) => void;
}) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory | null>(null);
  const [assignUserId, setAssignUserId] = useState<string | undefined>(
    undefined,
  );

  const [error, setError] = useState("");

  async function submitHandle() {
    setError("");
    if (!title.trim()) return setError("Please fill title field");
    if (!category) return setError("Please select category");
    const origin = process.env.URL || "http://localhost:3000";
    const URI = new URL("/api/tasks", origin);
    const response = await fetch(URI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        category,
        description,
        assignUserId,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      onAdd(data.task);
      setOpen(false);
      setTitle("");
      setDescription("");
      setCategory(null);
      setAssignUserId(undefined);
    } else {
      setError(data.message);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Task</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Add Task</DrawerTitle>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setCategory(value as TaskCategory)}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskCategory.PERSONAL}>
                      Personal
                    </SelectItem>
                    <SelectItem value={TaskCategory.FAMILY}>Family</SelectItem>
                    <SelectItem value={TaskCategory.WORK}>Work</SelectItem>
                    <SelectItem value={TaskCategory.STUDY}>Study</SelectItem>
                    <SelectItem value={TaskCategory.HEALTH}>Health</SelectItem>
                    <SelectItem value={TaskCategory.FINANCE}>
                      Finance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="assign">Assign</Label>
                <Select>
                  <SelectTrigger id="assignUserId" className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button onClick={submitHandle}>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function TaskRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { setNodeRef } = useSortable({
    id: row.original.id,
  });
  return (
    <TableRow ref={setNodeRef} className="relative z-0">
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function TasksTable({
  data: initialData,
  userId,
}: {
  data: z.infer<typeof schema>[];
  userId: string;
}) {
  const [tasks, setTasks] = useState(() => initialData);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = useId();

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => tasks?.map(({ id }) => id) || [],
    [tasks],
  );

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.status === TaskStatus.COMPLETED && (
              <>
                <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                Completed
              </>
            )}
            {row.original.status === TaskStatus.PROGRESS && (
              <>
                <IconCircleCheckFilled className="fill-yellow-500 dark:fill-yellow-400" />
                In Progress
              </>
            )}
            {row.original.status === TaskStatus.PENDING && (
              <>
                <IconLoader />
                Pending
              </>
            )}
            {row.original.status === TaskStatus.BREAK && (
              <>
                <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
                Break
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        return (
          <TableCellViewer
            item={row.original}
            onUpdate={(updateTask) => {
              setTasks((previous) =>
                previous.map((task) =>
                  task.id === updateTask.id ? updateTask : task,
                ),
              );
            }}
          />
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="text-muted-foreground px-1.5">
            {row.original.category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return format(date, "dd/MM/yyyy HH:mm");
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Updated At
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return format(date, "dd/MM/yyyy HH:mm");
      },
    },
    {
      accessorKey: "assignUser",
      header: "Assign To",
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.assignUser?.name}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  return (
    <Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="all">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="self">My Tasks</SelectItem>
            <SelectItem value="other">Assigned</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="self">My Tasks</TabsTrigger>
          <TabsTrigger value="other">Assigned</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Label htmlFor="title">Search</Label>
          <Input
            id="title"
            placeholder="Title"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
          />
        </div>
        <AddTaskViewer
          onAdd={(task) => setTasks((previous) => [...previous, task])}
        />
      </div>
      <TabsContent
        value="all"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <TaskRow row={row} key={row.original.id} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </TabsContent>

      <TabsContent
        value="self"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => {
                      if (row.original.userId === userId)
                        return <TaskRow row={row} key={row.original.id} />;
                    })}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </TabsContent>

      <TabsContent
        value="other"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => {
                      if (row.original.userId !== userId)
                        return <TaskRow row={row} key={row.original.id} />;
                    })}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </TabsContent>
    </Tabs>
  );
}
