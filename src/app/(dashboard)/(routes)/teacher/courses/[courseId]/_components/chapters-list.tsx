'use client';

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grid, Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface IChaptersListProps {
    items: Chapter[]
    onReorder: (updateData: { id: string, position: number }[]) => void
    onEdit: (id: string) => void
}

export default function ChaptersList({ items, onReorder, onEdit }: IChaptersListProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [chapters, setChapters] = useState<Chapter[]>(items)

    useEffect(() => {
        setChapters(items)
    }, [items])

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(chapters)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)
        const updateChapters = items.slice(startIndex, endIndex + 1)
        const bulkUpdate = updateChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex(item => item.id === chapter.id)
        }))
        onReorder(bulkUpdate)
        setChapters(items)
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => (
                            <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                {(provided) => (
                                    <div className={cn(`flex items-center gap-x-2 
                                    bg-slate-200 border-slate-200 border 
                                    text-slate-700 rounded-md mb-4 text-sm`, chapter.isPublished && 'bg-sky-100 border-sky-200 text-sky-700')} ref={provided.innerRef} {...provided.draggableProps}>
                                        <div className={cn("px-2 py-3 border-r-slate-200 hover:bg-slate-300 rounded-l-md transition", chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200')} {...provided.dragHandleProps}>
                                            <Grip className="w-5 h-5" />
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {
                                                chapter.isFree && (
                                                    <Badge>Gratuito</Badge>
                                                )
                                            }
                                            <Badge className={cn('bg-slate-500', chapter.isPublished && 'bg-sky-700 hover:bg-sky-700/80')}>
                                                {chapter.isPublished ? 'Publicado' : 'Rascunho'}
                                            </Badge>
                                            <Pencil onClick={() => onEdit(chapter.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
