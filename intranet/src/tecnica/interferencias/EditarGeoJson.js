import React, { useEffect, useRef, useState } from "react";

const EditarGeoJson = ({ onData, initialPosition, geojsonData }) => {
  const mapRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [localGeojsonData, setLocalGeojsonData] = useState(null);

  useEffect(() => {
    setLocalGeojsonData(geojsonData);
  }, [geojsonData]);

  const updateGeoJson = (updatedFeature) => {
    try {
      let current = localGeojsonData ? JSON.parse(localGeojsonData) : { type: "FeatureCollection", features: [] };
      let features = current.features || [];

      // Reemplazar figura por ID
      features = features.filter(f => f.properties?.id !== updatedFeature.properties.id);
      features.push(updatedFeature);

      const updated = {
        type: "FeatureCollection",
        features,
      };

      const jsonStr = JSON.stringify(updated);
      setLocalGeojsonData(jsonStr);
      onData?.(jsonStr);
    } catch (e) {
      const fallback = {
        type: "FeatureCollection",
        features: [updatedFeature],
      };
      const jsonStr = JSON.stringify(fallback);
      setLocalGeojsonData(jsonStr);
      onData?.(jsonStr);
    }
  };

  const debounceTimer = useRef(null);
  const debounceUpdate = (callback, delay = 500) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(callback, delay);
  };

  const wrapUpdate = (geojson, overlay) => {
    if (!geojson.properties) geojson.properties = {};
    if (!overlay._featureId) overlay._featureId = crypto.randomUUID();
    geojson.properties.id = overlay._featureId;
    updateGeoJson(geojson);
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
      properties: { radius: radius },
    };
    wrapUpdate(geojson, circle);
  };

  const updatePolyline = (polyline) => {
    const path = polyline.getPath().getArray().map((latlng) => [latlng.lng(), latlng.lat()]);
    const geojson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: path,
      },
      properties: {},
    };
    wrapUpdate(geojson, polyline);
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
    wrapUpdate(geojson, rectangle);
  };

  const updatePolygon = (polygon) => {
    const coords = [polygon.getPath().getArray().map((latlng) => [latlng.lng(), latlng.lat()])];
    const geojson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: coords,
      },
      properties: {},
    };
    wrapUpdate(geojson, polygon);
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
        wrapUpdate(geojson, overlay);
      });
    }
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
      zoom: 17,
    });

    const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          "marker",
          "circle",
          "rectangle",
          "polyline",
          "polygon",
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
        fillColor: "#0000FF",
        fillOpacity: 0.2,
        strokeWeight: 2,
        editable: true,
        draggable: true,
      },
    });

    drawingManagerInstance.setMap(mapInstance);

    window.google.maps.event.addListener(drawingManagerInstance, "overlaycomplete", (event) => {
      const overlay = event.overlay;
      const type = event.type.toUpperCase();

      const id = crypto.randomUUID();
      overlay._featureId = id;

      let geojson = null;

      switch (type) {
        case "POLYLINE":
          geojson = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: overlay.getPath().getArray().map((latlng) => [latlng.lng(), latlng.lat()]),
            },
            properties: { id },
          };
          break;
        case "MARKER":
          geojson = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [overlay.getPosition().lng(), overlay.getPosition().lat()],
            },
            properties: { id },
          };
          break;
        case "CIRCLE":
          geojson = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [overlay.getCenter().lng(), overlay.getCenter().lat()],
            },
            properties: { id, radius: overlay.getRadius() },
          };
          break;
        case "RECTANGLE":
          const bounds = overlay.getBounds();
          geojson = {
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
            properties: { id },
          };
          break;
        case "POLYGON":
          geojson = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                overlay.getPath().getArray().map((latlng) => [latlng.lng(), latlng.lat()]),
              ],
            },
            properties: { id },
          };
          break;
        default:
          return;
      }

      if (geojson) {
        handleOverlayToGeoJSON(overlay, type);
        updateGeoJson(geojson);
        overlay.addListener("click", () => {
          setSelectedOverlay(overlay);
          if (deleteBtnRef.current) deleteBtnRef.current.style.display = "block";
        });
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
    if (!selectedOverlay) return;

    const id = selectedOverlay._featureId;
    selectedOverlay.setMap(null);
    setSelectedOverlay(null);
    if (deleteBtnRef.current) deleteBtnRef.current.style.display = "none";

    try {
      let current = localGeojsonData ? JSON.parse(localGeojsonData) : { type: "FeatureCollection", features: [] };
      let features = current.features.filter(f => f.properties?.id !== id);

      const updated = {
        type: "FeatureCollection",
        features,
      };

      const jsonStr = JSON.stringify(updated);
      setLocalGeojsonData(jsonStr);
      onData?.(jsonStr);
    } catch (e) {
      console.error("Error al eliminar figura", e);
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
