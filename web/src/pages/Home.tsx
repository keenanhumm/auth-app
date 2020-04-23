import React from "react";
import { useUsersQuery } from "../generated/graphql";
import { Link } from "react-router-dom";

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
              <Link to={`/user/${user.id}`}>{user.email}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
