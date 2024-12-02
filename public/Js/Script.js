const socket = io();

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

navigator.geolocation.watchPosition(
  (currPositions) => {
    const { latitude, longitude } = currPositions.coords;
    socket.emit("send-locations", { latitude, longitude });
  },
  (err) => {
    console.log(err.message);
    console.log("There is an error in evaluating the IP-based locations.");
    alert("There is an error in evaluating the IP-based locations.");
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
  }
);

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Shreyians Coding School",
}).addTo(map);




const marker = {}; // Object to store markers for each user

socket.on("received-locations", ({ id, latitude, longitude }) => {
  console.log(
    `Received Data: ${id}, Latitude: ${latitude}, Longitude: ${longitude}`
  );

  // Move the map view to the user's location
  map.setView([latitude, longitude], 16);

  // Check if a marker already exists for this user
  if (marker[id]) {
    // Update the existing marker's position
    marker[id].setLatLng([latitude, longitude]);
  } else {
    // Create a new marker for this user
    marker[id] = L.marker([latitude, longitude]).addTo(map);
  }
});


socket.on("user-disconnected", (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id];
  }
});
