import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to get users!",
    });
  }
};

// GET SINGLE USER
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to get user!",
    });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  const {
    username,
    email,
    password,
    avatar,
  } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({
      message: "Not authorized",
    });
  }

  try {
    if (!username || !email) {
      return res.status(400).json({
        message: "Username and email are required",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters",
      });
    }

    if (password && password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          {
            id: {
              not: id,
            },
          },
          {
            OR: [
              { username },
              { email },
            ],
          },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    let updatedPassword;

    if (password) {
      updatedPassword = await bcrypt.hash(
        password,
        10
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        ...(updatedPassword && {
          password: updatedPassword,
        }),
        ...(avatar && {
          avatar,
        }),
      },
    });

    const {
      password: userPassword,
      ...userInfo
    } = updatedUser;

    res.status(200).json(userInfo);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update user!",
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({
      message: "Not authorized",
    });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete user!",
    });
  }
};

// SAVE / REMOVE SAVED POST
export const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  try {
    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const savedPost =
      await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: tokenUserId,
            postId,
          },
        },
      });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });

      return res.status(200).json({
        message: "Post removed from saved list",
        isSaved: false,
      });
    }

    await prisma.savedPost.create({
      data: {
        userId: tokenUserId,
        postId,
      },
    });

    res.status(200).json({
      message: "Post saved",
      isSaved: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to save post!",
    });
  }
};

// PROFILE POSTS
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        userId: tokenUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const saved = await prisma.savedPost.findMany({
      where: {
        userId: tokenUserId,
      },
      include: {
        post: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const savedPosts = saved.map((item) => ({
      ...item.post,
      isSaved: true,
    }));

    res.status(200).json({
      userPosts,
      savedPosts,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to get profile posts!",
    });
  }
};

// GET NOTIFICATION NUMBER
export const getNotificationNumber = async (
  req,
  res
) => {
  const tokenUserId = req.userId;

  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });

    res.status(200).json(number);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to get notification",
    });
  }
};