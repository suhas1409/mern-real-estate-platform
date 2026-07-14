import prisma from "../lib/prisma.js";

// GET ALL CHATS
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    const chatsWithReceiver = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find(
          (id) => id !== tokenUserId
        );

        const receiver =
          await prisma.user.findUnique({
            where: {
              id: receiverId,
            },
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          });

        return {
          ...chat,
          receiver,
        };
      })
    );

    res.status(200).json(chatsWithReceiver);
  } catch (err) {
    console.log("GET CHATS ERROR:", err);

    res.status(500).json({
      message: "Failed to get chats!",
    });
  }
};

// GET SINGLE CHAT
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.id,
        userIDs: {
          has: tokenUserId,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found!",
      });
    }

    if (!chat.seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          seenBy: {
            push: tokenUserId,
          },
        },
      });
    }

    res.status(200).json({
      ...chat,
      seenBy: chat.seenBy.includes(tokenUserId)
        ? chat.seenBy
        : [...chat.seenBy, tokenUserId],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to get chat!",
    });
  }
};

// CREATE CHAT
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  try {
    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver is required!",
      });
    }

    if (tokenUserId === receiverId) {
      return res.status(400).json({
        message: "You cannot chat with yourself!",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
      },
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found!",
      });
    }

    const existingChat =
      await prisma.chat.findFirst({
        where: {
          userIDs: {
            hasEvery: [
              tokenUserId,
              receiverId,
            ],
          },
        },
      });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        userIDs: [
          tokenUserId,
          receiverId,
        ],
        seenBy: [tokenUserId],
      },
    });

    res.status(201).json(newChat);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to add chat!",
    });
  }
};

// MARK CHAT AS READ
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    // CHECK CHAT AND USER MEMBERSHIP
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: {
          has: tokenUserId,
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found or access denied",
      });
    }

    // ALREADY SEEN
    if (chat.seenBy.includes(tokenUserId)) {
      return res.status(200).json(chat);
    }

    // MARK AS READ
    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    return res.status(200).json(updatedChat);
  } catch (err) {
    console.log("READ CHAT ERROR:", err);

    return res.status(500).json({
      message: "Failed to read chat!",
    });
  }
};