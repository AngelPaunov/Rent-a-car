import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../api/userService";
import Spinner from "../../../layout/Spinner/Spinner";
import User from "../User/User";
import "./UserDetails.css";

export default function UserDetails() {
  const { id } = useParams();
  const { data: user, isError, isLoading, error } = useQuery(
    ["user"],
    async () => await getUserById(id)
  );

  if (isError) throw error;
  if (isLoading) return <Spinner />;

  return (
    <div className="user-details">
      <User key={user.id} user={user} />
    </div>
  );
}
