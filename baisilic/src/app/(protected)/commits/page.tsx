"use client";

import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { ExternalLink, Sparkles, ArrowLeftToLine, ArrowRightToLine, Ellipsis, PinOff } from "lucide-react";
import Link from 'next/link';
import { CSSProperties, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import useProject from "~/hooks/use-project";
import { api } from '~/trpc/react';


type Commit = {
    commitAuthorAvatar: string;
    sha: string;
    commitAuthorName: string;
    commitMessage: string;
    summary: string;
    date: string;
};

const getPinningStyles = (column: Column<Commit>): CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
        left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
        right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
        position: isPinned ? "sticky" : "relative",
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    };
};

export default function CommitTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const { projectId, project } = useProject();
    const { data: commits } = api.project.getCommits.useQuery({ projectId });

    const columns: ColumnDef<Commit>[] = [
        {
            header: "Collaborateur",
            accessorKey: "commitAuthorAvatar",
            cell: ({ row }) => (
                <div className="max-w-md">
                    <img
                        src={row.original.commitAuthorAvatar} // Correction ici
                        alt="commit avatar"
                        className="relative mt-4 size-6 flex-none rounded-full bg-gray-500"
                    />
                </div>
            ),
        },
        {
            header: "Author",
            accessorKey: "commitAuthorName" as keyof Commit,
            cell: ({ row }) => (
                <div className="truncate font-medium">
                    {row.getValue("commitAuthorName")}
                </div>
            ),
        },
        {
            header: "Message",
            accessorKey: "commitMessage" as keyof Commit,
            cell: ({ row }) => (
                <div className="max-w-md truncate">
                    {row.getValue("commitMessage")}
                </div>
            ),
        },
        {
            header: "Summary",
            accessorKey: "summary" as keyof Commit,
            size: 500,
            cell: ({ row }) => (
                <div className="max-w-md">
                    <pre className="whitespace-pre-wrap text-xs text-neutral-500">
                        {row.getValue("summary")}
                    </pre>
                </div>
            ),
        },
        {
            header: "Lien",
            id: "actions",
            size: 150,
            cell: ({ row }) => {
                const commitLink = project?.githubUrl
                    ?.replace('.git', '')
                    ?.split('/')
                    ?.slice(-2)
                    ?.join('/');

                return (
                    <div className="flex items-center gap-2">

                        {commitLink && (
                            <Link
                                href={`https://github.com/${commitLink}/commit/${row.original.sha}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm hover:text-foreground"
                            >
                                <ExternalLink size={14} />
                                GitHub
                            </Link>
                        )}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: commits || [],
        columns,
        columnResizeMode: "onChange",
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        enableSortingRemoval: false,
    });

    return (
        <div className="bg-background w-full">
            <Table
                className="table-fixed border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none"
                style={{
                    width: table.getTotalSize(),
                }}
            >
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted/50">
                            {headerGroup.headers.map((header) => {
                                const { column } = header;
                                const isPinned = column.getIsPinned();
                                const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                                const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right");

                                return (
                                    <TableHead
                                        key={header.id}
                                        className="relative h-10 truncate border-t [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-muted/90 [&[data-pinned]]:backdrop-blur-sm"
                                        colSpan={header.colSpan}
                                        style={{ ...getPinningStyles(column) }}
                                        data-pinned={isPinned || undefined}
                                        data-last-col={
                                            isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                                        }
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="truncate">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </span>
                                            {!header.isPlaceholder &&
                                                header.column.getCanPin() &&
                                                (header.column.getIsPinned() ? (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="-mr-1 size-7 shadow-none"
                                                        onClick={() => header.column.pin(false)}
                                                        aria-label={`Unpin ${header.column.columnDef.header as string} column`}
                                                        title={`Unpin ${header.column.columnDef.header as string} column`}
                                                    >
                                                        <PinOff
                                                            className="opacity-60"
                                                            size={16}
                                                            strokeWidth={2}
                                                            aria-hidden="true"
                                                        />
                                                    </Button>
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="-mr-1 size-7 shadow-none"
                                                                aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
                                                                title={`Pin options for ${header.column.columnDef.header as string} column`}
                                                            >
                                                                <Ellipsis
                                                                    className="opacity-60"
                                                                    size={16}
                                                                    strokeWidth={2}
                                                                    aria-hidden="true"
                                                                />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => header.column.pin("left")}>
                                                                <ArrowLeftToLine
                                                                    size={16}
                                                                    strokeWidth={2}
                                                                    className="opacity-60"
                                                                    aria-hidden="true"
                                                                />
                                                                Stick to left
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => header.column.pin("right")}>
                                                                <ArrowRightToLine
                                                                    size={16}
                                                                    strokeWidth={2}
                                                                    className="opacity-60"
                                                                    aria-hidden="true"
                                                                />
                                                                Stick to right
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ))}
                                            {header.column.getCanResize() && (
                                                <div
                                                    onDoubleClick={() => header.column.resetSize()}
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    className="absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px"
                                                />
                                            )}
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => {
                                    const { column } = cell;
                                    const isPinned = column.getIsPinned();
                                    const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                                    const isFirstRightPinned =
                                        isPinned === "right" && column.getIsFirstColumn("right");

                                    return (
                                        <TableCell
                                            key={cell.id}
                                            className="truncate [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-background/90 [&[data-pinned]]:backdrop-blur-sm"
                                            style={{ ...getPinningStyles(column) }}
                                            data-pinned={isPinned || undefined}
                                            data-last-col={
                                                isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                                            }
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No commits found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <p className="mt-4 text-sm text-muted-foreground">
                Pinnable commit history made with{" "}
                <a
                    className="underline hover:text-foreground"
                    href="https://tanstack.com/table"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    TanStack Table
                </a>
            </p>
        </div>
    );
}