import MainHeader from "@/components/layout/MainHeader";
import MainFooter from "@/components/layout/MainFooter";
import HomePage from "@/containers/HomePage/HomePage";
import { createContext, useState } from "react";
import { DestinationProps } from "@/components/destination/AddDestination";

export type MainContextType = {
    listCoordinates: [number, number][];
    setListCoordinates: (_args: any) => void;
    listDestination: DestinationProps[];
    setListDestination: (_args: any) => void;
    shipRoutes: any;
    setShipRoutes: (_args: any) => void;
};

export const MainContext = createContext<MainContextType>({
    listCoordinates: [],
    setListCoordinates: (_args: any) => {},
    listDestination: [],
    setListDestination: (_args: any) => {},
    shipRoutes: null,
    setShipRoutes: (_args: any) => {},
});

export default function Home() {
    const [listCoordinates, setListCoordinates] = useState<[number, number][]>(
        []
    );
    const [listDestination, setListDestination] = useState<DestinationProps[]>(
        []
    );
    const [shipRoutes, setShipRoutes] = useState<any>(null);
    return (
        <MainContext.Provider
            value={{
                listCoordinates,
                setListCoordinates,
                listDestination,
                setListDestination,
                shipRoutes,
                setShipRoutes,
            }}
        >
            <MainHeader />
            <HomePage />
            <MainFooter />
        </MainContext.Provider>
    );
}
