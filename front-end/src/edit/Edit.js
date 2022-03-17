import React, { useEffect, useState } from "react";
import { readReservations, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import formatReservationDate from "../utils/format-reservation-date"

export default function Edit() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  
  const abortController = new AbortController();

  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    readReservations(reservation_id, abortController.signal)
      .then((reservation) => {
        setReservations(formatReservationDate(reservation))
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }


  const handleReservationChange = (event) => {
    setReservations({
      ...reservations,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateReservation(
      {
        first_name: reservations.first_name,
        last_name: reservations.last_name,
        mobile_number: reservations.mobile_number,
        reservation_date: reservations.reservation_date,
        reservation_time: reservations.reservation_time,
        people: Number(reservations.people),
        status: reservations.status,
      },
      reservation_id
    )
      .then(() => history.push(`/dashboard/?date=${reservations.reservation_date}`))
      .then(() => loadDashboard())
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  

  return (
    <div>
      <h1>Edit Reservation {reservation_id}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">
          First name:
          <input
            id="first_name"
            name="first_name"
            placeholder="first name"
            required
            onChange={handleReservationChange}
            value={reservations.first_name}
          />
        </label>

        <label htmlFor="last_name">
          Last Name:
          <input
            id="last_name"
            name="last_name"
            placeholder="last name"
            required
            onChange={handleReservationChange}
            value={reservations.last_name}
          />
        </label>

        <label htmlFor="mobile_number">
          Mobile number:
          <input
            id="mobile_number"
            placeholder="000-000-0000"
            name="mobile_number"
            required
            //pattern="\d{3}[\-]\d{3}[\-]\d{4}"
            onChange={handleReservationChange}
            value={reservations.mobile_number}
          />
        </label>

        <label htmlFor="reservation_date">
          Date of reservation:
          <input
            id="reservation_date"
            type="date"
            name="reservation_date"
            //min={today()}
            required
            onChange={handleReservationChange}
            value={reservations.reservation_date}
          />
        </label>

        <label htmlFor="reservation_time">
          Time of reservation:
          <input
            id="reservation_time"
            type="time"
            name="reservation_time"
            required
            onChange={handleReservationChange}
            value={reservations.reservation_time}
          />
        </label>

        <label htmlFor="people">
          Number of people in the party:
          <input
            placeholder="1-9"
            id="people"
            min="1"
            max="9"
            type="number"
            name="people"
            required
            onChange={handleReservationChange}
            value={reservations.people}
          />
        </label>

        <button className="btn btn-danger" type="button" onClick={history.goBack}>
          Cancel
        </button>

        <button className="btn btn-primary" type="submit" >
          Submit
        </button>
      </form>
      <ErrorAlert error={reservationsError} />
    </div>
  );
}
