"use client";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Chapter, Course, MuxData } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import MuxPlayer from "@mux/mux-player-react";
import * as z from "zod";

interface Props {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}
const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "O video é obrigatório",
  }),
});

const ChapterVideoForm: NextPage<Props> = ({ initialData, courseId, chapterId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("O video foi atualizado com sucesso");
      setIsEditing((prev) => !prev);
      router.refresh();
    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar a imagem");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video do capítulo
        <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
          {isEditing && <>Cancelar</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="mr-2 w-4 h-4" />
              Adicionar video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex mt-2 items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} src={initialData.videoUrl}></MuxPlayer>
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">Carregue o video do capítulo</div>
        </div>
      )}
      {
        initialData.videoUrl && !isEditing && (
          <div className="text-xs text-muted-foreground mt-2">
            Videos podem demorar alguns minutos para serem processados. Recarregue a página se o vídeo não aparecer.
          </div>
        )
      }
    </div>
  );
};

export default ChapterVideoForm;
