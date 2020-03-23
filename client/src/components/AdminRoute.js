import React from "react";
import API from "../utils/API.js";
import { Route, Redirect } from "react-router-dom";

export const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        if (!API.isAdmin()) {
        return <Redirect to="/" />;
      } else {
        return <Component {...props} />;
      }
    }}
  />
);