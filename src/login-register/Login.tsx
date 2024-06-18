import React, {useContext, useState} from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { login } from "../services/auth.service";
import styles from "./index.module.css";
import logo from "./logo.webp";
import {AuthContext} from "../hoc/AuthProvider";
import { sendEvent } from "../utils/Metriks";



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
    name: Yup.string().required("Это поле является обязательным!"),
    password: Yup.string().required("Это поле является обязательным!"),
  });

  const handleLogin = (formValue: { name: string; password: string }) => {
    const { name, password } = formValue;

    setMessage("");
    setLoading(true);

    (login(name, password) as Promise<any>).then(
      (response) => {
        // Выводим данные респонса в консоль
        console.log("Response data:", response);
  
        // Проверяем, является ли пользователь администратором
        if ((response.data && response.data.isAdmin) || response.isAdmin) {
          signin({ name, password, isAdmin: response.isAdmin }, () => {});
          navigate("/admin"); // Перенаправляем администратора на страницу /admin
        } else {
          signin({ name, password }, () => {});
          navigate("/profile");
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

 const handleLoginClick = () => {
  sendEvent('reachGoal', 'LoginClick');
  };


  const handleRegistrationClick = () => {
    sendEvent('reachGoal', 'RegisterClick');
    window.location.href = '/registration'
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
                     placeholder="Почта" />
              <ErrorMessage
                name="username"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <Field name="password" type="password" className={`${styles.inputField} form-control`}
                     placeholder="Пароль" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>


            <div className="form-group">
              <button type="submit" className={`${styles.button} btn btn-primary btn-block` }
                      disabled={loading}
                      onClick={handleLoginClick}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Вход</span>
              </button>
            </div>
            <button
                    className={`${styles.button} btn btn-primary btn-block margin-top`}
                    style={{ marginTop: '20px' }}
                    disabled={loading}
                    onClick={handleRegistrationClick }>
              <span>Регистрация</span>
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
