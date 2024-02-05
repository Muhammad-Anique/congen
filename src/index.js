import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';




const router = createBrowserRouter([
  {
    path: "/app/login",
    element:  <Login />,
  },
  {
    path: "/app/signup",
    element:  <SignUp />,
  },
  {
    path: "/app/test",
    element:  <><h1>Hello here is the world! </h1></>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
