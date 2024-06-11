import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./index.module.css";
import IUser from "../types/user.type";
import { register } from "../services/auth.service";
import logo from "./logo.webp";
import { useNavigate } from "react-router-dom"; // Импорт useNavigate

const Register: React.FC = () => {
    const [successful, setSuccessful] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate(); // Создание экземпляра useNavigate

    const initialValues: IUser = {
        name: '',
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .test(
                "len",
                "The username must be between 3 and 20 characters.",
                (val: any) =>
                    val &&
                    val.toString().length >= 3 &&
                    val.toString().length <= 20
            )
            .required("Это поле является обязательным!"),
        email: Yup.string()
            .email("Это поле является обязательным.")
            .required("Это поле является обязательным!"),
        password: Yup.string()
            .test(
                "len",
                "The password must be between 6 and 40 characters.",
                (val: any) =>
                    val &&
                    val.toString().length >= 6 &&
                    val.toString().length <= 40
            )
            .required("Это поле является обязательным!"),
    });

    const handleRegister = (formValue: IUser) => {
        const { name, email, password } = formValue;

        register(name, email, password).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                navigate('/login'); // Перенаправление на /login после успешной регистрации
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setSuccessful(false);
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
                        onSubmit={handleRegister}
                    >
                        <Form>
                            {!successful && (
                                <div>
                                    <div className="form-group">
                                        <Field name="name" type="text" className={`${styles.inputField} form-control`}
                                               placeholder="Имя"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <Field name="email" type="email" className={`${styles.inputField} form-control`}
                                               placeholder="Почта"/>
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <Field
                                            name="password"
                                            type="password"
                                            className={`${styles.inputField} form-control`}
                                            placeholder="Пароль"/>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button type="submit"
                                                className={`${styles.button} btn btn-primary btn-block`}>
                                            Зарегистрироваться
                                        </button>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className="form-group">
                                    <div
                                        className={
                                            successful ? "alert alert-success" : "alert alert-danger"
                                        }
                                        role="alert"
                                    >
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

export default Register;
