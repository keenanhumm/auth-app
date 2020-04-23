import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";
import { LoginResponse } from "../entity/LoginResponse";
import { MyContext } from "../interface/MyContext";
import { createAccessToken, attachRefreshToken } from "../auth/tokenManagement";
import { isAuthenticated } from "../auth/middleware";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi there";
  }

  @Query(() => String)
  @UseMiddleware(isAuthenticated)
  bye(@Ctx() { payload }: MyContext) {
    return `user id is ${payload!.userId} dummy`;
  }

  @Query(() => User)
  @UseMiddleware(isAuthenticated)
  async user(@Arg("userId") userId: string) {
    return User.findOne(userId);
  }

  @Query(() => [User])
  async users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      await User.insert({
        email,
        password: await hash(password, 12),
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    if (!email || !password) throw new Error("Email and password are required");

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Could not find user");
    } else if (!(await compare(password, user.password))) {
      throw new Error("Password entered was incorrect");
    }

    // refresh token setup
    attachRefreshToken(res, user);

    return {
      accessToken: createAccessToken(user),
    };
  }
}
