import { useEffect } from "react";

const EditarMapa = ({ map, geojsonData, onData, handleOverlayToGeoJSON }) => {
    useEffect(() => {
        if (!map || !geojsonData) return;

        // Evita redibujar si ya fueron cargadas
        if (map.__figurasCargadas) return;
        map.__figurasCargadas = true;

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
                        title: "Punto guardado",
                    });
                    handleOverlayToGeoJSON(marker, "MARKER");

                    if (properties && properties.radius) {
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

        } catch (error) {
            console.error("Error al parsear geojsonData:", error);
        }
    }, [map, geojsonData, onData, handleOverlayToGeoJSON]);

    return null; 
};


export default EditarMapa
