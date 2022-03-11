import React, { useState, useEffect } from "react";
import { useHistory, useParams} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservations, updateTable } from "../utils/api";

export default function SeatPage() {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const abortController = new AbortController();

  const [formData, setFormData] = useState({});
  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    readReservations(reservation_id, abortController.signal)
      .then((reservation) => setReservations(reservation))
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handleTableChange = (event) => {
    setFormData({
      ...formData,
      table_id: event.target.value,
    });
  };

  let tablesData = tables.map((table, key) => {
    if (table.reservation_id === null) {
      return (
        <option key={key} value={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });

  let tableFind = tables.find((table) => {
    return table.table_id === Number(formData.table_id);
  });
  
  const handleSubmit = (event) => {
    event.preventDefault();
      updateTable(
      {
        reservation_id: Number(reservations.reservation_id),
      },
      tableFind.table_id
    )
      .then(() => history.push(`/dashboard`))
      .catch(setTablesError);
    return () => abortController.abort();
  };

  return (
    <div>
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={reservationsError} />
      <h1>Seat Reservations</h1>
      <h3>
        # {reservation_id} - {reservations.first_name} {reservations.last_name}{" "}
        on {reservations.reservation_date} at {reservations.reservation_time}{" "}
        for {reservations.people}
      </h3>

      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id">Seat at:</label>
        <select name="table_id" id="table_id" onChange={handleTableChange}>
          <option defaultValue>Select a table</option>
          {tablesData}
        </select>
        
        <button className="btn btn-secondary">cancel</button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        
      </form>
    </div>
  );
}
