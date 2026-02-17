import Directory from "@/model/directory";
import Session from "@/model/session";
import User from "@/model/user";
import mongoose, { Types } from "mongoose";

// for this we need to understand auth

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const session = await mongoose.startSession();

  try {
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    session.startTransaction();

    await Directory.insertOne(
      {
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId,
      },
      { session },
    );

    await User.insertOne(
      {
        _id: userId,
        name,
        email,
        password,
        rootDirId,
      },
      { session },
    );

    session.commitTransaction();

    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    session.abortTransaction();
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  //   if (user.deleted) {
  //     return res.status(403).json({
  //       error: "your account has been deleted. Contact app admin to recover ",
  //     });
  //   }

  //   const isPasswordValid = await user.comparePassword(password);
  //   if (!isPasswordValid) {
  //     return res.status(404).json({ error: "Invalid Credentials" });
  //   }

  const allSessions = await Session.find({ userId: user._id });

  if (allSessions.length >= 2) {
    await allSessions[0].deleteOne();
  }

  const session = await Session.create({
    userId: user._id,
    rootDirId: user.rootDirId,
  });

  res.cookie("sid", session._id, {
    httpOnly: true,
    signed: true,
    maxAge: 7 * 24 * 60 * 60,
  });
  res.json({ message: "logged in" });
};

export const logout = async (req, res) => {
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid);
  res.clearCookie("sid");
  res.status(204).end();
};

export const profile = async (req, res, next) => {
  const user = await User.findById(req.user._id).lean();
  res.status(200).json({
    email: user.email,
    name: user.name,
    picture: user.picture,
    role: user.role,
  });
};
