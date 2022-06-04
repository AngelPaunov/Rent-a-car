import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getCarById } from "../../../api/carService";
import Spinner from "../../../layout/Spinner/Spinner";
import Car from "../Car/Car";
import "./CarDetails.css";

export default function CarDetails() {
  const { id } = useParams();
  const { data: car, isError, isLoading, error } = useQuery(
    ["car"],
    async () => await getCarById(id)
  );

  if (isError) throw error;
  if (isLoading) return <Spinner />;

  return (
    <div className="car-details">
      <Car key={car.id} car={car} />
    </div>
  );
}
