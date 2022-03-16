import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import New from "../new/New"
import NewTable from "../newTable/NewTable"
import SeatPage from "../SeatPage/SeatPage"
import Search from "../Search/Search"
import Edit from "../edit/Edit";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  let date= query.get("date")
  let mobile_number = query.get("mobile_number")

  if (date===null){
    date = today()
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>
      <Route path="/reservations/new">
        <New />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatPage />
      </Route>
      <Route path="/search">
        <Search mobile_number={mobile_number}/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <Edit />
      </Route>
      <Route>
        <NotFound  />
      </Route>
    </Switch>
  );
}

export default Routes;
