import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";


export const test = (req, res) => {
  res.json({ message: "is it working" });
  };

  export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId){
      return next(errorHandler(403, "Du bist nicht berechtigt, diesen Nutzer zu aktualisieren"));
    }
    if (req.body.password){
      if(
        req.body.password.length < 6){
          return next(errorHandler(400, "Das Passwort muss mindestens 6 Zeichen lang sein"));
        }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username){
      if (
        req.body.username.length < 7 || req.body.username.length > 20) {
        return next(errorHandler(400, " Der Benutzername muss mindestens zwischen 7 und 20 Zeichen lang sein"));
      }
      if (
        req.body.username.includes(" ")) {
        return next(errorHandler(400, "Der Benutzername darf keine Leerzeichen enthalten"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Der Benutzer muss aus Kleinbuchstaben bestehen"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, "Der Benutzername darf nur Buchstaben und Zahlen enthalten"));
    }
  }
    try {
      const updatedUser = await User.findByIdAndUpdate( req.params.userId,{
          $set:{
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password
          },
        },{new: true});
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (err) {
      next(err);
    }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId){
    return next(errorHandler(403, "Du ist nicht berechtigt, diesen Benutzer zu löschen"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Benutzer wurde gelöscht");
  } catch (err) {
    next(err);
  }
};

export const signout = (req, res, next) => {
  try {
    const token = null;
    const message = "Der Benutzer wurde erfolgreich abgemeldet";
    res.status(200).json({ message, token });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if(!req.user.isAdmin) {
    return next(errorHandler(403, "Du bist nicht berechtigt, alle Nutzer zu sehen"));
  }
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;

      const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });

      const totalUsers = await User.countDocuments();

      const now = new Date();

      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const lastMonthUsers = await User.countDocuments({
        createdAt: {
          $gte: oneMonthAgo,
        },
      });

      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      });

  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "Benutzer nicht gefunden"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};