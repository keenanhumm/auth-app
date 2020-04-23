import React from "react";
import { useUserQuery } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";

export const UserDetailsPage: React.FC<RouteComponentProps> = ({
  match,
}: any) => {
  const { id = "" } = match;
  const { data, error, loading } = useUserQuery({
    fetchPolicy: "network-only",
    variables: {
      userId: id,
    },
  });

  // PRESENTATION
  let view;
  if (loading) view = "Fetching user details...";
  else if (error) view = "Unable to retrieve user details.";
  else if (!data) view = "User not found.";
  else view = data.user.email;
  return <div>{view}</div>;
};
