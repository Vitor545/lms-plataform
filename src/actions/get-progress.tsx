import { db } from "@/lib/db";

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        })
        const publishedChaptersIds = publishedChapters.map(chapter => chapter.id)
        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishedChaptersIds
                },
                isCompleted: true
            }
        })

        const progressPercent = Math.round((validCompletedChapters / publishedChapters.length) * 100)

        return progressPercent

    } catch (error) {
        console.log("[GET-PROGRESS]", error);
        return 0
    }
}