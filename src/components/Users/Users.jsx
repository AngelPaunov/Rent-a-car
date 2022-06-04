import React from "react";
import { useQuery } from "react-query";
import { getUsers } from "../../api/userService";
import Spinner from "../../layout/Spinner/Spinner";
import User from "./User/User";
import "./Users.css";

export default function Users() {
  const { data: users, isError, error, isLoading } = useQuery(["users"], getUsers);

  if (isError) throw error;
  if (isLoading) return <Spinner />;

  return (
    <section className="users">
      {users.map((u) => (
        <User key={u.id} user={u} />
      ))}
    </section>
  );
}
