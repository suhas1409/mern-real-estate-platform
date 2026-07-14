import prisma from "../lib/prisma.js";

// ADD MESSAGE
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text?.trim();

  try {
    // VALIDATE MESSAGE
    if (!text) {
      return res.status(400).json({
        message: "Message cannot be empty!",
      });
    }

    // CHECK CHAT AND USER ACCESS
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
        message: "Chat not found!",
      });
    }

    // CREATE MESSAGE
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // UPDATE CHAT
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
        lastMessage: text,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to add message!",
    });
  }
};