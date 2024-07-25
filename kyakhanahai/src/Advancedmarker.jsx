import { useEffect, useRef } from "react";

export default function AdvancedMarker({ position, map, title }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (map && !markerRef.current) {
      // Initialize the marker if it does not exist
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        title,
      });
    } else if (markerRef.current) {
      // Update marker position and title if they change
      markerRef.current.setPosition(position);
      markerRef.current.setTitle(title);
    }

    // Cleanup marker when component unmounts or map changes
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null); // Properly remove marker from map
      }
    };
  }, [map, position, title]);

  return null;
}
