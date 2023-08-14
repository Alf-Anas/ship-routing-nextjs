import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import maplibregl, { Map, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import classes from "./MainMap.module.css";
import { INITIAL_MAP, LAYER_ID, LAYER_SRC, OSM_STYLE } from "./constant";
import { MainContext } from "@/pages";
import { Spin } from "antd";
import { propertiesTableDiv } from "@/utils";

export default function HomePage({
    children,
    isLoading,
}: {
    children?: ReactNode;
    isLoading?: boolean;
}) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map | null>(null);
    const [lng] = useState(INITIAL_MAP.lon);
    const [lat] = useState(INITIAL_MAP.lat);
    const [zoom] = useState(INITIAL_MAP.zoom);
    const [mapHeight, setMapHeight] = useState("100vh");
    const { listDestination, shipRoutes } = useContext(MainContext);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return; // stops map from intializing more than once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: OSM_STYLE as StyleSpecification,
            center: [lng, lat],
            zoom: zoom,
        });

        map.current.on("load", () => {
            if (!map.current) return;
            map.current.addSource(LAYER_SRC.PORT, {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            });
            map.current.addSource(LAYER_SRC.SHIP_ROUTE, {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            });
            map.current.addLayer({
                id: LAYER_ID.SHIP_ROUTE,
                type: "line",
                source: LAYER_SRC.SHIP_ROUTE,
                paint: {
                    "line-color": "#ff6600",
                    "line-width": 2,
                },
            });
            map.current.addLayer({
                id: LAYER_ID.PORT_SYMBOL,
                type: "symbol",
                source: LAYER_SRC.PORT,
                layout: {
                    "text-field": ["get", "name"],
                    "text-variable-anchor": ["top", "bottom", "left", "right"],
                    "text-radial-offset": 0.5,
                    "text-justify": "auto",
                    "text-size": 16,
                },
                paint: {
                    "text-halo-color": "white",
                    "text-halo-width": 2,
                },
            });
            map.current.addLayer({
                id: LAYER_ID.PORT_PT,
                type: "circle",
                source: LAYER_SRC.PORT,
                paint: {
                    "circle-color": "red",
                    "circle-radius": 5,
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 2,
                },
            });

            map.current.on("click", LAYER_ID.SHIP_ROUTE, (e) => {
                if (!map.current) return;
                if (!e.features) return;

                new maplibregl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(propertiesTableDiv(e.features[0].properties))
                    .addTo(map.current);
            });

            map.current.on("click", LAYER_ID.PORT_SYMBOL, (e) => {
                if (!map.current) return;
                if (!e.features) return;

                new maplibregl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(propertiesTableDiv(e.features[0].properties))
                    .addTo(map.current);
            });

            // Change the cursor to a pointer when the mouse is over the states layer.
            map.current.on("mouseenter", LAYER_ID.PORT_SYMBOL, () => {
                if (!map.current) return;
                map.current.getCanvas().style.cursor = "pointer";
            });

            // Change it back to a pointer when it leaves.
            map.current.on("mouseleave", LAYER_ID.PORT_SYMBOL, () => {
                if (!map.current) return;
                map.current.getCanvas().style.cursor = "";
            });

            // Change the cursor to a pointer when the mouse is over the states layer.
            map.current.on("mouseenter", LAYER_ID.SHIP_ROUTE, () => {
                if (!map.current) return;
                map.current.getCanvas().style.cursor = "pointer";
            });

            // Change it back to a pointer when it leaves.
            map.current.on("mouseleave", LAYER_ID.SHIP_ROUTE, () => {
                if (!map.current) return;
                map.current.getCanvas().style.cursor = "";
            });
        });
    }, [lng, lat, zoom]);

    useEffect(() => {
        const headerElement = document.getElementById("main-layout-header");
        const footerElement = document.getElementById("main-layout-footer");

        if (headerElement?.clientHeight && footerElement?.clientHeight) {
            setMapHeight(
                `calc(100vh - ${headerElement.clientHeight}px - ${footerElement.clientHeight}px)`
            );
        }
    }, []);

    useEffect(() => {
        if (!shipRoutes) return;
        if (!map.current) return;
        const shipRouteSource = map.current.getSource(LAYER_SRC.SHIP_ROUTE);
        if (shipRouteSource) {
            shipRouteSource
                // @ts-ignore
                .setData(shipRoutes);
        }
    }, [shipRoutes]);

    useEffect(() => {
        if (listDestination.length === 0) return;
        if (!map.current) return;
        const portSource = map.current.getSource(LAYER_SRC.PORT);
        if (portSource) {
            portSource
                // @ts-ignore
                .setData({
                    type: "FeatureCollection",
                    features: listDestination,
                });
        }
    }, [listDestination]);

    return (
        <div className={classes.map_wrap} style={{ height: mapHeight }}>
            {children}
            {isLoading && <Spin size="large" className={classes.map_loading} />}
            <div ref={mapContainer} className={classes.map} />
        </div>
    );
}
