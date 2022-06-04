import React from "react";
import { useQuery } from "react-query";
import { getCars } from "../../api/carService";
import Spinner from "../../layout/Spinner/Spinner";
import Car from "./Car/Car";
import "./Cars.css";

export default function Cars() {
  const { data: cars, isError, error, isLoading } = useQuery(["cars"], getCars);

  if (isError) throw error;
  if (isLoading) return <Spinner />;

  return (
    <section className="cars">
      {cars.map((u) => (
        <Car key={u.id} car={u} />
      ))}
    </section>
  );
}
