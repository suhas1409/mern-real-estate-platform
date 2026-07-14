import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// REGISTER
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // CLEAN INPUT DATA
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // VALIDATE USERNAME
    if (cleanUsername.length < 3) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters",
      });
    }

    // VALIDATE PASSWORD
    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    // CHECK EXISTING USER
    const existingUser =
      await prisma.user.findFirst({
        where: {
          OR: [
            {
              username: cleanUsername,
            },
            {
              email: cleanEmail,
            },
          ],
        },
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.username === cleanUsername
            ? "Username already exists"
            : "Email already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // CREATE USER
    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
      },
    });

    // REMOVE PASSWORD
    const {
      password: userPassword,
      ...userInfo
    } = newUser;

    res.status(201).json({
      message: "User created successfully",
      user: userInfo,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to register",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        message:
          "Username and password are required",
      });
    }

    // CLEAN USERNAME
    const cleanUsername = username.trim();

    // FIND USER
    const user = await prisma.user.findUnique({
      where: {
        username: cleanUsername,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // REMOVE PASSWORD
    const {
      password: userPassword,
      ...userInfo
    } = user;

    res.status(200).json({
      token,
      user: userInfo,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to login",
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.status(200).json({
    message: "Logout successful",
  });
};