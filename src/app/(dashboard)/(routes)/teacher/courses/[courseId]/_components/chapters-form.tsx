"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface Props {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}
const formSchema = z.object({
  title: z.string().min(1, {
    message: "O tiulo é obrigatório",
  }),
});

const ChaptersForm: NextPage<Props> = ({ initialData, courseId }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const router = useRouter();
  const { isSubmitting, isValid } = form.formState;
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Capítulo criado com sucesso");
      toggleCreating()
      router.refresh();
    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar a descrição");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Capítulos do curso
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating && <>Cancelar</>}
          {!isCreating && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar capítulo
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introdução ao Next.js'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Criar
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn('text-sm mt-2', !initialData.chapters.length && 'text-slate-500 italic')}>
          {!initialData.chapters.length && 'Nenhum capítulo criado ainda.'}
        </div>
      )}
      {!isCreating && (
        <p className="text-sm mt-4 text-muted-foreground">
          Use o drag and drop para reordenar os capítulos
        </p>
      )}
    </div>
  );
};

export default ChaptersForm;
