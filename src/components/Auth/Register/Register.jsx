import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/userService";
import Spinner from "../../../layout/Spinner/Spinner";
import "../../Users/UserForm/UserForm.css";

export default function Register() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        "picture": "",
        "name": "",
        "email": "",
        "phone": "",
        "address": "",
        "password": ""
    })

    const onInputChange = (event) => {
        setUser((prevState) => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        })
    }

    const { mutateAsync: registerUserAsync, isLoading, isError, error } = useMutation(registerUser);
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        await registerUserAsync(user);
        queryClient.invalidateQueries("users");
        navigate('/users');
    }

    if (isError) throw error;
    if (isLoading) return <Spinner />;

    //TODO update the form to use Formik
    return (
        <div className="user-form-wrapper">
            <Form onSubmit={onSubmitHandler}>
                <Form.Group className="mb-3" controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" value={user.name} name="name" onChange={onInputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={user.email} name="email" onChange={onInputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="tel" placeholder="Enter phone" value={user.phone} name="phone" onChange={onInputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" value={user.address} name="address" onChange={onInputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPicture">
                    <Form.Label>Picture</Form.Label>
                    <Form.Control type="text" placeholder="Enter picture" value={user.picture} name="picture" onChange={onInputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={user.password} name="password" onChange={onInputChange} />
                </Form.Group>
                <Button className="primary" type="submit">Submit</Button>
            </Form>
        </div>);
}