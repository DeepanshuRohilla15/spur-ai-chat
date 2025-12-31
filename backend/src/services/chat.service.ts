import prisma from "../db/prisma";
import { Sender } from "@prisma/client";


export async function getOrCreateConversation(conversationId?: string)
{
    if(!conversationId)
    {
        return prisma.conversation.create({
            data: {},
        });
    }

    const existing = await prisma.conversation.findUnique({
        where: { id: conversationId },
    });

    if(existing)
    {
        return existing;
    }

    // if client send invalid sessionid, create a new one
    return prisma.conversation.create({
        data: {},
    });
}

export async function saveMessage(
    conversationId: string, 
    sender: Sender,
    text: string
){
    return prisma.message.create({
        data: {
            conversationId,
            sender,
            text,
        },
    });
}

export async function getConversationMessages(conversationId: string)
{
    return prisma.message.findMany({
        where: {
            conversationId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

