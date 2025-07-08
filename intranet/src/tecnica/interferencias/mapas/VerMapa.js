import React, { useEffect, useRef, useState } from "react";
import CargarMapa from "./CargarMapa";
import EditarMapa from "./EditarMapa";

const VerMapa = ({ onData, initialPosition, geojsonData, modoEdicion }) => {
    const mapRef = useRef(null);
    const deleteBtnRef = useRef(null);

    const [map, setMap] = useState(null);
    const [selectedOverlay, setSelectedOverlay] = useState(null);

    const updateCircle = (circle) => {
        const geojson = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [circle.getCenter().lng(), circle.getCenter().lat()],
            },
            properties: {
                radius: circle.getRadius(),
            },
        };
        onData && onData(JSON.stringify(geojson));
    };

    const updatePolyline = (polyline) => {
        const path = polyline.getPath().getArray().map(coord => [coord.lng(), coord.lat()]);
        const geojson = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: path,
            },
            properties: {},
        };
        onData && onData(JSON.stringify(geojson));
    };

    const updateRectangle = (rectangle) => {
        const bounds = rectangle.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const geojson = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [sw.lng(), sw.lat()],
                    [ne.lng(), sw.lat()],
                    [ne.lng(), ne.lat()],
                    [sw.lng(), ne.lat()],
                    [sw.lng(), sw.lat()],
                ]],
            },
            properties: {},
        };
        onData && onData(JSON.stringify(geojson));
    };

    const updatePolygon = (polygon) => {
        const path = polygon.getPath().getArray().map(coord => [coord.lng(), coord.lat()]);
        const geojson = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [path],
            },
            properties: {},
        };
        onData && onData(JSON.stringify(geojson));
    };


    const handleOverlayToGeoJSON = (overlay, type) => {
        if (type === "CIRCLE") {
            overlay.addListener("center_changed", () => updateCircle(overlay));
            overlay.addListener("radius_changed", () => updateCircle(overlay));
        } else if (type === "POLYLINE") {
            overlay.getPath().addListener("set_at", () => updatePolyline(overlay));
            overlay.getPath().addListener("insert_at", () => updatePolyline(overlay));
        } else if (type === "RECTANGLE") {
            overlay.addListener("bounds_changed", () => updateRectangle(overlay));
        } else if (type === "POLYGON") {
            overlay.getPath().addListener("set_at", () => updatePolygon(overlay));
            overlay.getPath().addListener("insert_at", () => updatePolygon(overlay));
        } else if (type === "MARKER") {
            overlay.addListener("dragend", () => {
                const pos = overlay.getPosition();
                const geojson = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [pos.lng(), pos.lat()],
                    },
                    properties: {},
                };
                onData && onData(JSON.stringify(geojson));
            });
        }
    };

    const handleDelete = () => {
        if (selectedOverlay) {
            selectedOverlay.setMap(null);
            setSelectedOverlay(null);
            deleteBtnRef.current.style.display = "none";
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyA_TMQ1qzW06reNAT9l-3Kn89omHwEdNGI&libraries=drawing";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            const mapa = new window.google.maps.Map(mapRef.current, {
                center: initialPosition || { lat: -34.6, lng: -58.38 },
                zoom: 15,
            });

            setMap(mapa);
        };
        document.head.appendChild(script);

        return () => {
            if (mapRef.current) {
                mapRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <div style={{ height: "400px", width: "100%", position: "relative" }}>
            <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
            {map && geojsonData && (
                <EditarMapa
                    map={map}
                    geojsonData={geojsonData}
                    onData={onData}
                    handleOverlayToGeoJSON={handleOverlayToGeoJSON}
                />
            )}
            {map && modoEdicion && (
                <CargarMapa
                    map={map}
                    onData={onData}
                    setSelectedOverlay={setSelectedOverlay}
                    deleteBtnRef={deleteBtnRef}
                />
            )}
            <button
                ref={deleteBtnRef}
                onClick={handleDelete}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    padding: "8px 12px",
                    background: "red",
                    color: "white",
                    display: "none",
                    zIndex: 5,
                }}
            >
                Eliminar figura
            </button>
        </div>
    );
};

export default VerMapa
