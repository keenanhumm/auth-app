import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

export const HomePage: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" });

  // PRESENTATION
  return (
    <div>
      <h1>Home</h1>
      <h3>Users</h3>
      {loading || !data ? (
        "fetching users..."
      ) : (
        <ul>
          {data.users.map((user) => (
            <li key={user.email}>
              {user.email} - {user.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
