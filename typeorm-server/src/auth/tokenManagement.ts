import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import { getEnvVariable } from "../utils";
import { Response } from "express";
import { getConnection } from "typeorm";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, getEnvVariable("ACCESS_TOKEN_SECRET")!, {
    expiresIn: "15m",
  });
};
export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    getEnvVariable("REFRESH_TOKEN_SECRET")!,
    {
      expiresIn: "7d",
    }
  );
};

export const attachRefreshToken = (resp: Response, user: User) => {
  resp.cookie(
    getEnvVariable("REFRESH_TOKEN_COOKIE_NAME")!,
    createRefreshToken(user),
    { httpOnly: true }
  );
  return resp;
};

export const revokeRefreshTokens = async (userId: number) => {
  try {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
  } catch (err) {
    console.error(err);
  }
  return true;
};
