const baseURI = "http://localhost:3001";

export async function getBookingsByUser(userId) {
    const response = await fetch(`${baseURI}/bookings?userId=${userId}&active=true`);
    return await response.json();
}
export async function getBookingsByCar(carId) {
    const response = await fetch(`${baseURI}/bookings?carId=${carId}&active=true`);
    return await response.json();
}
export async function saveBooking(bookingData) {
    bookingData.active = true;
    //TODO decrease car quantity
    const response = await fetch(`${baseURI}/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bookingData) })
    return await response.json();
}
export async function cancelBooking(id) {
    const bookingData = {
        active: false
    }
    //TODO increase car quantity
    const response = await fetch(`${baseURI}/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bookingData) })
    return await response.json();
}