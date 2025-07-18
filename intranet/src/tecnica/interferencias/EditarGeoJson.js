import React, { useEffect, useRef, useState, useCallback } from "react";

const EditarGeoJson = ({ onData, initialPosition, geojsonData }) => {
    const mapRef = useRef(null);
    const deleteBtnRef = useRef(null);
    const markerRef = useRef(null);

    const [map, setMap] = useState(null);
    const [drawingManager, setDrawingManager] = useState(null);
    const [selectedOverlay, setSelectedOverlay] = useState(null);
    const overlaysRef = useRef(new Map());
    const [overlays, setOverlays] = useState([]);

    let debounceTimer = useRef(null);
    const debounceUpdate = useCallback((callback, delay = 500) => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            callback();
        }, delay);
    }, []);

    const overlayToGeoJSON = useCallback((overlay, type) => {
        if (type === "CIRCLE") {
            const center = overlay.getCenter();
            const radius = overlay.getRadius();
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [center.lng(), center.lat()],
                },
                properties: { radius },
            };
        } else if (type === "POLYLINE") {
            const path = overlay.getPath().getArray().map((latlng) => [
                latlng.lng(),
                latlng.lat(),
            ]);
            return {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: path,
                },
                properties: {},
            };
        } else if (type === "RECTANGLE") {
            const bounds = overlay.getBounds();
            return {
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
        } else if (type === "POLYGON") {
            const coords = [overlay.getPath().getArray().map((latlng) => [
                latlng.lng(),
                latlng.lat(),
            ])];
            return {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: coords,
                },
                properties: {},
            };
        } else if (type === "MARKER") {
            const pos = overlay.getPosition();
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [pos.lng(), pos.lat()],
                },
                properties: {},
            };
        }
        return null;
    }, []);

    const updateAllOverlays = useCallback(() => {
        if (onData) {
            const features = [];
            overlaysRef.current.forEach((overlay, key) => {
                const geojsonFeature = overlayToGeoJSON(overlay, key.split('-')[0].toUpperCase());
                if (geojsonFeature) {
                    features.push(geojsonFeature);
                }
            });

            const updatedCollection = {
                type: "FeatureCollection",
                features,
            };
            onData(JSON.stringify(updatedCollection));
        }
    }, [onData, overlayToGeoJSON]);

    const setupOverlayListeners = useCallback((overlay, type, id) => {
        if (overlay._listenersSet) return;
        overlay._listenersSet = true;

        const updateCallback = () => {
            debounceUpdate(() => updateAllOverlays());
        };

        if (type === "CIRCLE") {
            overlay.addListener("center_changed", updateCallback);
            overlay.addListener("radius_changed", updateCallback);
        } else if (type === "POLYLINE" || type === "POLYGON") {
            overlay.getPath().addListener("set_at", updateCallback);
            overlay.getPath().addListener("insert_at", updateCallback);
            overlay.getPath().addListener("remove_at", updateCallback);
        } else if (type === "RECTANGLE") {
            overlay.addListener("bounds_changed", updateCallback);
        } else if (type === "MARKER") {
            overlay.addListener("dragend", () => {
                const pos = overlay.getPosition();
                window.setLatLngFormData(pos.lat(), pos.lng()); // Actualiza lat/lng al mover
                debounceUpdate(() => updateAllOverlays());
            });
        }

        overlay.addListener("click", () => {
            setSelectedOverlay(overlay);
            if (deleteBtnRef.current) deleteBtnRef.current.style.display = "block";
        });

        overlaysRef.current.set(`${type.toUpperCase()}-${id}`, overlay);
    }, [debounceUpdate, updateAllOverlays]);

    useEffect(() => {
        if (map && geojsonData) {

            overlaysRef.current.forEach(overlay => overlay.setMap(null));
            overlaysRef.current.clear();

            try {
                const featureCollection = JSON.parse(geojsonData);
                let idCounter = 0;

                const drawFeature = (feature) => {
                    const { geometry, properties } = feature;
                    let overlay = null;
                    let type = '';

                    if (geometry.type === "Point") {
                        const [lng, lat] = geometry.coordinates;

                        if (markerRef.current) {
                            markerRef.current.setMap(null);
                            overlaysRef.current.delete("MARKER-0");
                        }

                        if (properties?.radius) {

                            overlay = new window.google.maps.Circle({
                                center: { lat, lng },
                                radius: properties.radius,
                                fillColor: "#00FFFF",
                                fillOpacity: 0.3,
                                strokeWeight: 2,
                                editable: true,
                                draggable: true,
                                map,
                            });
                            type = "CIRCLE";
                        } else {

                            overlay = new window.google.maps.Marker({
                                position: { lat, lng },
                                map,
                                draggable: true,
                            });
                            markerRef.current = overlay;
                            type = "MARKER";
                        }
                    } else if (geometry.type === "LineString") {
                        const path = geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
                        overlay = new window.google.maps.Polyline({
                            path,
                            strokeColor: "#FF0000",
                            strokeWeight: 3,
                            editable: true,
                            draggable: true,
                            map,
                        });
                        type = "POLYLINE";
                    } else if (geometry.type === "Polygon") {
                        const paths = geometry.coordinates.map(ring =>
                            ring.map(([lng, lat]) => ({ lat, lng }))
                        );
                        const isRectangle = paths[0].length === 5 &&
                            paths[0][0].lat === paths[0][4].lat &&
                            paths[0][0].lng === paths[0][4].lng &&
                            paths[0][0].lat === paths[0][1].lat &&
                            paths[0][2].lat === paths[0][3].lat &&
                            paths[0][1].lng === paths[0][2].lng &&
                            paths[0][3].lng === paths[0][0].lng;

                        if (isRectangle) {
                            const southWest = paths[0][0];
                            const northEast = paths[0][2];
                            overlay = new window.google.maps.Rectangle({
                                bounds: {
                                    south: southWest.lat,
                                    west: southWest.lng,
                                    north: northEast.lat,
                                    east: northEast.lng,
                                },
                                fillColor: "#00FF00",
                                fillOpacity: 0.2,
                                strokeWeight: 2,
                                editable: true,
                                draggable: true,
                                map,
                            });
                            type = "RECTANGLE";
                        } else {
                            overlay = new window.google.maps.Polygon({
                                paths,
                                fillColor: "#00FF00",
                                fillOpacity: 0.3,
                                strokeWeight: 2,
                                editable: true,
                                draggable: true,
                                map,
                            });
                            type = "POLYGON";
                        }
                    }

                    if (overlay) {
                        setupOverlayListeners(overlay, type, idCounter++);
                    }
                };

                if (featureCollection.type === "Feature") {
                    drawFeature(featureCollection);
                } else if (featureCollection.type === "FeatureCollection") {
                    featureCollection.features.forEach(drawFeature);
                }
            } catch (e) {
                console.error("Error al parsear GeoJSON (desde useEffect):", e);
            }
        }
    }, [geojsonData, map, setupOverlayListeners]);

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
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA7Me8m0t_ztRIarrm45Uc0WKATVGgX_-Y&libraries=drawing`;
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

            overlaysRef.current.forEach(overlay => overlay.setMap(null));
            overlaysRef.current.clear();
        };
    }, []);

    const initMap = useCallback(() => {
        if (mapRef.current && !map) {
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
                    fillColor: "#00FF00",
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    editable: true,
                    draggable: true,
                },
            });

            drawingManagerInstance.setMap(mapInstance);

            window.google.maps.event.addListener(drawingManagerInstance, "overlaycomplete", (event) => {
                const type = event.type;

                if (type === "marker") {
                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                        overlaysRef.current.delete("MARKER-0");
                    }

                    const marker = event.overlay;
                    marker.setDraggable(true);
                    markerRef.current = marker;

                    overlaysRef.current.set("MARKER-0", marker);
                    setupOverlayListeners(marker, "MARKER", 0);

                    const position = marker.getPosition();
                    window.setLatLngFormData(position.lat(), position.lng());

                    debounceUpdate(() => updateAllOverlays());
                } else {
                    const overlay = event.overlay;
                    const idCounter = overlaysRef.current.size;
                    setupOverlayListeners(overlay, type, idCounter);
                    debounceUpdate(() => updateAllOverlays());
                }

            });

            mapInstance.addListener("click", () => {
                setSelectedOverlay(null);
                if (deleteBtnRef.current) deleteBtnRef.current.style.display = "none";
            });

            setMap(mapInstance);
            setDrawingManager(drawingManagerInstance);
        }
    }, [map, initialPosition, debounceUpdate, setupOverlayListeners, updateAllOverlays]);

    const handleDelete = () => {
        if (selectedOverlay) {
            selectedOverlay.setMap(null);

            let deletedKey = null;
            overlaysRef.current.forEach((overlay, key) => {
                if (overlay === selectedOverlay) {
                    deletedKey = key;
                }
            });
            if (deletedKey) {
                overlaysRef.current.delete(deletedKey);
            }

            setSelectedOverlay(null);
            if (deleteBtnRef.current) deleteBtnRef.current.style.display = "none";

            updateAllOverlays();
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