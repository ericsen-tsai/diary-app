/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-underscore-dangle */

'use client'

import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { type ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'
import { format } from 'date-fns'
import { useMutation } from 'convex/react'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import { type Doc } from '../../../../../convex/_generated/dataModel'
import { api } from '../../../../../convex/_generated/api'

export type Diary = Doc<'diaries'>
export type DiaryWithTitle = Diary & { title: string }

export const ACCESSOR_KEY_TO_TITLE_MAP = {
  title: 'Title',
  _creationTime: 'Creation Time',
  updatedTime: 'Updated Time',
} as const

export const columns: ColumnDef<DiaryWithTitle>[] = [
  {
    accessorKey: 'title',
    header: ACCESSOR_KEY_TO_TITLE_MAP.title,
    enableHiding: false,
  },
  {
    accessorKey: '_creationTime',
    header: ACCESSOR_KEY_TO_TITLE_MAP._creationTime,
    cell: ({ row }) => (
      <div className="font-medium">
        {format(row.getValue('_creationTime'), 'yyyy-MM-dd HH:mm:ss')}
      </div>
    ),
  },
  {
    accessorKey: 'updatedTime',
    header: ACCESSOR_KEY_TO_TITLE_MAP.updatedTime,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue('updatedTime')
          ? format(row.getValue('updatedTime'), 'yyyy-MM-dd HH:mm:ss')
          : 'you have not updated before'}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const diary = row.original
      const deleteDiary = useMutation(api.diaries.deleteDiary)
      const router = useRouter()

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/diary/${diary._id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                this diary
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  void deleteDiary({ id: diary._id }).then(() => {
                    router.refresh()
                  })
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
