import React, { useState, useCallback } from "react";
import { useRegisterMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";

export const RegisterPage: React.FC<RouteComponentProps> = ({ history }) => {
  // STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();

  // EVENT HANDLING
  const handleChangeEmail = useCallback((event) => {
    setEmail(event.target.value);
  }, []);
  const handleChangePassword = useCallback((event) => {
    setPassword(event.target.value);
  }, []);
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await register({
      variables: {
        email,
        password,
      },
    });
    const { data: { register: wasRegistered = false } = {} } = response || {};

    if (wasRegistered) history.push("/");
  };

  // PRESENTATION
  return (
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
      <button type="submit">register</button>
    </form>
  );
};
