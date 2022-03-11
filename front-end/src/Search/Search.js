import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

export default function New() {

    const initialState = {
      mobile_number: "",
    };
  
    const [formData, setFormData] = useState(initialState);

    return (
        <main>
          <h1>Search</h1>
          <div className="d-md-flex mb-3">
            <form >

              <label htmlFor="mobile_number">
                Mobile number:
                <input
                  id="mobile_number"
                  placeholder="000-000-0000"
                  name="mobile_number"
                  required
                  //pattern="\d{3}[\-]\d{3}[\-]\d{4}"
                //   onChange={handleReservationChange}
                //   value={formData.mobile_number}
                />
              </label>
    
              <button className="btn btn-primary" type="submit">
                Find
              </button>
            </form>
          </div>
          
          {/* <ErrorAlert error={reservationsError} /> */}
        </main>
      );

}

