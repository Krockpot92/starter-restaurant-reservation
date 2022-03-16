import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import { useHistory } from "react-router-dom";
import CancelWindow from "../utils/cancelWindow";

export default function Search({ mobile_number }) {
  const initialState = {
    mobile_number: "",
  };

  let history = useHistory();

  const [formData, setFormData] = useState(initialState);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [mobile_number]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  let noReservations = "";
  if (reservations.length === 0) {
    noReservations = "No reservations found";
  }

  let reservationData = reservations.map((reservation, key) => {
    let edit = "";
    let cancel = "";
    let reservation_id = reservation.reservation_id;
    console.log(reservation.status);
    if (reservation.status === "booked") {
      edit = (
        <a
          className="btn btn-secondary pr-4 pl-4 mr-2"
          href={`/reservations/${reservation_id}/edit`}
        >
          Edit
        </a>
      );
    }

    if (reservation.status != "cancelled") {
      cancel = (
        <CancelWindow
          reservation={reservation}
          loadDashboard={loadDashboard}
          reservationId={reservation_id}
        />
      );
    }

    return (
      <tr key={key}>
        <th scope="row" key={key}>
          {reservation.reservation_id}
        </th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {" "}
          {reservation.status}{" "}
        </td>
        <td>{edit}</td>
        <td>{cancel}</td>
      </tr>
    );
  });

  const handleReservationChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push(`/search?mobile_number=${formData.mobile_number}`);
    loadDashboard();
  };

  return (
    <main>
      <h1>Search</h1>
      <div className="d-md-flex mb-3">
        <form onSubmit={handleSubmit}>
          <label htmlFor="mobile_number">
            Mobile number:
            <input
              id="mobile_number"
              placeholder="000-000-0000"
              name="mobile_number"
              required
              //pattern="\d{3}[\-]\d{3}[\-]\d{4}"
              onChange={handleReservationChange}
              value={formData.mobile_number}
            />
          </label>

          <button className="btn btn-primary" type="submit">
            Find
          </button>
        </form>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Phone</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{reservationData}</tbody>
      </table>
      <div>{noReservations}</div>
      {/* <ErrorAlert error={reservationsError} /> */}
    </main>
  );
}
