import React from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUserById, saveUser } from "../../../api/userService";
import Spinner from "../../../layout/Spinner/Spinner";
import "./UserForm.css";
import { USER_ROLE } from "../../../constants/user";

const formInitialValues = {
    "isActive": false,
    "picture": "",
    "name": "",
    "email": "",
    "phone": "",
    "address": "",
    "role":""
}

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const pictureRegExp = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    email: Yup.string().email('Email is not valid').required('Email is required'),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required'),
    picture: Yup.string().matches(pictureRegExp, 'Please enter a valid URL!').required('Picture is required'),
    role: Yup.mixed().oneOf(Object.keys(USER_ROLE)).required("User role is required"),
    isActive: Yup.boolean().default(false)
})

export default function UserForm() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: user, isError, isLoading, error } = useQuery(
        ["user", id],
        () => getUserById(id),
        {
            enabled: !!id
        }
    );

    const { mutateAsync: saveUserAsync, isLoading: isLoadingSave } = useMutation(saveUser);
    const formik = useFormik({
        initialValues: user || formInitialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (formik.dirty) {
                await saveUserAsync(values);
                queryClient.invalidateQueries("users");
            }
            navigate('/users');
        }
    })

    if (isError) throw error;
    if (isLoading) return <Spinner />;
    if (isLoadingSave) return <h1>Saving user...</h1>;

    return (
        <div className="user-form-wrapper">
            <Form noValidate onSubmit={formik.handleSubmit}>

                <Form.Group className="mb-2" controlId="formGroupName">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.name && formik.errors.name}
                        isValid={formik.touched.name && !formik.errors.name}
                    />
                    {formik.touched.name && formik.errors.name
                        ? <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupEmail">
                    <Form.Label>Email address*</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.email && formik.errors.email}
                        isValid={formik.touched.email && !formik.errors.email}
                    />
                    {formik.touched.email && formik.errors.email
                        ? <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupPhone">
                    <Form.Label>Phone*</Form.Label>
                    <Form.Control type="text" placeholder="Enter phone" name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.phone && formik.errors.phone}
                        isValid={formik.touched.phone && !formik.errors.phone}
                    />
                    {formik.touched.phone && formik.errors.phone
                        ? <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupAddress">
                    <Form.Label>Address*</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.address && formik.errors.address}
                        isValid={formik.touched.address && !formik.errors.address}
                    />
                    {formik.touched.address && formik.errors.address
                        ? <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupPicture">
                    <Form.Label>Picture URL*</Form.Label>
                    <Form.Control type="text" placeholder="Enter picture URL" name="picture"
                        value={formik.values.picture}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.picture && formik.errors.picture}
                        isValid={formik.touched.picture && !formik.errors.picture}
                    />
                    {formik.touched.picture && formik.errors.picture
                        ? <Form.Control.Feedback type="invalid">{formik.errors.picture}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupUserRole">
                    <Form.Label>User Role*</Form.Label>
                    <Form.Select aria-label="Select User Role" name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.role && formik.errors.role}
                        isValid={formik.touched.role && !formik.errors.role}>
                        <option key="default-user-role" value="">Choose User Role</option>
                        {Object.keys(USER_ROLE).map(t => {
                            return <option key={t} value={t}>{USER_ROLE[t]}</option>
                        })}
                    </Form.Select>
                    {formik.touched.role && formik.errors.role
                        ? <Form.Control.Feedback type="invalid">{formik.errors.role}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupIsActive">
                    <Form.Check type="switch" id="switch-is-active" label="Active"
                        name="isActive"
                        checked={formik.values.isActive}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                    </Form.Check>
                </Form.Group>

                <Button className="primary mt-1" type="submit">{!!id ? "Save" : "Create"} User</Button>
            </Form>
        </div>
    )
}