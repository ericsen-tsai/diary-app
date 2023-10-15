'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { type DiaryWithTitle, columns } from './columns'
import DataTableViewOptions from './DataTableViewOptions'
import DataTablePagination from './DataTablePagination'

type Props = {
  data: DiaryWithTitle[]
}

function DiaryDataTable({
  data,
}: Props) {
  const createDiary = useMutation(api.diaries.createDiary)
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleCreateDiary = async () => {
    setLoading(true)
    const newDiaryId = await createDiary()
    setLoading(false)
    router.push(`/diary/${newDiaryId}`)
  }
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
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
      </div>
      <Button
        onClick={() => {
          void handleCreateDiary()
        }}
        className="my-3"
        disabled={loading}
      >
        <PlusCircle />
      </Button>
      <DataTablePagination table={table} />
    </div>
  )
}

export default DiaryDataTable
