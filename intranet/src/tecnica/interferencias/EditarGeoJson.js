import React, { useEffect, useRef, useState } from "react";

const EditarGeoJson = ({ onData, initialPosition, geojsonData }) => {
    const mapRef = useRef(null);
    const deleteBtnRef = useRef(null);

    const [map, setMap] = useState(null);
    const [drawingManager, setDrawingManager] = useState(null);
    const [selectedOverlay, setSelectedOverlay] = useState(null);

    // Debounce para evitar múltiples llamadas seguidas a onData
    let debounceTimer = useRef(null);
    const debounceUpdate = (callback, delay = 500) => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            callback();
        }, delay);
    };

    const updateCircle = (circle) => {
        const center = circle.getCenter();
        const radius = circle.getRadius();
        const geojson = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [center.lng(), center.lat()],
            },
            properties: { radius },
        };
        if (onData) {
            try {
                let current = geojsonData ? JSON.parse(geojsonData) : null;
                let features = [];

                if (current && current.type === "FeatureCollection") {
                    features = current.features;
                } else if (current && current.type === "Feature") {
                    features = [current];
                }

                features.push(newFeature);

                const updated = {
                    type: "FeatureCollection",
                    features,
                };

                onData(JSON.stringify(updated));
            } catch (e) {
                onData(JSON.stringify({
                    type: "FeatureCollection",
                    features: [newFeature],
                }));
            }
        }
    };

    const updatePolyline = (polyline) => {
        const path = polyline.getPath().getArray().map((latlng) => [
            latlng.lng(),
            latlng.lat(),
        ]);
        const geojson = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: path,
            },
            properties: {},
        };
        if (onData) {
            try {
                let current = geojsonData ? JSON.parse(geojsonData) : null;
                let features = [];

                if (current && current.type === "FeatureCollection") {
                    features = current.features;
                } else if (current && current.type === "Feature") {
                    features = [current];
                }

                features.push(newFeature);

                const updated = {
                    type: "FeatureCollection",
                    features,
                };

                onData(JSON.stringify(updated));
            } catch (e) {
                onData(JSON.stringify({
                    type: "FeatureCollection",
                    features: [newFeature],
                }));
            }
        }
    };

    const updateRectangle = (rectangle) => {
        const bounds = rectangle.getBounds();
        const geojson = {
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
        if (onData) {
            try {
                let current = geojsonData ? JSON.parse(geojsonData) : null;
                let features = [];

                if (current && current.type === "FeatureCollection") {
                    features = current.features;
                } else if (current && current.type === "Feature") {
                    features = [current];
                }

                features.push(newFeature);

                const updated = {
                    type: "FeatureCollection",
                    features,
                };

                onData(JSON.stringify(updated));
            } catch (e) {
                onData(JSON.stringify({
                    type: "FeatureCollection",
                    features: [newFeature],
                }));
            }
        }
    };

    const updatePolygon = (polygon) => {
        const coords = [polygon.getPath().getArray().map((latlng) => [
            latlng.lng(),
            latlng.lat(),
        ])];
        const geojson = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: coords,
            },
            properties: {},
        };
        if (onData) {
            try {
                let current = geojsonData ? JSON.parse(geojsonData) : null;
                let features = [];

                if (current && current.type === "FeatureCollection") {
                    features = current.features;
                } else if (current && current.type === "Feature") {
                    features = [current];
                }

                features.push(newFeature);

                const updated = {
                    type: "FeatureCollection",
                    features,
                };

                onData(JSON.stringify(updated));
            } catch (e) {
                onData(JSON.stringify({
                    type: "FeatureCollection",
                    features: [newFeature],
                }));
            }
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

    useEffect(() => {
        if (map && geojsonData) {
            try {
                const feature = JSON.parse(geojsonData);

                const drawFeature = (feature) => {
                    const { geometry, properties } = feature;

                    if (geometry.type === "Point") {
                        const [lng, lat] = geometry.coordinates;
                        const marker = new window.google.maps.Marker({
                            position: { lat, lng },
                            map,
                            draggable: true,
                        });
                        handleOverlayToGeoJSON(marker, "MARKER");

                        if (properties?.radius) {
                            const circle = new window.google.maps.Circle({
                                center: { lat, lng },
                                radius: properties.radius,
                                fillColor: "#00FFFF",
                                fillOpacity: 0.3,
                                strokeWeight: 2,
                                editable: true,
                                draggable: true,
                                map,
                            });
                            handleOverlayToGeoJSON(circle, "CIRCLE");
                        }

                    } else if (geometry.type === "LineString") {
                        const path = geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
                        const polyline = new window.google.maps.Polyline({
                            path,
                            strokeColor: "#FF0000",
                            strokeWeight: 3,
                            editable: true,
                            draggable: true,
                            map,
                        });
                        handleOverlayToGeoJSON(polyline, "POLYLINE");

                    } else if (geometry.type === "Polygon") {
                        const paths = geometry.coordinates.map(ring =>
                            ring.map(([lng, lat]) => ({ lat, lng }))
                        );
                        const polygon = new window.google.maps.Polygon({
                            paths,
                            fillColor: "#00FF00",
                            fillOpacity: 0.3,
                            strokeWeight: 2,
                            editable: true,
                            draggable: true,
                            map,
                        });
                        handleOverlayToGeoJSON(polygon, "POLYGON");
                    }
                };

                if (feature.type === "Feature") {
                    drawFeature(feature);
                } else if (feature.type === "FeatureCollection") {
                    feature.features.forEach(drawFeature);
                }
            } catch (e) {
                console.error("Error al parsear GeoJSON (desde useEffect):", e);
            }
        }
    }, [geojsonData, map]);

    useEffect(() => {
        if (initialPosition && map) {
            map.setCenter(initialPosition);
            map.setZoom(17);
            if (!window.positionMarker) {
                window.positionMarker = new window.google.maps.Marker({
                    map,
                    position: initialPosition,
                    title: "Ubicación manual",
                });
            } else {
                window.positionMarker.setPosition(initialPosition);
            }
        }
    }, [initialPosition, map]);

    useEffect(() => {
        if (!window.google) {
            const script = document.createElement("script");
            script.src = "https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=drawing";
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
        const defaultPos = initialPosition || { lat: -34.6037, lng: -58.3816 };
        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultPos,
            zoom: 12,
        });

        const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    window.google.maps.drawing.OverlayType.MARKER,
                    window.google.maps.drawing.OverlayType.CIRCLE,
                    window.google.maps.drawing.OverlayType.RECTANGLE,
                    window.google.maps.drawing.OverlayType.POLYLINE,
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
        });

        drawingManagerInstance.setMap(mapInstance);

        window.google.maps.event.addListener(drawingManagerInstance, "overlaycomplete", (event) => {
            const overlay = event.overlay;
            overlay.addListener("click", () => {
                setSelectedOverlay(overlay);
                if (deleteBtnRef.current) deleteBtnRef.current.style.display = "block";
            });

            handleOverlayToGeoJSON(overlay, event.type);

            let geojsonFeature = null;

            if (event.type === "POLYLINE") {
                geojsonFeature = {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: overlay.getPath().getArray().map((latlng) => [latlng.lng(), latlng.lat()]),
                    },
                    properties: {},
                };
            } else if (event.type === "MARKER") {
                geojsonFeature = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [overlay.getPosition().lng(), overlay.getPosition().lat()],
                    },
                    properties: {},
                };
            } else if (event.type === "CIRCLE") {
                geojsonFeature = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [overlay.getCenter().lng(), overlay.getCenter().lat()],
                    },
                    properties: {
                        radius: overlay.getRadius(),
                    },
                };
            } else if (event.type === "RECTANGLE") {
                const bounds = overlay.getBounds();
                geojsonFeature = {
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
            }

            if (geojsonFeature && onData) {

                try {
                    let current = geojsonData ? JSON.parse(geojsonData) : null;
                    let features = [];

                    if (current && current.type === "FeatureCollection") {
                        features = current.features;
                    } else if (current && current.type === "Feature") {
                        features = [current];
                    }

                    features.push(geojsonFeature);

                    const newCollection = {
                        type: "FeatureCollection",
                        features,
                    };

                    onData(JSON.stringify(newCollection));
                } catch (e) {
                    const fallback = {
                        type: "FeatureCollection",
                        features: [geojsonFeature],
                    };
                    onData(JSON.stringify(fallback));
                }
            }
        });

        mapInstance.addListener("click", () => {
            setSelectedOverlay(null);
            if (deleteBtnRef.current) deleteBtnRef.current.style.display = "none";
        });

        setMap(mapInstance);
        setDrawingManager(drawingManagerInstance);
    };

    const handleDelete = () => {
        if (selectedOverlay) {
            selectedOverlay.setMap(null);
            setSelectedOverlay(null);
            if (deleteBtnRef.current) deleteBtnRef.current.style.display = "none";
        }
    };

    return (
        <div style={{ height: "400px", width: "100%", position: "relative" }}>
            <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
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
