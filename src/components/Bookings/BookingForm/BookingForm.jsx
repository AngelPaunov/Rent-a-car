import { useFormik } from "formik";
import React from "react"
import { Button, Form, Row } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup"
import { getBookingsByCar, saveBooking } from "../../../api/bookingService";

function formatDateToDateTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

Yup.addMethod(Yup.date, "validateBookedDates", function ({ errorMessage, bookedPeriods }) {
    return this.test(`test-booked-dates`, errorMessage, function (value) {
        const { path, createError } = this;

        let isValidDate = true;
        const valueAsTimestamp = value instanceof Date && value.getTime();
        for (let i = 0; i < bookedPeriods.length; i++) {
            const bookedPeriod = bookedPeriods[i];
            const startTimestamp = Date.parse(bookedPeriod.startTime);
            const endTimestamp = Date.parse(bookedPeriod.endTime);

            if (valueAsTimestamp >= startTimestamp && valueAsTimestamp <= endTimestamp) {
                isValidDate = false;
                break;
            }
        }

        return isValidDate || createError({ path, message: errorMessage });
    });
});

function getDiscount(rentalPeriodInHours) {
    const daysDiff = Math.ceil(rentalPeriodInHours / 24)
    if (daysDiff > 10)
        return 10;
    if (daysDiff > 5)
        return 7;
    if (daysDiff > 3)
        return 5;

    return 0;
}

const formInitialValues = {
    "startTime": "2022-06-09T10:10",
    "endTime": ""
}

export function BookingForm({ userId, carId, pricePerHour, closeForm }) {
    const queryClient = useQueryClient();

    const { data: bookings, isLoading: isLoadingBookings } = useQuery(["carBookings", carId], () => getBookingsByCar(carId), {
        refetchOnMount: "always"
    });

    const bookedPeriods = bookings && bookings.map(b => ({ startTime: b.startTime, endTime: b.endTime }));

    console.log(bookings);
    //Validation issue when startTime is less than bookedStartTime
    // and endtime is after booked End Time
    const { mutateAsync: saveBookingAsync, isLoading } = useMutation(saveBooking);
    const formik = useFormik({
        initialValues: formInitialValues,
        validationSchema: Yup.object({
            startTime: Yup.date()
                .min(formatDateToDateTime(new Date()), "Please choose future date")
                .validateBookedDates({ errorMessage: 'Booked date!', bookedPeriods })
                .required("Start time is required"),
            endTime: Yup.date()
                .min(Yup.ref('startTime'), "End time can't be before Start time")
                .validateBookedDates({ errorMessage: 'Booked date!', bookedPeriods })
                .required("End time is required")
        }),
        onSubmit: async (values) => {
            const bookingData = {
                userId,
                carId,
                price: totalPrice,
                startTime: values.startTime,
                endTime: values.endTime
            }

            await saveBookingAsync(bookingData);
            queryClient.invalidateQueries(["bookings", userId]);
            closeForm();
        }
    })

    const hoursDiff = formik.isValid && Math.floor(Math.abs(new Date(formik.values.endTime).getTime() - new Date(formik.values.startTime).getTime()) / 36e5);
    const price = hoursDiff * pricePerHour;
    const discount = getDiscount(hoursDiff);
    const totalPrice = discount > 0
        ? price - (price * discount / 100)
        : price;

    if (isLoading) return <h1>Saving Booking...</h1>;
    if (isLoadingBookings) return <h1>Loading Bookings...</h1>;

    return (
        <div className="booking-form-wrapper">
            <Form noValidate onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-2" controlId="formGroupStartTime">
                    <Form.Label>Start Time*</Form.Label>
                    <Form.Control type="datetime-local" min={formatDateToDateTime(new Date())} step="3600" placeholder="Enter start time" name="startTime"
                        value={formik.values.startTime}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.startTime && formik.errors.startTime}
                        isValid={formik.touched.startTime && !formik.errors.startTime}
                    />
                    {formik.touched.startTime && formik.errors.startTime
                        ? <Form.Control.Feedback type="invalid">{formik.errors.startTime}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                <Form.Group className="mb-2" controlId="formGroupEndTime">
                    <Form.Label>End Time*</Form.Label>
                    <Form.Control type="datetime-local" min={formatDateToDateTime(new Date())} step="3600" placeholder="Enter end time" name="endTime"
                        value={formik.values.endTime}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.endTime && formik.errors.endTime}
                        isValid={formik.touched.endTime && !formik.errors.endTime}
                    />
                    {formik.touched.endTime && formik.errors.endTime
                        ? <Form.Control.Feedback type="invalid">{formik.errors.endTime}</Form.Control.Feedback>
                        : <Form.Control.Feedback />}
                </Form.Group>

                {!!discount &&
                    <Form.Group as={Row} className="mb-2" >
                        <Form.Label column sm={2}>Discount:</Form.Label>
                        <Form.Label column sm={10}><strong>{discount + "%"}</strong></Form.Label>
                    </Form.Group>}
                {!!totalPrice &&
                    <Form.Group as={Row} className="mb-2" >
                        <Form.Label column sm={2}>Total:</Form.Label>
                        <Form.Label column sm={10}><strong>{'$' + totalPrice}</strong></Form.Label>
                    </Form.Group>}

                <Button variant="outline-success" type="submit">Save Booking</Button>
            </Form>
        </div>
    )
}