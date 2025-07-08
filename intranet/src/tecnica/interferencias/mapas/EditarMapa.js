import { useEffect } from "react";

const EditarMapa = ({ map, geojsonData, onData, handleOverlayToGeoJSON }) => {
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
                                map,
                                editable: true,
                                draggable: true,
                            });
                            handleOverlayToGeoJSON(circle, "CIRCLE");
                        }

                    } else if (geometry.type === "LineString") {
                        const path = geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
                        const polyline = new window.google.maps.Polyline({
                            path,
                            map,
                            editable: true,
                            draggable: true,
                        });
                        handleOverlayToGeoJSON(polyline, "POLYLINE");

                    } else if (geometry.type === "Polygon") {
                        const paths = geometry.coordinates.map(ring =>
                            ring.map(([lng, lat]) => ({ lat, lng }))
                        );
                        const polygon = new window.google.maps.Polygon({
                            paths,
                            map,
                            editable: true,
                            draggable: true,
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
                console.error("Error al parsear GeoJSON:", e);
            }
        }
    }, [geojsonData, map]);

    return null;
}

export default EditarMapa
