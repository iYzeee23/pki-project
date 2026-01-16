import { UserModel } from "../models";
import { toUserDto } from "../mappers";
import { asyncHandler, hashPassword, signToken, verifyPassword, HttpError } from "../utils";
import { deleteImage, saveImage } from "../image-utils";
import { UserDto } from "@app/shared";

export class UsersController {
  register = asyncHandler(async (req, res, _next) => {
    const body = req.body as {
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };

    const exists = await UserModel.findOne({
      $or: [{ username: body.username }, { email: body.email }]
    });
    if (exists) throw new HttpError(409, "Username or email already exists");

    const passwordHash = await hashPassword(body.password);
    const profileImagePath = saveImage(req.file?.buffer, req.file?.originalname);

    const user = await UserModel.create({
      username: body.username,
      passwordHash,
      isAdmin: false,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      profileImagePath: profileImagePath,
    });

    const token = signToken(user._id.toString(), user.isAdmin);

    const dto: UserDto = toUserDto(user);
    res.status(201).json({ token: token, user: dto });
  });

  login = asyncHandler(async (req, res, _next) => {
    const body = req.body as {
      username: string;
      password: string 
    };

    const user = await UserModel.findOne({ username: body.username }).select("+passwordHash");
    if (!user) return res.json(null);

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) return res.json(null);

    const token = signToken(user._id.toString(), user.isAdmin);
    
    const dto: UserDto = toUserDto(user);
    res.status(201).json({ token: token, user: dto });
  });

  me = asyncHandler(async (req, res, _next) => {
    const user = await UserModel.findById(req.auth!.userId);
    if (!user) throw new HttpError(404, "User not found");

    const dto: UserDto = toUserDto(user);
    res.json(dto);
  });

  updateMe = asyncHandler(async (req, res, _next) => {
    const user = await UserModel.findById(req.auth!.userId);
    if (!user) throw new HttpError(404, "User not found");

    const body = req.body as {
      username: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };

    const exists = await UserModel.findOne({
      $or: [{ username: body.username }, { email: body.email }]
    });
    if (exists) {
      const same = exists._id.equals(user._id);
      if (!same) throw new HttpError(409, "New username or email already exists");
    }

    user.username = body.username;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.phone = body.phone;
    user.email = body.email;

    deleteImage(user.profileImagePath);
    user.profileImagePath = saveImage(req.file?.buffer, req.file?.originalname);

    await user.save();

    const dto: UserDto = toUserDto(user);
    res.json(dto);
  });

  changePassword = asyncHandler(async (req, res, _next) => {
    const body = req.body as {
      oldPassword: string;
      newPassword: string 
    };

    const user = await UserModel.findById(req.auth!.userId).select("+passwordHash");
    if (!user) throw new HttpError(404, "User not found");

    const ok = await verifyPassword(body.oldPassword, user.passwordHash);
    if (!ok) throw new HttpError(400, "Old password is incorrect");

    user.passwordHash = await hashPassword(body.newPassword);
    await user.save();

    res.json({ ok: true });
  }); 
}
