import React, { useEffect, useRef, useState } from 'react';

const EditarGeoJson = ({ onData, initialPosition, geojsonData }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

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
    onData && onData(JSON.stringify(geojson));
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
    onData && onData(JSON.stringify(geojson));
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
    onData && onData(JSON.stringify(geojson));
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

  const initMap = () => {
    const defaultPos = initialPosition || { lat: -34.6037, lng: -58.3816 };
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 15,
    });
    setMap(mapInstance);
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA_TMQ1qzW06reNAT9l-3Kn89omHwEdNGI&libraries=drawing";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

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
              map: map,
              draggable: true,
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
                map: map,
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
              map: map,
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
              map: map,
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

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default EditarGeoJson;
