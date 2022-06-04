import React from "react";
import { Card, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { deleteUserById } from "../../../api/userService";
import Spinner from "../../../layout/Spinner/Spinner";
import "./User.css";

export default function User({ user }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editHandler = () => navigate(`/user/edit/${user.id}`);
  const detailsHandler = () => navigate(`/users/${user.id}`);

  const { mutateAsync: deleteUserAsync, isLoading } = useMutation(deleteUserById);
  const deleteHandler = async () => {
    await deleteUserAsync(user.id);
    queryClient.invalidateQueries("users");
  };

  if (isLoading) return <Spinner />;

  return (
    <Card className="user-card">
      <Card.Img variant="top" src={user.picture} />
      <Card.Body>
        <Card.Title>{user.name}</Card.Title>
        <Card.Text>
          <span className="key">Address: </span>
          <span className="value">{user.address}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Email: </span>
          <span className="value">{user.email}</span>
        </Card.Text>
        <Card.Text>
          <span className="key">Phone: </span>
          <span className="value">{user.phone}</span>
        </Card.Text>

        <div>
          <Button variant="primary" onClick={detailsHandler}>
            Details
          </Button>
        </div>
        <div className="card-btns">
          <Button variant="primary" onClick={editHandler}>Edit</Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
