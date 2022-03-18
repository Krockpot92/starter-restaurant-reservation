import { useHistory } from "react-router-dom";

export default function Form({formData, handleSubmit, setFormData}){

    const history=useHistory()

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
      };
    console.log(formData)
    return(
        <form onSubmit={handleSubmit}>
          <label htmlFor="first_name">
            First name:
            <input
              id="first_name"
              name="first_name"
              placeholder="first name"
              required
              onChange={handleChange}
              value={formData.first_name}
            />
          </label>

          <label htmlFor="last_name">
            Last Name:
            <input
              id="last_name"
              name="last_name"
              placeholder="last name"
              required
              onChange={handleChange}
              value={formData.last_name}
            />
          </label>

          <label htmlFor="mobile_number">
            Mobile number:
            <input
              id="mobile_number"
              placeholder="000-000-0000"
              name="mobile_number"
              required
              //pattern="\d{3}[\-]\d{3}[\-]\d{4}"
              onChange={handleChange}
              value={formData.mobile_number}
            />
          </label>

          <label htmlFor="reservation_date">
            Date of reservation:
            <input
              id="reservation_date"
              type="date"
              name="reservation_date"
              //min={today()}
              required
              onChange={handleChange}
              value={formData.reservation_date}
            />
          </label>

          <label htmlFor="reservation_time">
            Time of reservation:
            <input
              id="reservation_time"
              type="time"
              name="reservation_time"
              required
              onChange={handleChange}
              value={formData.reservation_time}
            />
          </label>

          <label htmlFor="people">
            Number of people in the party:
            <input
              placeholder="1-9"
              id="people"
              min="1"
              max="9"
              type="number"
              name="people"
              required
              onChange={handleChange}
              value={formData.people}
            />
          </label>

          <button className="btn btn-secondary" type="button" onClick={history.goBack}>
            Cancel
          </button>

          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
    )
}