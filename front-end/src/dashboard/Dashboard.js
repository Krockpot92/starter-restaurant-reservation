import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous } from "../utils/date-time";
import WindowPop from "../utils/windowPop";
import CancelWindow from "../utils/cancelWindow";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }

  let noReservations = "";
  if (reservations.length === 0) {
    noReservations = "No reservations available";
  }

  let reservationData = reservations.map((reservation, key) => {
    let seat = "";
    let edit = "";
    let cancel = "";
    let reservation_id = reservation.reservation_id;

    if (reservation.status === "booked") {
      seat = (
        <a
          href={`/reservations/${reservation.reservation_id}/seat`}
          className="btn btn-secondary pr-4 pl-4 mr-2"
        >
          Seat
        </a>
      );
      edit = (
        <a
          className="btn btn-secondary pr-4 pl-4 mr-2"
          href={`/reservations/${reservation_id}/edit`}
        >
          Edit
        </a>
      );
    }

    if (reservation.status !== "cancelled") {
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
        <td>{seat}</td>
        <td>{edit}</td>
        <td>{cancel}</td>
      </tr>
    );
  });

  let tablesData = tables.map((table, key) => {
    let isFree = "free";
    let isFinished = "";

    if (table.reservation_id != null) {
      isFree = "occupied";
      isFinished = (
        <WindowPop
          reservationId={table.reservation_id}
          tableId={table.table_id}
          table={table}
          loadDashboard={loadDashboard}
        />
      );
    }

    return (
      <tr key={key}>
        <th scope="row" key={key}>
          {table.table_id}
        </th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{isFree}</td>
        <td>{isFinished}</td>
      </tr>
    );
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <h3>{noReservations}</h3>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />

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

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">isFree?</th>
          </tr>
        </thead>
        <tbody>{tablesData}</tbody>
      </table>

      <div>
        <a
          href={`/dashboard?date=${previous(date)}`}
          className="btn btn-secondary pr-4 pl-4 mr-2"
        >
          Previous
        </a>
        <a href={`/`} className="btn btn-secondary pr-4 pl-4 mr-2">
          Today
        </a>
        <a
          href={`/dashboard?date=${next(date)}`}
          className="btn btn-secondary pr-4 pl-4 mr-2"
        >
          Next
        </a>
      </div>
    </main>
  );
}

export default Dashboard;
