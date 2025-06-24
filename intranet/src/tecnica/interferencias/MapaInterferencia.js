import React, { useEffect, useRef, useState } from "react";

const MapaInterferencia = ({ onData }) => {
  const mapRef = useRef(null);
  const deleteBtnRef = useRef(null);

  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);

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
    const defaultPos = { lat: -34.6037, lng: -58.3816 };

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 12,
    });

    // Geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.setCenter(userPos);
          mapInstance.setZoom(15);

          new window.google.maps.Marker({
            position: userPos,
            map: mapInstance,
            title: "Estás aquí",
          });
        },
        () => {
          console.warn("Geolocalización no permitida o no disponible");
        }
      );
    } else {
      console.warn("Geolocalización no soportada por el navegador");
    }

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
      polylineOptions: {
        strokeColor: "#FF0000",
        strokeWeight: 3,
        editable: true,
        draggable: true,
      },
      markerOptions: {
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

    // Evento cuando se completa un dibujo
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

        // Extraer datos según el tipo de figura
        let geometryData = null;

        if (event.type === window.google.maps.drawing.OverlayType.POLYLINE) {
          const path = overlay.getPath().getArray().map((latlng) => ({
            lat: latlng.lat(),
            lng: latlng.lng(),
          }));
          geometryData = {
            type: "polyline",
            path: path,
          };
        } else if (event.type === window.google.maps.drawing.OverlayType.MARKER) {
          geometryData = {
            type: "marker",
            position: {
              lat: overlay.getPosition().lat(),
              lng: overlay.getPosition().lng(),
            },
          };
        } else if (event.type === window.google.maps.drawing.OverlayType.CIRCLE) {
          geometryData = {
            type: "circle",
            center: {
              lat: overlay.getCenter().lat(),
              lng: overlay.getCenter().lng(),
            },
            radius: overlay.getRadius(),
          };
        } else if (event.type === window.google.maps.drawing.OverlayType.RECTANGLE) {
          const bounds = overlay.getBounds();
          geometryData = {
            type: "rectangle",
            bounds: {
              north: bounds.getNorthEast().lat(),
              east: bounds.getNorthEast().lng(),
              south: bounds.getSouthWest().lat(),
              west: bounds.getSouthWest().lng(),
            },
          };
        }

        if (geometryData && onData) {
          onData(JSON.stringify(geometryData)); // lo pasamos como string al formulario
        }
      }
    );

    // Ocultar botón borrar al hacer click en el mapa
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
    <div style={{ height: "400px", width: "100%", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
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
