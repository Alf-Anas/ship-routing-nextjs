export const OSM_STYLE = {
    version: 8,
    sources: {
        osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            maxzoom: 19,
        },
    },
    layers: [
        {
            id: "osm",
            type: "raster",
            source: "osm",
        },
    ],
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
};

export const INITIAL_MAP = {
    lat: -1.217506,
    lon: 116.827447,
    zoom: 4.5,
};

export const LAYER_SRC = {
    PORT: "src-port",
    SHIP_ROUTE: "src-ship-route",
};

export const LAYER_ID = {
    SHIP_ROUTE: "layer-shiip-route-ln",
    PORT_SYMBOL: "layer-port-symbol",
    PORT_PT: "layer-port-pt",
};
