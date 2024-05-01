import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import test from "node:test";

const { video } = new Mux(
    {
        tokenId: process.env.MUX_TOKEN_ID,
        tokenSecret: process.env.MUX_TOKEN_SECRET,
    }
);

export async function PATCH(req: Request, { params: { courseId, chapterId } }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();
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

        if (values.videoUrl) {

            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId
                }
            })

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                    chapterId
                }
            })

        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTER-ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
