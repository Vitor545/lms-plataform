import IconBadge from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as React from 'react';
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';

export interface IChapterIdPageProps {
    params: {
        courseId: string;
        chapterId: string;
    }
}

export default async function ChapterIdPage({ params: { courseId, chapterId } }: IChapterIdPageProps) {
    const { userId } = auth();
    if (!userId) return redirect('/');

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId,
        },
        include: {
            muxData: true,
        }
    })

    if (!chapter) return redirect('/');

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completedText = `${completedFields}/${totalFields}`


    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='w-full'>
                    <Link href={`/teacher/courses/${courseId}`} className='flex items-center text-sm hover:opacity-75 transition mb-6'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Voltar a configuração do curso
                    </Link>
                    <div className='flex items-center justify-between w-full'>
                        <div className='flex flex-col gap-y-2'>
                            <h1 className='text-2xl font-medium'>Criação de capítulo</h1>
                            <span className='text-sm text-slate-700'>
                                Complete todos os campos obrigatórios {completedText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div className='space-y-4'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className='text-xl'>Customize seu capítulo</h2>
                        </div>
                        <ChapterTitleForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                        <ChapterDescriptionForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
