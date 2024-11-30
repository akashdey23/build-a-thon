// Initialize the map with default coordinates
const map = L.map('map').setView([51.505, -0.09], 13); // Default location: London

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// HTML elements
const statusElem = document.getElementById("status");
const addressElem = document.getElementById("address");
const complaintForm = document.getElementById("complaint-form");
const confirmationMessage = document.getElementById("confirmation-message");

// Function to fetch and display location
function getLocation() {
    if (navigator.geolocation) {
        statusElem.textContent = "Fetching your location...";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Update map view and add marker
                map.setView([latitude, longitude], 15);
                L.marker([latitude, longitude]).addTo(map).bindPopup("You are here!").openPopup();

                // Reverse geocoding to get address
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then((response) => response.json())
                    .then((data) => {
                        addressElem.textContent = `Address: ${data.display_name}`;
                        statusElem.textContent = "Your location is displayed on the map!";
                    })
                    .catch((err) => {
                        addressElem.textContent = "Unable to fetch address.";
                        statusElem.textContent = "Error fetching address.";
                        console.error(err);
                    });
            },
            (error) => {
                statusElem.textContent = "Error: Unable to fetch location.";
                addressElem.textContent = "Please enable location permissions.";
                console.error(error);
            }
        );
    } else {
        statusElem.textContent = "Geolocation is not supported by this browser.";
    }
}

// Add event listener to the button
document.getElementById("get-location").addEventListener("click", getLocation);

// Form submission handling
complaintForm.addEventListener("submit", (e) => {
    e.preventDefault();
    confirmationMessage.classList.remove("hidden");
    setTimeout(() => {
        confirmationMessage.classList.add("hidden");
    }, 5000);
});
