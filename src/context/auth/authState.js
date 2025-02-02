import React, { useReducer } from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';

import {
    USER_IN_SESSION,
    LOGOUT,
    SUCCESS_LOGIN,
    ERROR_LOGIN,
    LOADING,
    SUCCESS_PROFILE_UPDATE,
    MESSAGE,
} from '../../types';
import authToken from '../../config/authToken';
import axiosClient from '../../config/axios';
import { handleResponseError } from "../../Shared/utils"

/**maneja las peticiones asociadas a la autenticacion,
 * ademas de que almacena y globaliza el usuario en sesion
 * 
 * @param {*} props 
 * @returns 
 */
const AuthState = props => {

    const initialState = {
        token: localStorage.getItem('token'),
        authenticated: null,
        user: null,
        message: null,
        loading: false,
    }

    //crea el dispatch y el state
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    //funciones que modifican el state
    const login = async (email, password) => {
        dispatch({ type: LOADING, payload: true });

        const formattedData = {
            correo: email,
            contrasenia: password
        }
        try {
            const res = await axiosClient.post("/api/auth/token", formattedData);

            if (res.data.state) {
                authToken(res.data.token);
                dispatch({ type: SUCCESS_LOGIN, payload: res.data.token });
                authenticatedUser();
            } else {

                dispatch({
                    type: ERROR_LOGIN, payload: {
                        text: res.data.message,
                        showIn: "loginForm",
                        category: "error"

                    }
                });

            }

        } catch (error) {

            let text = handleResponseError(error)
            dispatch({
                type: ERROR_LOGIN, payload:
                {
                    text: text,
                    showIn: "loginForm",
                    category: "error"

                }

            });

        }

    }

    const logout = () => {
        dispatch({ type: LOGOUT });
    }

    const authenticatedUser = async () => {
        let token = localStorage.getItem("token");
        authToken(token);

        try {

            const res = await axiosClient.get("/api/auth");
            dispatch({ type: USER_IN_SESSION, payload: res.data.data });

        } catch (error) {

            localStorage.removeItem("token");
            dispatch({ type: ERROR_LOGIN });
        }

    }
    const updateUserData = async (data) => {

        dispatch({ type: LOADING, payload: true });

        try {

            const res = await axiosClient.put("/api/employees/profile", data);
            if (res.data.state) {

                dispatch({
                    type: SUCCESS_PROFILE_UPDATE, payload: {
                        text: res.data.message,
                        showIn: "profile",
                        category: "success"

                    }
                });
                authenticatedUser();
            } else {
                dispatch({
                    type: MESSAGE, payload: {
                        text: res.data.message,
                        showIn: "profile",
                        category: "error"

                    }
                });
            }

        } catch (error) {

            let text = handleResponseError(error);
            dispatch({
                type: MESSAGE, payload: {
                    text: text,
                    showIn: "profile",
                    category: "error"

                }
            });
        }
    }

    const updateUserPassword = async (actualPassword, newPassword) => {
        try {

            const res = await axiosClient.put("/api/employees/password", { actualPassword, newPassword });
            if (res.data.state) {

                dispatch({
                    type: SUCCESS_PROFILE_UPDATE, payload: {
                        text: res.data.message,
                        showIn: "profile",
                        category: "success"

                    }
                });
            } else {
                dispatch({
                    type: MESSAGE, payload: {
                        text: res.data.message,
                        showIn: "profile",
                        category: "error"

                    }
                });
            }

        } catch (error) {
            let text = handleResponseError(error);
            dispatch({
                type: MESSAGE, payload: {
                    text: text,
                    showIn: "profile",
                    category: "error"

                }
            });
        }
    }
    const handleAuthMessage = async (data) => {

        dispatch({ type: MESSAGE, payload: data });

    }
    const resetPassword = async (email) => {
        try {
            dispatch({ type: LOADING, payload: true });
            const res = await axiosClient.post("/api/employees/resetPassword", { correo: email });
            if (res.data.state) {

                dispatch({
                    type: MESSAGE, payload: {
                        text: res.data.message,
                        showIn: "recoveryForm",
                        category: "success"

                    }
                });
            } else {
                //muestra error
                dispatch({
                    type: MESSAGE, payload: {
                        text: res.data.message,
                        showIn: "recoveryForm",
                        category: "error"

                    }
                });
            }
            dispatch({ type: LOADING, payload: false });
        } catch (error) {

            dispatch({
                type: MESSAGE, payload: {
                    text: "Ha ocurrido un error al restablecer su contraseña, por favor intente mas tarde",
                    showIn: "recoveryForm",
                    category: "error"

                }
            });
        }

    }

    return (
        <AuthContext.Provider value={{
            token: state.token,
            authenticated: state.authenticated,
            user: state.user,
            message: state.message,
            loading: state.loading,
            login,
            logout,
            resetPassword,
            authenticatedUser,
            updateUserData,
            handleAuthMessage,
            updateUserPassword
        }}>
            {props.children}
        </AuthContext.Provider>

    );
}
export default AuthState;