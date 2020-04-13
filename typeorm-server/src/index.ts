import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import "dotenv/config";
import { getEnvVariable } from "./utils";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, attachRefreshToken } from "./auth/tokenManagement";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.get("/", (_req, res) => res.send("hello"));

  app.post("/refresh", async (req, res) => {
    const emptyResponse = { ok: false, accessToken: "" };
    const token = req.cookies[getEnvVariable("REFRESH_TOKEN_COOKIE_NAME")!];

    if (!token) return res.send(emptyResponse);

    let payload: any;
    try {
      payload = verify(token, getEnvVariable("REFRESH_TOKEN_SECRET")!);
    } catch (err) {
      console.error(err);
      return res.send(emptyResponse);
    }

    // get the user by id specified in the refresh token
    const user = await User.findOne({ id: payload.userId });

    // if they don't exist return empty
    if (!user) return res.send(emptyResponse);

    // if the refresh token is not the latest return empty
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send(emptyResponse);
    }

    // attaching new refresh token
    attachRefreshToken(res, user!);

    // return new accessToken
    return res.send({ ok: true, accessToken: createAccessToken(user!) });
  });

  await createConnection();

  new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  }).applyMiddleware({ app });

  app.listen(getEnvVariable("PORT_NUM"), () => {
    console.log("express server started");
  });
})();
