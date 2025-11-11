import axios from "axios";
import useAuth from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const instance = axios.create({
    baseURL: 'https://cleanliness-and-issues.vercel.app'
})

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    // set token in the header for all the api call using axiosSecure hook
    useEffect(() => {
        const requestInterceptor = instance.interceptors.request.use(async (config) => {
            if (user) {
                const token = await user.accessToken;
                if (token) {
                    config.headers.authorization = `Bearer ${token}`
                }
            }
            return config;
        })

        // response interceptor
        const responseInterceptor = instance.interceptors.response.use(res => {
            return res;
        }, async err => {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                // console.log("logout the user");
                await logOut()
                    .then(() => {
                        //navigate user to the login page
                        navigate("/login")
                    })
            }
            return Promise.reject(err);
        })

        return (() => {
            instance.interceptors.request.eject(requestInterceptor);
            instance.interceptors.response.eject(responseInterceptor);
        })

    }, [user, navigate, logOut])

    return instance;
};

export default useAxiosSecure;