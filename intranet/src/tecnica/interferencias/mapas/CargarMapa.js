import React from 'react'

const CargarMapa = ({ map, onData, setSelectedOverlay, deleteBtnRef }) => {
    useEffect(() => {
        if (!map) return;

        const drawingManager = new window.google.maps.drawing.DrawingManager({
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
            polylineOptions: { strokeColor: "#FF0000", editable: true, draggable: true },
            markerOptions: { draggable: true },
            circleOptions: { fillColor: "#00FFFF", editable: true, draggable: true },
            rectangleOptions: { fillColor: "#00FF00", editable: true, draggable: true },
        });

        drawingManager.setMap(map);

        window.google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
            const overlay = event.overlay;
            setSelectedOverlay(overlay);

            if (deleteBtnRef.current) {
                deleteBtnRef.current.style.display = "block";
            }

            let geojsonFeature;

            switch (event.type) {
                case window.google.maps.drawing.OverlayType.MARKER:
                    geojsonFeature = {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [
                                overlay.getPosition().lng(),
                                overlay.getPosition().lat(),
                            ],
                        },
                        properties: {},
                    };
                    break;
                case window.google.maps.drawing.OverlayType.CIRCLE:
                    geojsonFeature = {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [
                                overlay.getCenter().lng(),
                                overlay.getCenter().lat(),
                            ],
                        },
                        properties: { radius: overlay.getRadius() },
                    };
                    break;
                case window.google.maps.drawing.OverlayType.RECTANGLE:
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
                    break;
                case window.google.maps.drawing.OverlayType.POLYLINE:
                    const coords = overlay.getPath().getArray().map((latlng) => [
                        latlng.lng(),
                        latlng.lat(),
                    ]);
                    geojsonFeature = {
                        type: "Feature",
                        geometry: { type: "LineString", coordinates: coords },
                        properties: {},
                    };
                    break;
            }

            if (onData && geojsonFeature) {
                onData(JSON.stringify(geojsonFeature));
            }
        });

        return () => drawingManager.setMap(null);
    }, [map]);

    return null;
}

export default CargarMapa
