'use client'

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export interface IActionsProps {
    disabled?: boolean
    courseId: string
    isPublished: boolean
}

export default function Actions({ disabled, courseId, isPublished }: IActionsProps) {
    const confetti = useConfettiStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            toast.success("Curso deletado com sucesso")
            router.refresh()
            router.push(`/teacher/courses`)
        } catch {
            toast.error("Ocorreu um erro ao deletar o curso")
        } finally {
            setIsLoading(false)
        }
    }

    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Curso despublicado com sucesso")
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success("Curso publicado com sucesso")
                confetti.onOpen()
            }
            router.refresh()
        } catch {
            toast.error("Ocorreu um erro ao publicar/despublicar o curso")
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
