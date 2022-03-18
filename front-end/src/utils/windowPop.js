import { deleteTable } from "../utils/api";

export default function WindowPop({ reservationId, tableId, table, loadDashboard}) {
  function clickHandle() {
    if (
      window.confirm(
        "Is this table ready to seat new guests?\n\nThis cannot be undone."
      )
    ) {
      deleteTable(
        {
          reservation_id: Number(reservationId),
        },
        tableId
      )

      .then(()=>loadDashboard())
    }
  }

  return (
    <button data-table-id-finish={table.table_id} className="btn btn-primary" onClick={clickHandle} type="button">
      Finish
    </button>
  );
}
