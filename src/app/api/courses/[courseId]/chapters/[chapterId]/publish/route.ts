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

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId,
            },
        })

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId,
            }
        })

        if(!chapter || !muxData || !chapter.videoUrl || !chapter.description || !chapter.title) return new NextResponse("Missing required fields", { status: 400 });
        const publishedChaptersInCourse = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: true
            }
        })
        return NextResponse.json(publishedChaptersInCourse);
    } catch (error) {
        console.log("[CHAPTER-PUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
