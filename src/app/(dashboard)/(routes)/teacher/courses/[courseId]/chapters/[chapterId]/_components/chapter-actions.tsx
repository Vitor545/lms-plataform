'use client'

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export interface IChapterActionsProps {
    disabled?: boolean
    courseId: string
    chapterId: string
    isPublished: boolean
}

export default function ChapterActions({ disabled, courseId, chapterId, isPublished }: IChapterActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success("Capítulo deletado com sucesso")
            router.refresh()
            router.push(`/teacher/courses/${courseId}`)
        } catch {
            toast.error("Ocorreu um erro ao deletar o capítulo")
        } finally {
            setIsLoading(false)
        }
    }

    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Capítulo despublicado com sucesso")
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success("Capítulo publicado com sucesso")
            }
            router.refresh()
        } catch {
            toast.error("Ocorreu um erro ao publicar/despublicar o capítulo")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} disabled={disabled || isLoading} variant="outline" size="sm">
                {isPublished ? 'Despublicar' : 'Publicar'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size='sm' disabled={isLoading}><Trash className="h-4 w-4" /></Button>
            </ConfirmModal>
        </div>
    );
}
