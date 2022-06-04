import React from "react";
import { Card, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { cancelBooking } from "../../../api/bookingService";

import Spinner from "../../../layout/Spinner/Spinner";
import "./Booking.css";

export default function Booking({ booking, picture }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: cancelBookingAsync, isLoading } = useMutation(cancelBooking);
  const cancelHandler = async () => {
    await cancelBookingAsync(booking.id);
    queryClient.invalidateQueries("bookings");
  };
  const navigateToCar = () => navigate(`/cars/${booking.carId}`);

  if (isLoading) return <Spinner />;

  return (
    <Card className="booking-card">
      <Card.Img variant="top" src={picture} onClick={navigateToCar} />
      <Card.Body>
        <Card.Title>Booking {booking.id}</Card.Title>
        <Card.Text>
          <span className="key">Start time: </span>
          <span className="value">{booking.startTime}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">End Time: </span>
          <span className="value">{booking.endTime}</span>
        </Card.Text>

        <div className="card-btns">
          <Button variant="outline-danger" onClick={cancelHandler}> Cancel </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
