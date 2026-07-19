import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// GET OPTIONAL USER ID
const getOptionalUserId = (req) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    return payload.id;
  } catch {
    return null;
  }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city
          ? {
              equals: query.city,
              mode: "insensitive",
            }
          : undefined,

        type: query.type || undefined,

        property:
          query.property || undefined,

        bedroom: query.bedroom
          ? parseInt(query.bedroom)
          : undefined,

        price: {
          gte: query.minPrice
            ? parseInt(query.minPrice)
            : 0,

          lte: query.maxPrice
            ? parseInt(query.maxPrice)
            : 100000000000,
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const userId = getOptionalUserId(req);

    if (!userId) {
      return res.status(200).json(
        posts.map((post) => ({
          ...post,
          isSaved: false,
        }))
      );
    }

    const savedPosts =
      await prisma.savedPost.findMany({
        where: {
          userId,
        },

        select: {
          postId: true,
        },
      });

    const savedPostIds = new Set(
      savedPosts.map(
        (savedPost) => savedPost.postId
      )
    );

    const postsWithSavedStatus = posts.map(
      (post) => ({
        ...post,
        isSaved: savedPostIds.has(post.id),
      })
    );

    res.status(200).json(
      postsWithSavedStatus
    );
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to get posts",
    });
  }
};

// GET SINGLE POST
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },

      include: {
        postDetail: true,

        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = getOptionalUserId(req);

    if (!userId) {
      return res.status(200).json({
        ...post,
        isSaved: false,
      });
    }

    const saved =
      await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId,
            postId: id,
          },
        },
      });

    res.status(200).json({
      ...post,
      isSaved: !!saved,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to get post",
    });
  }
};

// ADD POST
export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  try {
    if (!postData || !postDetail) {
      return res.status(400).json({
        message: "Post data is required",
      });
    }

    if (
      !postData.title ||
      !postData.address ||
      !postData.city
    ) {
      return res.status(400).json({
        message:
          "Title, address and city are required",
      });
    }

    if (
      !Number.isInteger(postData.price) ||
      postData.price < 0
    ) {
      return res.status(400).json({
        message: "Invalid property price",
      });
    }

    if (
      !Array.isArray(postData.images) ||
      postData.images.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one property image is required",
      });
    }

    const newPost = await prisma.post.create({
      data: {
        ...postData,

        userId: tokenUserId,

        postDetail: {
          create: postDetail,
        },
      },

      include: {
        postDetail: true,
      },
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

// UPDATE POST
export const updatePosts = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  const { postData, postDetail } = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (!postData || !postDetail) {
      return res.status(400).json({
        message: "Post data is required",
      });
    }

    if (
      !postData.title ||
      !postData.address ||
      !postData.city
    ) {
      return res.status(400).json({
        message:
          "Title, address and city are required",
      });
    }

    if (
      !Number.isInteger(postData.price) ||
      postData.price < 0
    ) {
      return res.status(400).json({
        message: "Invalid property price",
      });
    }

    if (
      !Array.isArray(postData.images) ||
      postData.images.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one property image is required",
      });
    }

    await prisma.post.update({
      where: {
        id,
      },

      data: {
        title: postData.title,
        price: postData.price,
        address: postData.address,
        city: postData.city,
        bedroom: postData.bedroom,
        bathroom: postData.bathroom,
        latitude: postData.latitude,
        longitude: postData.longitude,
        type: postData.type,
        property: postData.property,
        images: postData.images,
      },
    });

    await prisma.postDetail.upsert({
      where: {
        postId: id,
      },

      update: {
        desc: postDetail.desc,
        utilities: postDetail.utilities,
        pet: postDetail.pet,
        income: postDetail.income,
        size: postDetail.size,
        school: postDetail.school,
        bus: postDetail.bus,
        restaurant: postDetail.restaurant,
      },

      create: {
        postId: id,
        desc: postDetail.desc,
        utilities: postDetail.utilities,
        pet: postDetail.pet,
        income: postDetail.income,
        size: postDetail.size,
        school: postDetail.school,
        bus: postDetail.bus,
        restaurant: postDetail.restaurant,
      },
    });

    const updatedPost =
      await prisma.post.findUnique({
        where: {
          id,
        },

        include: {
          postDetail: true,
        },
      });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update post",
    });
  }
};

// DELETE POST
export const deletePosts = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await prisma.savedPost.deleteMany({
      where: {
        postId: id,
      },
    });

    await prisma.postDetail.deleteMany({
      where: {
        postId: id,
      },
    });

    await prisma.post.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message:
        "Property deleted successfully",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      message:
        "Failed to delete property",
    });
  }
};