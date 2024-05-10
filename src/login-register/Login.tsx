import React, {useContext, useState} from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { login } from "../services/auth.service";
import styles from "./index.module.css";
import logo from "../pages/Login/logo.webp";
import {AuthContext} from "../hoc/AuthProvider";



type Props = {}

const Login: React.FC<Props> = () => {
  let navigate: NavigateFunction = useNavigate();
  const { signin, signout } = useContext(AuthContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: {
    name: string;
    password: string;
  } = {
    name: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = (formValue: { name: string; password: string }) => {
    const { name, password } = formValue;

    setMessage("");
    setLoading(true);

    login(name, password).then(
        (response) => {
          // Проверяем, является ли пользователь администратором
          if (response.isAdmin || response.data || response.data.isAdmin) {
            signin({ name, password }, () => {});
            localStorage.setItem("email", name);
            navigate("/admin"); // Перенаправляем администратора на страницу /admin
          } else {
            // Если пользователь не администратор, перенаправляем его на страницу /map
            signin({ name, password }, () => {});
            localStorage.setItem("email", name);
            navigate("/map");
          }
        },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
      <div className={styles.container}>
    <div className="col-md-12">
      <div className="card card-container">
        <img src={logo} alt="Логотип" className={styles.picture}/>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <Field name="name" type="text" className={`${styles.inputField} form-control`}
                     placeholder="Username" />
              <ErrorMessage
                name="username"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <Field name="password" type="password" className={`${styles.inputField} form-control`}
                     placeholder="Password" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>


            <div className="form-group">
              <button type="submit" className={`${styles.button} btn btn-primary btn-block`}
                      disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>
            <button
                    className={`${styles.button} btn btn-primary btn-block margin-top`}
                    style={{ marginTop: '20px' }}
                    disabled={loading}
                    onClick={() => window.location.href = '/registration'}>
              <span>Registration</span>
            </button>


            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  </div>
  );
};

export default Login;
