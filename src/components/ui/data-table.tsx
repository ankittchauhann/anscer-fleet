"use client";

import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    type Updater,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Generic pagination interface
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Generic sort parameters
export interface SortParams {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

// Generic query parameters that can be extended
export interface BaseQueryParams extends SortParams {
    page?: number;
    limit?: number;
}

interface DataTableProps<
    TData,
    TQueryParams extends BaseQueryParams = BaseQueryParams,
> {
    columns: ColumnDef<TData>[];
    data: TData[];
    isLoading?: boolean;
    pagination?: PaginationInfo;
    onParamsChange?: (params: TQueryParams) => void;
    onSortingChange?: (sortBy?: string, sortOrder?: "asc" | "desc") => void;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    // Optional customization props
    showPagination?: boolean;
    showRowsPerPage?: boolean;
    rowsPerPageOptions?: number[];
    emptyMessage?: string;
    className?: string;
    // Optional row styling
    getRowClassName?: (row: TData, index: number) => string;
}

export function DataTable<
    TData,
    TQueryParams extends BaseQueryParams = BaseQueryParams,
>({
    columns,
    data,
    isLoading = false,
    pagination,
    onParamsChange,
    onSortingChange,
    onPageChange,
    onLimitChange,
    showPagination = true,
    showRowsPerPage = true,
    rowsPerPageOptions = [5, 10, 15, 20, 50],
    emptyMessage = "No results found.",
    className = "",
    getRowClassName,
}: DataTableProps<TData, TQueryParams>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Handle sorting changes
    const handleSortingChange = React.useCallback(
        (updaterOrValue: Updater<SortingState>) => {
            let newSorting: SortingState;
            if (typeof updaterOrValue === "function") {
                newSorting = updaterOrValue(sorting);
            } else {
                newSorting = updaterOrValue;
            }

            setSorting(newSorting);

            if (newSorting.length > 0) {
                const sort = newSorting[0];
                onSortingChange?.(sort.id, sort.desc ? "desc" : "asc");

                // If onParamsChange is provided, update params
                if (onParamsChange) {
                    onParamsChange({
                        sortBy: sort.id,
                        sortOrder: sort.desc ? "desc" : "asc",
                    } as TQueryParams);
                }
            } else {
                onSortingChange?.(undefined, undefined);

                // If onParamsChange is provided, clear sort params
                if (onParamsChange) {
                    onParamsChange({
                        sortBy: undefined,
                        sortOrder: undefined,
                    } as TQueryParams);
                }
            }
        },
        [onSortingChange, onParamsChange, sorting]
    );

    // Handle pagination
    const handlePageChange = React.useCallback(
        (newPage: number) => {
            onPageChange?.(newPage);

            // If onParamsChange is provided, update page
            if (onParamsChange) {
                onParamsChange({ page: newPage } as TQueryParams);
            }
        },
        [onPageChange, onParamsChange]
    );

    // Handle rows per page change
    const handleLimitChange = React.useCallback(
        (newLimit: number) => {
            onLimitChange?.(newLimit);

            // If onParamsChange is provided, update limit and reset page
            if (onParamsChange) {
                onParamsChange({
                    limit: newLimit,
                    page: 1, // Reset to first page when changing page size
                } as TQueryParams);
            }
        },
        [onLimitChange, onParamsChange]
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: handleSortingChange,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualSorting: true, // Use backend sorting
        manualPagination: true, // Use backend pagination
        pageCount: pagination?.totalPages || 0,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className={`w-full h-full flex flex-col ${className}`}>
            {/* Table Section - Scrollable */}
            <div className="flex-1 overflow-hidden">
                <div className="rounded-md border h-full overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10 border-b">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }, (_, index) => (
                                        <TableRow
                                            key={`loading-skeleton-row-${index}-${Date.now()}`}
                                        >
                                            {columns.map((_, colIndex) => (
                                                <TableCell
                                                    key={`loading-skeleton-cell-${index}-${colIndex}-${Date.now()}`}
                                                >
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : table.getRowModel().rows?.length ? (
                                    table
                                        .getRowModel()
                                        .rows.map((row, index) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={
                                                    row.getIsSelected() &&
                                                    "selected"
                                                }
                                                className={getRowClassName?.(
                                                    row.original,
                                                    index
                                                )}
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            {emptyMessage}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Pagination Section - Fixed at bottom */}
            {showPagination && pagination && (
                <div className="flex items-center justify-between py-4 px-6 border-t bg-white">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            (pagination.page - 1) * pagination.limit + 1,
                            pagination.total
                        )}{" "}
                        to{" "}
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                        )}{" "}
                        of {pagination.total} results
                    </div>

                    {/* Rows per page and pagination controls */}
                    <div className="flex items-center space-x-6">
                        {/* Rows per page dropdown */}
                        {showRowsPerPage && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                    Rows per page
                                </span>
                                <Select
                                    value={pagination.limit.toString()}
                                    onValueChange={(value) => {
                                        handleLimitChange(Number(value));
                                    }}
                                >
                                    <SelectTrigger className="w-16 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rowsPerPageOptions.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option.toString()}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Page navigation */}
                        <div className="flex items-center space-x-2">
                            {/* First page */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.page === 1 || isLoading}
                                title="Go to first page"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>

                            {/* Previous page */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    handlePageChange(pagination.page - 1)
                                }
                                disabled={pagination.page === 1 || isLoading}
                                title="Go to previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {/* Page indicator */}
                            <span className="text-sm text-muted-foreground px-2">
                                Page {pagination.page} of{" "}
                                {pagination.totalPages}
                            </span>

                            {/* Next page */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    handlePageChange(pagination.page + 1)
                                }
                                disabled={
                                    pagination.page === pagination.totalPages ||
                                    isLoading
                                }
                                title="Go to next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            {/* Last page */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    handlePageChange(pagination.totalPages)
                                }
                                disabled={
                                    pagination.page === pagination.totalPages ||
                                    isLoading
                                }
                                title="Go to last page"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
