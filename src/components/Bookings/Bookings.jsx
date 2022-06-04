import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getBookingsByUser } from "../../api/bookingService";
import { getCarPicturesByIds } from "../../api/carService";
import Spinner from "../../layout/Spinner/Spinner";
import Booking from "./Booking/Booking";
import "./Bookings.css";

export default function Bookings() {
  const { userId } = useParams();
  const { data: bookings, isLoading: isLoadingBookings } = useQuery(["bookings", userId], () => getBookingsByUser(userId));
  const { data: carPictures, isIdle } = useQuery(["carPictures", bookings],
    () => getCarPicturesByIds(bookings.map(b => b.carId)),
    {
      enabled: !!bookings
    }
  );

  if (isLoadingBookings || isIdle) return <Spinner />;

  return (
    <section className="bookings">
      {!!bookings && !!carPictures && bookings.map((b) => {
        const carPicture = carPictures.find(p => p.carId === b.carId);
        return <Booking key={b.id} booking={b} picture={carPicture.picture} />
      })}
    </section>
  );
}
