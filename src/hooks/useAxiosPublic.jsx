import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://cleanliness-and-issues.vercel.app'
})

const useAxiosPublic = () => {
    return axiosInstance;
}

export default useAxiosPublic;