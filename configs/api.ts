import axios from "axios";

const HOST = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

HOST.interceptors.request.use(
    (config) => {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        if (apiKey) {
            config.headers["x-api-key"] = apiKey;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

const API = {
    getPort: async (query: string | undefined) => {
        if (!query) return null;
        const { data } = await HOST.get(`/geocoding/v2/port/${query}`);
        return data;
    },
    getSeaRoute: async (listCoordinate: [number, number][]) => {
        if (listCoordinate.length < 2) return null;
        const query: string = listCoordinate
            .map((coor) => coor.join(","))
            .join(";");
        const { data } = await HOST.get(`/route/v2/sea/${query}`);
        return data;
    },
};

export default API;
