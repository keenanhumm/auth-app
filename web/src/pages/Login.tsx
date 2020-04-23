import React, { useState, useCallback } from "react";
import { useLoginMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { setAccessToken } from "../accessToken";

export const LoginPage: React.FC<RouteComponentProps> = ({ history }) => {
  // STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  // EVENT HANDLING
  const handleChangeEmail = useCallback((event) => {
    setEmail(event.target.value);
  }, []);
  const handleChangePassword = useCallback((event) => {
    setPassword(event.target.value);
  }, []);
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await login({
      variables: {
        email,
        password,
      },
    });

    const { data: { login: { accessToken = null } = {} } = {} } =
      response || {};

    if (accessToken) {
      setAccessToken(accessToken);
      history.push("/");
    }
  };

  // PRESENTATION
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleChangeEmail}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handleChangePassword}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
