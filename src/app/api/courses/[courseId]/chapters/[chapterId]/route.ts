import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params: { courseId, chapterId } }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = auth();
        const { isPublished, values } = await req.json();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });
        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                ...values,
            }
        })

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTER-ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
