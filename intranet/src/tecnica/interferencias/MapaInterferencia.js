import React, { useEffect, useRef, useState } from "react";

const MapaInterferencia = ({ onData, initialPosition, geojsonData }) => {
  const mapRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const markerRef = useRef(null);
  const [overlays, setOverlays] = useState([]);

  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);

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
              title: "Punto guardado",
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
        console.error("Error al parsear GeoJSON (desde useEffect):", e);
      }
    }
  }, [geojsonData, map]);



  useEffect(() => {
    if (initialPosition && map) {
      map.setCenter(initialPosition);
      map.setZoom(17);

      // Opcional: poner marcador en la nueva posición
      if (!window.positionMarker) {
        window.positionMarker = new window.google.maps.Marker({
          map: map,
          position: initialPosition,
          title: "Ubicación manual",
          draggable: true,
        });

        window.positionMarker.addListener("dragend", () => {
          const pos = window.positionMarker.getPosition();
          const geojson = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pos.lng(), pos.lat()],
            },
            properties: {},
          };
          onData && onData(JSON.stringify(geojson));
          window.setLatLngFormData?.(pos.lat(), pos.lng());
        });
      } else {
        window.positionMarker.setPosition(initialPosition);
      }
    }
  }, [initialPosition, map]);



  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA7Me8m0t_ztRIarrm45Uc0WKATVGgX_-Y&libraries=drawing";
      //"https://maps.googleapis.com/maps/api/js?key=AIzaSyA_TMQ1qzW06reNAT9l-3Kn89omHwEdNGI&libraries=drawing";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }

    // Limpieza al desmontar
    return () => {
      if (deleteBtnRef.current) {
        deleteBtnRef.current.style.display = "none";
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, []);

  const initMap = () => {
    const defaultPos = initialPosition || { lat: -34.6037, lng: -58.3816 };

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 12,
    });


    const setMarker = (pos) => {

      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          position: defaultPos,
          map: mapInstance,
          title: "Marcador Único",
          draggable: true,
        });

        markerRef.current.addListener("dragend", () => {
          const pos = markerRef.current.getPosition();
          const geojson = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pos.lng(), pos.lat()],
            },
            properties: {},
          };
          onData && onData(JSON.stringify(geojson));
          window.setLatLngFormData?.(pos.lat(), pos.lng());
        });
      } else {
        markerRef.current.setPosition(defaultPos);
        markerRef.current.setMap(mapInstance);
      }

      if (!initialPosition && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setMarker(userPos);
          },
          (error) => {
            console.warn("No se pudo obtener la ubicación, usando posición por defecto:", error);
            setMarker(defaultPos);
          }
        );
      } else {
        // Si ya hay initialPosition o no hay geolocalización, usar defaultPos
        setMarker(defaultPos);
      }

      // Centrar y zoom en el marcador
      mapInstance.setCenter(markerRef.current.getPosition());
      mapInstance.setZoom(17);
    };

    const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.CIRCLE,
          window.google.maps.drawing.OverlayType.RECTANGLE,
          window.google.maps.drawing.OverlayType.POLYLINE,
          window.google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polylineOptions: {
        strokeColor: "#FF0000",
        strokeWeight: 3,
        editable: true,
        draggable: true,
      },
      circleOptions: {
        fillColor: "#00FFFF",
        fillOpacity: 0.3,
        strokeWeight: 2,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
      rectangleOptions: {
        fillColor: "#00FF00",
        fillOpacity: 0.2,
        strokeWeight: 2,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
    });

    drawingManagerInstance.setMap(mapInstance);

    window.google.maps.event.addListener(
      drawingManagerInstance,
      "overlaycomplete",
      (event) => {
        const overlay = event.overlay;

        overlay.addListener("click", () => {
          setSelectedOverlay(overlay);
          if (deleteBtnRef.current) {
            deleteBtnRef.current.style.display = "block";
          }
        });

        if (
          event.type === window.google.maps.drawing.OverlayType.CIRCLE ||
          event.type === window.google.maps.drawing.OverlayType.RECTANGLE
        ) {
          overlay.setEditable(true);
          overlay.setDraggable(true);
        }

        // Convertir overlay a geojson y enviar con onData
        let geojsonFeature = null;
        if (event.type === window.google.maps.drawing.OverlayType.POLYLINE) {
          const coords = overlay.getPath().getArray().map((latlng) => [
            latlng.lng(),
            latlng.lat(),
          ]);
          geojsonFeature = {
            type: "Feature",
            geometry: { type: "LineString", coordinates: coords },
            properties: {},
          };
        } else if (event.type === window.google.maps.drawing.OverlayType.CIRCLE) {
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
        } else if (event.type === window.google.maps.drawing.OverlayType.RECTANGLE) {
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
        } else if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
          const coords = [overlay.getPath().getArray().map(latlng => [latlng.lng(), latlng.lat()])];
          geojsonFeature = {
            type: "Feature",
            geometry: { type: "Polygon", coordinates: coords },
            properties: {},
          };
        }

        if (geojsonFeature && onData) {
          onData(JSON.stringify(geojsonFeature));
        }
      }
    );

    mapInstance.addListener("click", () => {
      setSelectedOverlay(null);
      if (deleteBtnRef.current) {
        deleteBtnRef.current.style.display = "none";
      }
    });

    setMap(mapInstance);
    setDrawingManager(drawingManagerInstance);
  };


  const handleDelete = () => {
    if (selectedOverlay) {
      selectedOverlay.setMap(null);
      setSelectedOverlay(null);
      if (deleteBtnRef.current) {
        deleteBtnRef.current.style.display = "none";
      }
    }
  };



  return (
    <div style={{ height: "400px", width: "100%", position: "relative" }}>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
      ></div>
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
}

export default MapaInterferencia
