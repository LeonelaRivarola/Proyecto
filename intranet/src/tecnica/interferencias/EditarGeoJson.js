import React, { useEffect, useRef, useState } from "react";

const EditarGeoJson = ({ onData, initialPosition, geojsonData }) => {
    const mapRef = useRef(null);
    const deleteBtnRef = useRef(null);

    const [map, setMap] = useState(null);
    const [drawingManager, setDrawingManager] = useState(null);
    const [selectedOverlay, setSelectedOverlay] = useState(null);
    const [localGeojson, setLocalGeojson] = useState(geojsonData);

    // Sync localGeojson with prop
    useEffect(() => {
        setLocalGeojson(geojsonData);
    }, [geojsonData]);

    // Debounce para evitar múltiples llamadas
    let debounceTimer = useRef(null);
    const debounceUpdate = (callback, delay = 500) => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            callback();
        }, delay);
    };

    const addFeatureToGeoJSON = (feature) => {
        try {
            let current = localGeojson ? JSON.parse(localGeojson) : null;
            let features = [];

            if (current && current.type === "FeatureCollection") {
                features = current.features;
            } else if (current && current.type === "Feature") {
                features = [current];
            }

            features.push(feature);

            const updatedCollection = {
                type: "FeatureCollection",
                features,
            };

            const updatedJSON = JSON.stringify(updatedCollection);
            setLocalGeojson(updatedJSON);
            onData && onData(updatedJSON);
        } catch (e) {
            const fallback = {
                type: "FeatureCollection",
                features: [feature],
            };
            const fallbackJSON = JSON.stringify(fallback);
            setLocalGeojson(fallbackJSON);
            onData && onData(fallbackJSON);
        }
    };

    const handleOverlayToGeoJSON = (overlay, type) => {
        if (overlay._listenersSet) return;
        overlay._listenersSet = true;

        if (type === "CIRCLE") {
            overlay.addListener("center_changed", () =>
                debounceUpdate(() => updateCircle(overlay))
            );
            overlay.addListener("radius_changed", () =>
                debounceUpdate(() => updateCircle(overlay))
            );
        } else if (type === "POLYLINE") {
            overlay.getPath().addListener("set_at", () =>
                debounceUpdate(() => updatePolyline(overlay))
            );
            overlay.getPath().addListener("insert_at", () =>
                debounceUpdate(() => updatePolyline(overlay))
            );
        } else if (type === "RECTANGLE") {
            overlay.addListener("bounds_changed", () =>
                debounceUpdate(() => updateRectangle(overlay))
            );
        } else if (type === "POLYGON") {
            overlay.getPath().addListener("set_at", () =>
                debounceUpdate(() => updatePolygon(overlay))
            );
            overlay.getPath().addListener("insert_at", () =>
                debounceUpdate(() => updatePolygon(overlay))
            );
        } else if (type === "MARKER") {
            overlay.addListener("dragend", () => {
                const pos = overlay.getPosition();
                const feature = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [pos.lng(), pos.lat()],
                    },
                    properties: {},
                };
                addFeatureToGeoJSON(feature);
            });
        }
    };

    const updateCircle = (circle) => {
        const center = circle.getCenter();
        const radius = circle.getRadius();
        const feature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [center.lng(), center.lat()],
            },
            properties: { radius },
        };
        addFeatureToGeoJSON(feature);
    };

    const updatePolyline = (polyline) => {
        const path = polyline.getPath().getArray().map((latlng) => [
            latlng.lng(),
            latlng.lat(),
        ]);
        const feature = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: path,
            },
            properties: {},
        };
        addFeatureToGeoJSON(feature);
    };

    const updateRectangle = (rectangle) => {
        const bounds = rectangle.getBounds();
        const feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
                    [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()],
                    [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()],
                    [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
                    [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
                ]],
            },
            properties: {},
        };
        addFeatureToGeoJSON(feature);
    };

    const updatePolygon = (polygon) => {
        const coords = [polygon.getPath().getArray().map((latlng) => [
            latlng.lng(),
            latlng.lat(),
        ])];
        const feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: coords,
            },
            properties: {},
        };
        addFeatureToGeoJSON(feature);
    };

    useEffect(() => {
        if (!window.google) {
            const script = document.createElement("script");
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA_TMQ1qzW06reNAT9l-3Kn89omHwEdNGI&libraries=drawing";
            script.async = true;
            script.defer = true;
            script.onload = () => initMap();
            document.head.appendChild(script);
        } else {
            initMap();
        }

        return () => {
            if (deleteBtnRef.current) deleteBtnRef.current.style.display = "none";
            if (mapRef.current) mapRef.current.innerHTML = "";
        };
    }, []);

    const initMap = () => {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: initialPosition || { lat: -34.6037, lng: -58.3816 },
            zoom: 15,
        });

        const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
            drawingControl: true,
            drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    window.google.maps.drawing.OverlayType.MARKER,
                    window.google.maps.drawing.OverlayType.CIRCLE,
                    window.google.maps.drawing.OverlayType.RECTANGLE,
                    window.google.maps.drawing.OverlayType.POLYLINE,
                    window.google.maps.drawing.OverlayType.POLYGON,
                ],
            },
            markerOptions: { draggable: true },
            circleOptions: {
                fillColor: "#00FFFF",
                fillOpacity: 0.3,
                strokeWeight: 2,
                editable: true,
                draggable: true,
            },
            rectangleOptions: {
                fillColor: "#00FF00",
                fillOpacity: 0.2,
                strokeWeight: 2,
                editable: true,
                draggable: true,
            },
            polylineOptions: {
                strokeColor: "#FF0000",
                strokeWeight: 3,
                editable: true,
                draggable: true,
            },
            polygonOptions: {
                fillColor: "#FF00FF",
                fillOpacity: 0.3,
                strokeWeight: 2,
                editable: true,
                draggable: true,
            },
        });

        drawingManagerInstance.setMap(mapInstance);

        window.google.maps.event.addListener(drawingManagerInstance, "overlaycomplete", (event) => {
            const overlay = event.overlay;

            overlay.addListener("click", () => {
                setSelectedOverlay(overlay);
                if (deleteBtnRef.current) deleteBtnRefRef.current.style.display = "block";
            });

            handleOverlayToGeoJSON(overlay, event.type);

            // Convert to GeoJSON manually
            let feature = null;
            if (event.type === "MARKER") {
                const pos = overlay.getPosition();
                feature = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [pos.lng(), pos.lat()],
                    },
                    properties: {},
                };
            } else if (event.type === "CIRCLE") {
                const center = overlay.getCenter();
                feature = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [center.lng(), center.lat()],
                    },
                    properties: { radius: overlay.getRadius() },
                };
            } else if (event.type === "RECTANGLE") {
                const bounds = overlay.getBounds();
                feature = {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [[
                            [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
                            [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()],
                            [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()],
                            [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
                            [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
                        ]],
                    },
                    properties: {},
                };
            } else if (event.type === "POLYLINE") {
                const path = overlay.getPath().getArray().map((latlng) => [latlng.lng(), latlng.lat()]);
                feature = {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: path,
                    },
                    properties: {},
                };
            } else if (event.type === "POLYGON") {
                const coords = [overlay.getPath().getArray().map((latlng) => [latlng.lng(), latlng.lat()])];
                feature = {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: coords,
                    },
                    properties: {},
                };
            }

            if (feature) addFeatureToGeoJSON(feature);
        });

        setMap(mapInstance);
        setDrawingManager(drawingManagerInstance);
    };

    const handleDelete = () => {
        if (selectedOverlay) {
            selectedOverlay.setMap(null);
            setSelectedOverlay(null);
            if (deleteBtnRef.current) deleteBtnRef.current.style.display = "none";
            // Aquí podrías también quitar del GeoJSON si tenés identificadores.
        }
    };

    return (
        <div style={{ height: "500px", width: "100%", position: "relative" }}>
            <div ref={mapRef} style={{ height: "100%" }} />
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
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    display: "none",
                    zIndex: 5,
                }}
            >
                Eliminar figura
            </button>
        </div>
    );
};

export default EditarGeoJson;
