import React, { useContext, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { deleteCarById } from "../../../api/carService";
import { CAR_TYPE, FUEL_TYPE } from "../../../constants/car";
import { USER_ROLE } from "../../../constants/user";
import { UserContext } from "../../../context/UserContext/UserContext";
import Spinner from "../../../layout/Spinner/Spinner";
import { BookingForm } from "../../Bookings/BookingForm/BookingForm";
import "./Car.css";

export default function Car({ car }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);

  const editHandler = () => navigate(`/car/edit/${car.id}`);
  const detailsHandler = () => navigate(`/cars/${car.id}`);

  const { mutateAsync: deleteCarAsync, isLoading } = useMutation(deleteCarById);
  const deleteHandler = async () => {
    await deleteCarAsync(car.id);
    queryClient.invalidateQueries("cars");
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prevState) => !prevState);
  const bookingFormModal = () => {
    return (
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rent a car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingForm userId={user.id} carId={car.id} pricePerHour={car.pricePerHour} closeForm={toggleModal} />
        </Modal.Body>
      </Modal>
    )
  }

  if (isLoading) return <Spinner />;

  return (
    <Card className="car-card">
      {bookingFormModal()}
      <Card.Img variant="top" src={car.picture} />
      <Card.Body>
        <Card.Title>{car.name}</Card.Title>
        <Card.Text>
          <span className="key">Type: </span>
          <span className="value">{CAR_TYPE[car.type]}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Brand: </span>
          <span className="value">{car.brand}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Model: </span>
          <span className="value">{car.model}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Manufacture Date: </span>
          <span className="value">{car.manufactureDate}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Fuel Type: </span>
          <span className="value">{FUEL_TYPE[car.fuelType]}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Seats: </span>
          <span className="value">{car.seatsNumber}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Price per hour: </span>
          <span className="value">{car.pricePerHour}</span>
        </Card.Text>

        <div className="card-btns">
          <Button variant="primary" onClick={toggleModal}>Rent</Button>
        </div>
        <div className="card-btns">
          <Button variant="secondary" onClick={detailsHandler}> Details </Button>
          {USER_ROLE[user.role] === USER_ROLE.ADMIN
            && <>
              <Button variant="outline-warning" onClick={editHandler}>Edit</Button>
              <Button variant="outline-danger" onClick={deleteHandler}>
                Delete
              </Button>
            </>
          }
        </div>
      </Card.Body>
    </Card>
  );
}
