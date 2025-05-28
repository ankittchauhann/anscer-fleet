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
import { useNavigate, useSearch } from "@tanstack/react-router";
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
import type { Robot, RobotQueryParams } from "@/services/robots";

interface DataTableProps {
    columns: ColumnDef<Robot>[];
    data: Robot[];
    isLoading?: boolean;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onParamsChange?: (params: RobotQueryParams) => void;
}

export function DataTable({
    columns,
    data,
    isLoading = false,
    pagination,
    onParamsChange,
}: DataTableProps) {
    const navigate = useNavigate();
    const search = useSearch({ from: "/configure/" });

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Update URL params when filters or sorting change
    const updateUrlParams = React.useCallback(
        (newParams: Partial<RobotQueryParams>) => {
            console.log(
                "🚀 DataTable: updateUrlParams called with:",
                newParams
            );
            console.log("🚀 DataTable: current search params:", search);

            const updatedParams = {
                ...search,
                ...newParams,
                // Only reset to page 1 when filters change, not when page itself changes
                page:
                    newParams.page !== undefined
                        ? newParams.page
                        : // Reset to page 1 if we're changing filters but not page
                          newParams.status !== undefined ||
                            newParams.type !== undefined ||
                            newParams.connectivity !== undefined ||
                            newParams.search !== undefined ||
                            newParams.location !== undefined ||
                            newParams.minCharge !== undefined ||
                            newParams.maxCharge !== undefined ||
                            newParams.sortBy !== undefined ||
                            newParams.limit !== undefined
                          ? 1
                          : search.page || 1,
            };

            // Remove undefined values
            for (const [key, value] of Object.entries(updatedParams)) {
                if (value === undefined) {
                    delete updatedParams[key as keyof typeof updatedParams];
                }
            }

            console.log(
                "🚀 DataTable: about to navigate with params:",
                updatedParams
            );
            console.log("🚀 DataTable: comparison - current search:", search);
            console.log(
                "🚀 DataTable: parameters changed?",
                JSON.stringify(search) !== JSON.stringify(updatedParams)
            );

            try {
                navigate({
                    to: "/configure",
                    search: updatedParams,
                    replace: false, // Add explicit replace option
                });
                console.log(
                    "✅ DataTable: navigate() call completed successfully"
                );
            } catch (error) {
                console.error("❌ DataTable: navigate() failed:", error);
            }

            onParamsChange?.(updatedParams);
        },
        [navigate, search, onParamsChange]
    );

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
                updateUrlParams({
                    sortBy: sort.id,
                    sortOrder: sort.desc ? "desc" : "asc",
                });
            } else {
                updateUrlParams({
                    sortBy: undefined,
                    sortOrder: undefined,
                });
            }
        },
        [updateUrlParams, sorting]
    );

    // Handle pagination
    const handlePageChange = React.useCallback(
        (newPage: number) => {
            console.log(
                "🚀 DataTable: handlePageChange CALLED with page:",
                newPage
            );
            console.log("🚀 DataTable: about to call updateUrlParams...");
            updateUrlParams({ page: newPage });
        },
        [updateUrlParams]
    );

    // Handle rows per page change
    const handleLimitChange = React.useCallback(
        (newLimit: number) => {
            console.log(
                "🚀 DataTable: handleLimitChange CALLED with limit:",
                newLimit
            );
            console.log("🚀 DataTable: about to call updateUrlParams...");
            updateUrlParams({
                limit: newLimit,
                page: 1, // Reset to first page when changing page size
            });
        },
        [updateUrlParams]
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
        <div className="w-full h-full flex flex-col">
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
                                            key={`loading-skeleton-${index}-${Date.now()}`}
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
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
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
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Pagination Section - Fixed at bottom */}
            <div className="flex items-center justify-between py-4 px-6 border-t bg-white">
                <div className="flex-1 text-sm text-muted-foreground">
                    {pagination ? (
                        <>
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
                        </>
                    ) : (
                        `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`
                    )}
                </div>

                {/* Rows per page and pagination controls */}
                <div className="flex items-center space-x-6">
                    {pagination && (
                        <>
                            {/* Rows per page dropdown */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                    Rows per page
                                </span>
                                <Select
                                    value={pagination.limit.toString()}
                                    onValueChange={(value) => {
                                        console.log(
                                            "🔥 Select onValueChange FIRED with:",
                                            value
                                        );
                                        console.log(
                                            "🔥 Calling handleLimitChange with:",
                                            Number(value)
                                        );
                                        handleLimitChange(Number(value));
                                    }}
                                >
                                    <SelectTrigger className="w-16 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Page navigation */}
                            <div className="flex items-center space-x-2">
                                {/* First page */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                        console.log(
                                            "🔥 First page button CLICKED!"
                                        );
                                        handlePageChange(1);
                                    }}
                                    disabled={
                                        pagination.page === 1 || isLoading
                                    }
                                    title="Go to first page"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>

                                {/* Previous page */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                        console.log(
                                            "🔥 Previous page button CLICKED!"
                                        );
                                        handlePageChange(pagination.page - 1);
                                    }}
                                    disabled={
                                        pagination.page === 1 || isLoading
                                    }
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
                                    onClick={() => {
                                        console.log(
                                            "🔥 Next page button CLICKED!"
                                        );
                                        handlePageChange(pagination.page + 1);
                                    }}
                                    disabled={
                                        pagination.page ===
                                            pagination.totalPages || isLoading
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
                                    onClick={() => {
                                        console.log(
                                            "🔥 Last page button CLICKED!"
                                        );
                                        handlePageChange(pagination.totalPages);
                                    }}
                                    disabled={
                                        pagination.page ===
                                            pagination.totalPages || isLoading
                                    }
                                    title="Go to last page"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
