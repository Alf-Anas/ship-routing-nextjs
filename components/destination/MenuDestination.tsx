import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useState, useEffect, useContext } from "react";
import AddDestination, { DestinationProps } from "./AddDestination";
import { MainContext } from "@/pages";
import { useQuery } from "@tanstack/react-query";
import API from "@/configs/api";
import { msToTime } from "@/utils";

const INITIAL_DESTINATION = [{}, {}];

export default function MenuDestination() {
    const [open, setOpen] = useState(false);
    const [listDestination, setListDestination] =
        useState<DestinationProps[]>(INITIAL_DESTINATION);
    const {
        setListCoordinates,
        listCoordinates,
        setShipRoutes,
        shipRoutes,
        setListDestination: setListDestinationContext,
    } = useContext(MainContext);

    function removeDest(idx: number) {
        if (idx < listDestination.length) {
            listDestination.splice(idx, 1);
            setListDestination([...listDestination]);
        }
    }
    function addDest() {
        setListDestination((oldState) => [...oldState, {}]);
    }

    function setFeature(idx: number, feature: any) {
        setListDestination((oldState) => {
            if (idx < oldState.length) {
                oldState[idx].feature = feature;
            }
            return [...oldState];
        });
    }

    useEffect(() => {
        const mListDest: any[] = [];
        const mListCoor: [number, number][] = [];
        listDestination.forEach((item) => {
            const geom = item?.feature?.geometry?.coordinates;
            if (Array.isArray(geom)) {
                mListCoor.push(geom as [number, number]);
            }
            if (item?.feature) {
                mListDest.push(item?.feature);
            }
        });
        setListCoordinates(mListCoor);
        setListDestinationContext(mListDest);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listDestination]);

    const query = useQuery(["ship-routes", listCoordinates], () =>
        API.getSeaRoute(listCoordinates)
    );

    useEffect(() => {
        const mData = query.data;
        if (!mData) return;
        setShipRoutes(mData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.data]);

    return (
        <>
            <button
                className="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm p-0.5 focus:outline-none dark:focus:ring-blue-800"
                type="button"
                onClick={() => setOpen(true)}
            >
                <Bars3Icon className="w-8 h-8" />
            </button>
            {open && (
                <div className="fixed top-0 left-0 z-40 h-screen p-4 bg-white w-80 overflow-y-auto transition-transform">
                    <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                        <InformationCircleIcon className="w-6 h-6 mr-4" />
                        Destination
                    </h5>
                    <button
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setOpen(false)}
                    >
                        <XMarkIcon />
                    </button>

                    <div className="text-center">
                        {listDestination.map((item, idx) => {
                            const mlabel =
                                idx === 0
                                    ? "From"
                                    : idx === listDestination.length - 1
                                    ? "To"
                                    : "Stop-" + idx;
                            return (
                                <AddDestination
                                    label={mlabel}
                                    key={idx}
                                    onDelete={() => removeDest(idx)}
                                    onSelect={(feature) =>
                                        setFeature(idx, feature)
                                    }
                                />
                            );
                        })}
                        <button
                            className="ml-4 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg py-1 px-2 text-sm"
                            onClick={addDest}
                        >
                            Add Destination
                        </button>
                    </div>
                    {shipRoutes && (
                        <div className="mt-8">
                            <p className="text-sm text-gray-600">
                                Distance :{" "}
                                {(shipRoutes?.properties?.distance || 0) / 1000}
                                km
                            </p>
                            <p className="text-sm text-gray-600">
                                Duration :{" "}
                                {msToTime(
                                    shipRoutes?.properties?.duration || 0
                                )}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
