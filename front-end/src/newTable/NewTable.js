import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable() {
    const initialState = {
        table_name: "",
        capacity: "",
      };
      
  const history = useHistory();

  const [formData,setFormData] = useState(initialState)

  const [tableError, setTableError] = useState(null);
  const abortController = new AbortController();

  const handleTableChange=(event)=>{
    setFormData({
        ...formData,
        [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    createTable({
        table_name: formData.table_name,
        capacity: Number(formData.capacity)
    })
        .then(() =>history.push(`/`))
        .catch(setTableError)
     return () => abortController.abort();
  };

  return (
    <div>
      <h1>New Table</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">
          Table name
          <input
            id="table_name"
            type="text"
            name="table_name"
            minLength="2"
            required
            onChange={handleTableChange}
            value={formData.table_name}
          />
        </label>

        <label htmlFor="table_capacity">
          Table capacity
          <input
            id="table_capacity"
            type="number"
            name="capacity"
            min="1"
            required
            onChange={handleTableChange}
            value={formData.capacity}
          />
        </label>

        <button className="btn btn-secondary" onClick={history.goBack}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <ErrorAlert error={tableError} />
    </div>
  );
}
