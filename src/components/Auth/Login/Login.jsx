import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../../api/userService";
import { UserContext } from "../../../context/UserContext/UserContext";
import Spinner from "../../../layout/Spinner/Spinner";
import "../../Users/UserForm/UserForm.css";

export default function Login() {
    const { setUser } = useContext(UserContext);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [formUser, setFormUser] = useState({
        "email": "",
        "password": ""
    })

    const { isFetching, isError, error, refetch } = useQuery(
        ["user"],
        () => loginUser(formUser),
        {
            enabled: false,
            refetchOnWindowFocus: false,
            retry: false
        });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const { data, isSuccess, isError } = await refetch();
        if (isSuccess) {
            setUser(data);
            navigate(state ? state.path : '/');
        }
        if (isError) {
            console.error(error);
        }
    }
    const onInputChange = (event) => {
        setFormUser((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }))
    }

    if (isError) throw error;
    if (isFetching) return <Spinner />;

    //TODO update the form to use Formik
    return (
        <div className="user-form-wrapper">
            <Form onSubmit={onSubmitHandler}>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={formUser.email} name="email" onChange={onInputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={formUser.password} name="password" onChange={onInputChange} />
                </Form.Group>
                <Button className="primary" type="submit">Login</Button>
            </Form>
        </div>
    );
}