import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params: { courseId, chapterId } }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });
        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

        const publishedChaptersInCourse = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: false
            }
        })


        const publishedChaptersInCourses = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourses.length) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(publishedChaptersInCourse);
    } catch (error) {
        console.log("[CHAPTER-PUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
