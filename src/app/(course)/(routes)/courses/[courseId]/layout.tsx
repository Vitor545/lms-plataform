import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import * as React from 'react';

export interface ICourseLayoutProps {
    children: React.ReactNode
    params: { courseId: string }
}

export default async function CourseLayout({ children, params: { courseId } }: ICourseLayoutProps) {
    const { userId } = auth();

    if (!userId) redirect('/')

    const course = await db.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgresses: {
                        where: {
                            userId
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },

        }
    })

    if (!course) redirect('/')

    const progressCount = await getProgress(userId, courseId)

    return (
        <div className="h-full">
            <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>

            </div>
            <main className='md:pl-80 h-full'>
                {children}
            </main>
        </div>
    );
}
