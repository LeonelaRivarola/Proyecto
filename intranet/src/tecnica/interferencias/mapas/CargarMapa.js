import { useEffect } from "react";

const CargarMapa = ({ map, onData, setSelectedOverlay, deleteBtnRef }) => {
  useEffect(() => {
    if (!map || !window.google) return;

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          "marker",
          "circle",
          "polygon",
          "polyline",
          "rectangle",
        ],
      },
      markerOptions: { draggable: true },
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 0.5,
        strokeWeight: 1,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
      rectangleOptions: {
        fillColor: "#ff0000",
        fillOpacity: 0.35,
        strokeWeight: 1,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
      polylineOptions: {
        strokeColor: "#0000ff",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
      polygonOptions: {
        fillColor: "#00ff00",
        fillOpacity: 0.35,
        strokeWeight: 1,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);

    window.google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event) => {
        const overlay = event.overlay;
        const type = event.type.toUpperCase();

        overlay.type = type;
        overlay.setMap(map);

        overlay.addListener("click", () => {
          setSelectedOverlay(overlay);
          deleteBtnRef.current.style.display = "block";
        });

        setSelectedOverlay(overlay);

        const geometry = overlayToGeoJSON(overlay, type);
        if (geometry && onData) {
          onData(JSON.stringify(geometry));
        }
      }
    );

    return () => {
      drawingManager.setMap(null);
    };
  }, [map]);

  const overlayToGeoJSON = (overlay, type) => {
    switch (type) {
      case "MARKER":
        return {
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
      case "CIRCLE":
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              overlay.getCenter().lng(),
              overlay.getCenter().lat(),
            ],
          },
          properties: {
            radius: overlay.getRadius(),
          },
        };
      case "RECTANGLE":
        const bounds = overlay.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        return {
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
      case "POLYGON":
      case "POLYLINE":
        const path = overlay.getPath();
        const coords = [];
        for (let i = 0; i < path.getLength(); i++) {
          const point = path.getAt(i);
          coords.push([point.lng(), point.lat()]);
        }
        return {
          type: "Feature",
          geometry: {
            type: type === "POLYGON" ? "Polygon" : "LineString",
            coordinates: type === "POLYGON" ? [coords] : coords,
          },
          properties: {},
        };
      default:
        return null;
    }
  };

  return null;
};

export default CargarMapa;
