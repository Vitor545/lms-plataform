import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params: { courseId } }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if (!course) return new NextResponse("Not Found", { status: 404 });

        const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

        if (!course.title || !course.description || !course.chapters.length
            || !hasPublishedChapters || !course.imageUrl || !course.categoryId || !course.price) return new NextResponse("Missing required fields", { status: 400 });

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId: userId,
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE-PUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
