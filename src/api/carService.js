const baseURI = "http://localhost:3001";

export async function getCars() {
    const response = await fetch(`${baseURI}/cars`);
    return await response.json();
}
export async function getCarPicturesByIds(ids) {
    try {
        const responses = await Promise.all(
            ids.map(id => fetch(`${baseURI}/cars/${id}`))
        )
        const cars = await Promise.all(responses.map(r => r.json()));
        return cars.map(c => ({
            picture: c.picture, carId: c.id
        }));
    } catch (err) {
        console.error(err);
    }
}

export async function getCarById(id) {
    const response = await fetch(`${baseURI}/cars/${id}`);
    return await response.json();
}

export async function deleteCarById(id) {
    const response = await fetch(`${baseURI}/cars/${id}`, { method: "DELETE" });
    return await response.json();
}

export async function saveCar(car) {
    if (!car.picture)
        car.picture = `https://picsum.photos/200?random=${Math.random().toFixed(2) * 100}`

    const response = car.id
        ? await fetch(`${baseURI}/cars/${car.id}`, {
            method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(car)
        })
        : await fetch(`${baseURI}/cars`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(car) });

    return await response.json();
}

