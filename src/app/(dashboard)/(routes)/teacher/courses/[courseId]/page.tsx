import IconBadge from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";

interface Props {
  params: { courseId: string };
}

const CourseIdPage: NextPage<Props> = async ({ params }) => {
  const { userId } = auth();
  if(!userId) redirect('/')
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        }
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    }
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Configuração do curso</h1>
          <span className="text-sm text-slate-700">
            Preencha todos os campos obrigatórios {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize seu curso</h2>
          </div>
          <TitleForm courseId={course.id} initialData={course} />
          <DescriptionForm courseId={course.id} initialData={course} />
          <ImageForm courseId={course.id} initialData={course} />
          <CategoryForm courseId={course.id} initialData={course} options={categories.map(el => ({ value: el.id, label: el.name }))} />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Capítulos do curso</h2>
            </div>
            <div>
              <ChaptersForm courseId={course.id} initialData={course} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Venda seu curso</h2>
            </div>
            <PriceForm courseId={course.id} initialData={course} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Recursos e anexos</h2>
            </div>
            <AttachmentForm courseId={course.id} initialData={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
