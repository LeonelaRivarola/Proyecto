import { useEffect } from "react";

const EditarMapa = ({ map, geojsonData, onData, handleOverlayToGeoJSON }) => {
  useEffect(() => {
    if (!map || !geojsonData) return;

    const geojson = typeof geojsonData === "string"
      ? JSON.parse(geojsonData)
      : geojsonData;

    map.data.addGeoJson(geojson);
    map.data.setStyle({ editable: true, draggable: true });

    map.data.addListener("addfeature", (event) => {
      if (onData) {
        const data = map.data.toGeoJson((json) => {
          onData(JSON.stringify(json));
        });
      }
    });

    return () => {
      map.data.forEach((feature) => map.data.remove(feature));
    };
  }, [map, geojsonData]);

  return null;
};

export default EditarMapa;
