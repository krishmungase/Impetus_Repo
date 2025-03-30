import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
// Fix for Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const HospitalMap = () => {
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [hospitalMarkers, setHospitalMarkers] = useState([]);
  const [location, setLocation] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [hospitalLimit, setHospitalLimit] = useState(5); // Default limit to 5 hospitals

  useEffect(() => {
    if (!map) {
      const mapInstance = L.map("map").setView([18.5197, 73.854], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);
      setMap(mapInstance);
    }
  }, [map]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => setUserLocation(latitude, longitude),
        () => alert("Geolocation not available!")
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  const setUserLocation = (lat, lon) => {
    if (!map) return;
    if (userMarker) map.removeLayer(userMarker);
    const marker = L.marker([lat, lon]).addTo(map).bindPopup("Your Location").openPopup();
    setUserMarker(marker);
    map.setView([lat, lon], 13);
    fetchHospitals(lat, lon);
  };

  const fetchHospitals = (lat, lon) => {
    if (!lat || !lon) {
      alert("Enter a location or use your location.");
      return;
    }
    let url = `https://overpass-api.de/api/interpreter?data=[out:json];node[%22amenity%22=%22hospital%22](around:25000,${lat},${lon});out;`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Remove existing hospital markers
        hospitalMarkers.forEach((marker) => map.removeLayer(marker));

        // Calculate distances and sort hospitals by distance
        const hospitalsWithDistance = data.elements.map((hospital) => {
          const distance = calculateDistance(lat, lon, hospital.lat, hospital.lon);
          return { ...hospital, distance };
        });

        const sortedHospitals = hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

        // Limit hospitals based on user preference
        const limitedHospitals = sortedHospitals.slice(0, hospitalLimit);

        // Add markers for the limited hospitals
        const newMarkers = limitedHospitals.map((hospital) => {
          return L.marker([hospital.lat, hospital.lon])
            .addTo(map)
            .bindPopup(hospital.tags.name || "Unknown Hospital");
        });

        setHospitalMarkers(newMarkers);
        setHospitals(limitedHospitals);
      })
      .catch((err) => console.error("Error fetching hospitals:", err));
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in kilometers
  };

  const handleLocationInput = (e) => {
    setLocation(e.target.value);
    if (e.target.value.length < 3) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUserLocation(data[0].lat, data[0].lon);
        } else {
          alert("No results found for the entered location.");
        }
      })
      .catch((err) => console.error("Error fetching location suggestions:", err));
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen">
      {/* Navbar */}
      <div className="h-20"></div>
      <nav className="bg-gradient-to-tr from-blue-50 to-blue-100 text-blue-600 p-4 ">
        <h1 className="text-xl font-bold">Hospital Finder</h1>
      </nav>

      {/* Main Content */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Nearest Hospitals</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={getUserLocation}>
            📍 Use My Location
          </button>
          <input
            type="text"
            value={location}
            onChange={handleLocationInput}
            className="px-4 py-2 border rounded w-full md:w-auto"
            placeholder="Search a location"
          />
          <select
            value={hospitalLimit}
            onChange={(e) => setHospitalLimit(Number(e.target.value))}
            className="px-4 py-2 border rounded w-full md:w-auto"
          >
            <option value={3}>Show 3 Hospitals</option>
            <option value={5}>Show 5 Hospitals</option>
            <option value={7}>Show 7 Hospitals</option>
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (userMarker) {
                const { lat, lng } = userMarker.getLatLng();
                fetchHospitals(lat, lng);
              } else {
                alert("Please set a location first.");
              }
            }}
          >
            🔍 Search
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          {/* Map Section */}
          <div id="map" className="w-full md:w-2/3 h-[calc(100vh-150px)] rounded shadow mb-4 md:mb-0"></div>

          {/* Hospital List Section */}
          <div className="w-full md:w-1/3 bg-white p-4 rounded shadow overflow-y-auto max-h-[calc(100vh-150px)]">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hospitals Nearby</h3>
            {hospitals.length > 0 ? (
              <ul className="space-y-4">
                {hospitals.map((hospital, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded shadow hover:bg-gray-100 transition"
                  >
                    <h4 className="text-md font-bold text-blue-600">
                      {hospital.tags.name || "Unknown Hospital"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {hospital.tags["addr:full"] ||
                        hospital.tags["addr:street"] ||
                        "Address not available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Distance: {hospital.distance} km
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hospitals found. Try searching a different location.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;