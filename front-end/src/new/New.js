import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, currentTime } from "../utils/date-time";
import Form from "../form/Form"

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
        <Form formData={formData} handleSubmit={handleSubmit} setFormData={setFormData}/>
      </div>

      <div>{alerts}</div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default New;
