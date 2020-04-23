import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../interface/MyContext";
import { verify } from "jsonwebtoken";
import { getEnvVariable } from "../utils";
import NotAuthenticatedError from "../entity/NotAuthenticatedError";

export const isAuthenticated: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authHeaderValue = context.req.headers["authorization"];
  if (!authHeaderValue) throw new NotAuthenticatedError();

  try {
    const token = authHeaderValue.split(" ")[1];
    const payload: any = verify(token, getEnvVariable("ACCESS_TOKEN_SECRET")!);
    context.payload = payload;
  } catch (err) {
    console.error(err);
    throw new NotAuthenticatedError();
  }

  return next();
};
