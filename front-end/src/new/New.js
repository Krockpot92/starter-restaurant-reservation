import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, currentTime } from "../utils/date-time";
//
function New() {
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked"
  };

  const [formData, setFormData] = useState(initialState);
  const [reservationsError, setReservationsError] = useState(null);

  let dateConversion = Date.parse(formData.reservation_date);
  let reservationDay = new Date(dateConversion).getDay();
  let timeConversion = formData.reservation_time.replace(":", ".")

  const history = useHistory();
  let alerts = [];

  const abortController = new AbortController();

  if(formData.reservation_date === today() && parseFloat(timeConversion)< currentTime()){
    alerts.push(<div className="alert alert-danger m-2" role="alert">
    Future reservations only please.
  </div>)
  }

  if (formData.reservation_date < today() && !isNaN(reservationDay)) {
    alerts.push(
      <div className="alert alert-danger m-2" role="alert">
        Date is in the past
      </div>
    );
  }

  if (reservationDay === 1) {
    alerts.push(
      <div className="alert alert-danger m-2" role="alert">
        Closed on Tuesdays
      </div>
    );
  }
  
  const handleReservationChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createReservation({
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile_number: formData.mobile_number,
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      people: Number(formData.people),
      status: formData.status
    })
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setReservationsError);

    return () => abortController.abort();
  };

  return (
    <main>
      <h1>New Reservation</h1>
      <div className="d-md-flex mb-3">
        <form onSubmit={handleSubmit}>
          <label htmlFor="first_name">
            First name:
            <input
              id="first_name"
              name="first_name"
              placeholder="first name"
              required
              onChange={handleReservationChange}
              value={formData.first_name}
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
              value={formData.last_name}
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
              value={formData.mobile_number}
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
              value={formData.reservation_date}
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
              value={formData.reservation_time}
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
              value={formData.people}
            />
          </label>

          <button className="btn btn-secondary" onClick={history.goBack}>
            Cancel
          </button>

          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>

      <div>{alerts}</div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default New;
