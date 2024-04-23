import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params: { courseId, attachmentId } }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });
        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });
        const attachment = await db.attachment.delete({
            where: {
                id: attachmentId,
                courseId,
            },
        });
        return NextResponse.json(attachment);
    } catch (error) {
        console.log("[ATTACHMENTS_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
