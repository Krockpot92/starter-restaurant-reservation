import { updateReservation } from "../utils/api";

export default function CancelWindow({
  reservationId,
  loadDashboard,
  reservation,
}) {
  function clickHandle() {
    if (
      window.confirm(
        "Do you want to cancel this reservation?\n\n This cannot be undone."
      )
    ) {
      console.log(reservation, reservation.first_name, reservationId);
      updateReservation(
        {
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          mobile_number: reservation.mobile_number,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          people: Number(reservation.people),
          status: "cancelled",
        },
        reservationId
      ).then(() => loadDashboard());
    }
  }

  return (
    <button
      data-reservation-id-cancel={reservation.reservation_id}
      className="btn btn-danger"
      onClick={clickHandle}
      type="button"
    >
      Cancel
    </button>
  );
}
