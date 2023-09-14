import { useEffect, useState } from "react";

import { login } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";

import { Box } from "@mui/system";
import { Avatar, TextField, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user]);

    // Envía el formulario
    const onSubmit = async (
        { email, password },
        { setSubmitting, setErrors, resetForm }
    ) => {
        //console.log({ email, password });
        try {
            const credentialUser = await login({ email, password });
            console.log(credentialUser);
            resetForm();
        } catch (error) {
            //console.log(error.code);
            //console.log(error.message);
            if (error.code === "auth/user-not-found") {
                return setErrors({ email: "Usuario no registrado" });
            }
            if (error.code === "auth/wrong-password") {
                return setErrors({ password: "Contraseña incorrecta" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Validaciones
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email no válido")
            .required("Email requerido"),
        password: Yup.string()
            .trim()
            .min(6, "Mínimo 6 caracteres")
            .required("Password requerido"),
    });

    return (
        <Box sx={{ mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center" }}>
            <Avatar sx={{ mx: "auto", bgcolor: "#444" }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" component="h1">
                Login
            </Typography>

            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({
                    values,
                    handleSubmit,
                    handleChange,
                    isSubmitting,
                    errors,
                    touched,
                    handleBlur,
                }) => (
                    <Box
                        onSubmit={handleSubmit}
                        sx={{ mt: "8px" }}
                        component="form"
                    >
                        <TextField
                            type="text"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            name="email"
                            onBlur={handleBlur}
                            id="email"
                            label="Ingrese Email"
                            fullWidth
                            sx={{ mb: 3 }}
                            error={errors.email && touched.email}
                            helperText={
                                errors.email && touched.email && errors.email
                            }
                        />

                        <TextField
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="contraseña"
                            name="password"
                            onBlur={handleBlur}
                            id="password"
                            label="Ingrese contraseña"
                            fullWidth
                            sx={{ mb: 3 }}
                            error={errors.password && touched.password}
                            helperText={
                                errors.password &&
                                touched.password &&
                                errors.password
                            }
                        />

                        <LoadingButton
                            type="submit"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            variant="contained"
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            Acceder
                        </LoadingButton>

                        <Button fullWidth component={Link} to="/register">
                            ¿No tienes cuenta?
                        </Button>
                    </Box>
                )}
            </Formik>
        </Box>
    );
};

export default Login;
