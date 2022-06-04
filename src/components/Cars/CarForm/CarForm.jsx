import React from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCarById, saveCar } from "../../../api/carService";
import Spinner from "../../../layout/Spinner/Spinner";
import "./CarForm.css";
import { CAR_TYPE, FUEL_TYPE } from "../../../constants/car";


const formInitialValues = {
    "picture": "",
    "type": "",
    "brand": "",
    "model": "",
    "manufactureDate": "",
    "fuelType": "",
    "seatsNumber": "",
    "pricePerHour": "",
    "availableVehiclesCount": ""
}

const priceRegExp = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
const pictureRegExp = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const validationSchema = Yup.object({
    brand: Yup.string().required("Brand is required"),
    model: Yup.string().required("Model is required"),
    type: Yup.mixed().oneOf(Object.keys(CAR_TYPE)).required("Car type is required"),
    fuelType: Yup.mixed().oneOf(Object.keys(FUEL_TYPE)).required("Fuel type is required"),
    manufactureDate: Yup.date().max(new Date(), 'Please choose date earlier than today').required("Manufacture date is required"),
    seatsNumber: Yup.number().typeError('Must be a number').integer().min(1, "Min value is 1").max(20, "Max value is 20").required("Seats number are required"),
    pricePerHour: Yup.string().min(1, "Min value is 1").matches(priceRegExp, "Invalid value").required("Price per hour is required"),
    availableVehiclesCount: Yup.number().typeError('Must be a number').integer().min(0, "Min value is 0").notRequired(),
    picture: Yup.string().matches(pictureRegExp, 'Please enter a valid URL!').required('Picture is required')
})

export default function CarForm() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isError, isLoading, error } = useQuery(
        ["car", id],
        () => getCarById(id),
        {
            enabled: !!id
        }
    );

    const { mutateAsync: saveCarAsync, isLoading: isLoadingSave } = useMutation(saveCar);
    const formik = useFormik({
        initialValues: data || formInitialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (formik.dirty) {
                await saveCarAsync(values);
                queryClient.invalidateQueries("cars");
            }
            navigate('/cars');
        }
    })

    if (isError) throw error;
    if (isLoading) return <Spinner />;
    if (isLoadingSave) return <h1>Saving car...</h1>;

    return (
        <div className="car-form-wrapper">
            <Form noValidate onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-2" controlId="formGroupCarType">
                    <Form.Label>Car Type*</Form.Label>
                    <Form.Select aria-label="Select Car Type" name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.type && formik.errors.type}
                        isValid={formik.touched.type && !formik.errors.type}>
                        <option key="default-car-type" value="">Choose Car Type</option>
                        {Object.keys(CAR_TYPE).map(t => {
                            return <option key={t} value={t}>{CAR_TYPE[t]}</option>
                        })}
                    </Form.Select>
                    {formik.touched.type && formik.errors.type
                        ? <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupBrand">
                    <Form.Label>Brand*</Form.Label>
                    <Form.Control type="text" placeholder="Enter brand" name="brand"
                        value={formik.values.brand}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.brand && formik.errors.brand}
                        isValid={formik.touched.brand && !formik.errors.brand}
                    />
                    {formik.touched.brand && formik.errors.brand
                        ? <Form.Control.Feedback type="invalid">{formik.errors.brand}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupModel">
                    <Form.Label>Model*</Form.Label>
                    <Form.Control type="text" placeholder="Enter model" name="model"
                        value={formik.values.model}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.model && formik.errors.model}
                        isValid={formik.touched.model && !formik.errors.model}
                    />
                    {formik.touched.model && formik.errors.model
                        ? <Form.Control.Feedback type="invalid">{formik.errors.model}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupManufactureDate">
                    <Form.Label>Manufacture Date*</Form.Label>
                    <Form.Control type="date" placeholder="Enter manufacture date" name="manufactureDate"
                        value={formik.values.manufactureDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.manufactureDate && formik.errors.manufactureDate}
                        isValid={formik.touched.manufactureDate && !formik.errors.manufactureDate}
                    />
                    {formik.touched.manufactureDate && formik.errors.manufactureDate
                        ? <Form.Control.Feedback type="invalid">{formik.errors.manufactureDate}</Form.Control.Feedback>
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

                <Form.Group className="mb-2" controlId="formGroupFuelType">
                    <Form.Label>Fuel Type*</Form.Label>
                    <Form.Select aria-label="Select Fuel Type" name="fuelType"
                        value={formik.values.fuelType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.fuelType && formik.errors.fuelType}
                        isValid={formik.touched.fuelType && !formik.errors.fuelType}>
                        <option key="default-fuel-type" value="">Choose Fuel Type</option>
                        {Object.keys(FUEL_TYPE).map(t => {
                            return <option key={t} value={t}>{FUEL_TYPE[t]}</option>
                        })}
                    </Form.Select>
                    {formik.touched.fuelType && formik.errors.fuelType
                        ? <Form.Control.Feedback type="invalid">{formik.errors.fuelType}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupSeatsNumber">
                    <Form.Label>Seats Number*</Form.Label>
                    <Form.Control type="number" placeholder="Enter seats number" name="seatsNumber"
                        value={formik.values.seatsNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.seatsNumber && formik.errors.seatsNumber}
                        isValid={formik.touched.seatsNumber && !formik.errors.seatsNumber}
                    />
                    {formik.touched.seatsNumber && formik.errors.seatsNumber
                        ? <Form.Control.Feedback type="invalid">{formik.errors.seatsNumber}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupPricePerHour">
                    <Form.Label>Price per hour*</Form.Label>
                    <Form.Control type="text" placeholder="Enter price per hour" name="pricePerHour"
                        value={formik.values.pricePerHour}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.pricePerHour && formik.errors.pricePerHour}
                        isValid={formik.touched.pricePerHour && !formik.errors.pricePerHour}
                    />
                    {formik.touched.pricePerHour && formik.errors.pricePerHour
                        ? <Form.Control.Feedback type="invalid">{formik.errors.pricePerHour}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupAvailableVehiclesCount">
                    <Form.Label>Available Vehicles Count</Form.Label>
                    <Form.Control type="number" placeholder="Enter seats number of vehicles available" name="availableVehiclesCount"
                        value={formik.values.availableVehiclesCount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.availableVehiclesCount && formik.errors.availableVehiclesCount}
                        isValid={formik.touched.availableVehiclesCount && !formik.errors.availableVehiclesCount}
                    />
                    {formik.touched.availableVehiclesCount && formik.errors.availableVehiclesCount
                        ? <Form.Control.Feedback type="invalid">{formik.errors.availableVehiclesCount}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Button variant="outline-success" type="submit">{!!id ? "Save" : "Create"} Car</Button>
            </Form>
        </div>
    )
}