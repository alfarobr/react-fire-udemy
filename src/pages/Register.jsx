import { useState } from "react";

import { register } from "../config/firebase";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";

import { Box } from "@mui/system";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";

const Register = () => {
    const { user } = useUserContext();
    useRedirectActiveUser(user, "/dashboard");

    // Envía formulario
    const onSubmit = async (
        { email, password },
        { setSubmitting, setErrors, resetForm }
    ) => {
        try {
            const credentialUser = await register({ email, password });
            console.log(credentialUser);
            resetForm();
        } catch (error) {
            console.log(error);
            if (error.code === "auth/email-already-in-use") {
                setErrors({ email: "Email already in use" });
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
                Registrar
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
                            label="Ingrese email"
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
                            Regístrarme
                        </LoadingButton>

                        <Button fullWidth component={Link} to="/">
                            ¿Tienes una cuenta? Inicia sesión.
                        </Button>
                    </Box>
                )}
            </Formik>
        </Box>
    );
};

export default Register;
