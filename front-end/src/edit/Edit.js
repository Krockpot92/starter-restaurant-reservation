import React, { useEffect, useState } from "react";
import { readReservations, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import formatReservationDate from "../utils/format-reservation-date"
import Form from "../form/Form"

export default function Edit() {
  const history = useHistory();
  const { reservation_id } = useParams();

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
  
  const abortController = new AbortController();

  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    readReservations(reservation_id, abortController.signal)
      .then((reservation) => {
        setFormData(formatReservationDate(reservation))
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    updateReservation(
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile_number: formData.mobile_number,
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        people: Number(formData.people),
        status: formData.status,
      },
      reservation_id
    )
      .then(() => history.push(`/dashboard/?date=${formData.reservation_date}`))
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  

  return (
    <div>
      <h1>Edit Reservation {reservation_id}</h1>
      <Form formData={formData} handleSubmit={handleSubmit} setFormData={setFormData}/>
      <ErrorAlert error={reservationsError} />
    </div>
  );
}
