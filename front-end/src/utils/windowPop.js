import { deleteTable } from "../utils/api";
import { useHistory} from "react-router-dom";

export default function WindowPop({ reservationId, tableId, table, loadDashboard}) {
  function clickHandle() {
    console.log("inside click handle")
    if (
      window.confirm(
        "Is this table ready to seat new guests?\n\nThis cannot be undone."
      )
    ) {
      console.log("after window confirm")
      deleteTable(
        {
          reservation_id: Number(reservationId),
        },
        tableId
      )

      .then(()=>loadDashboard())
      .then(()=> console.log("after loadDashboard"))
    }
  }

  return (
    <button data-table-id-finish={table.table_id} className="btn btn-primary" onClick={clickHandle} type="button">
      Finish
    </button>
  );
}
