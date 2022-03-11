import { deleteTable } from "../utils/api";
import { useHistory} from "react-router-dom";

export default function WindowPop({ reservationId, tableId, table}) {
    const history= useHistory()
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
      .then(()=>window.location.reload())
    }
  }

  return (
    <button data-table-id-finish={table.table_id} className="btn btn-primary" onClick={clickHandle} type="button">
      Finish
    </button>
  );
}
