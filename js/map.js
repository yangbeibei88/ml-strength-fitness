var allClubsMap = L.map("all-clubs-map").setView(
  [-27.46999909275738, 153.02458219480854],
  10
);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(allClubsMap);

// fetch clubs geojson file data
async function fetchClubsGeoData() {
  const clubsGeoRes = await fetch("../data/clubsgeo.json");
  const clubsGeoData = await clubsGeoRes.json();
  console.log(clubsGeoData);
  return clubsGeoData;
}

const formSearchClub = document.getElementById("club-search");
const searchClubInput = document.getElementById("search-club");
// add all clubs markers to clubs.html
async function addClubsMarker() {
  const clubsGeoJsonData = await fetchClubsGeoData();

  // https://leafletjs.com/examples/geojson/
  // The onEachFeature option is a function that gets called on each feature before adding it to a GeoJSON layer. A common reason to use this option is to attach a popup to features when they are clicked.
  function onEachFeature(feature, layer) {
    const popupContent = `
    <h5>${feature.properties.name}</h5>
    <ul class="unstyled">
    <li class="address">${Object.values(feature.properties.club_location).join(
      " "
    )}</li>
    <li class="phone"><a href="tel:${feature.properties.phone
      .match(/\d+/gi)
      .join("")}">${feature.properties.phone}</a></li>
    <li class="openhours">${feature.properties.hours}</li>
    </ul>
    `;
    layer.bindPopup(popupContent);
  }

  if (
    window.location.pathname === "/html/clubs.html" ||
    window.location.pathname === "/html/clubs"
  ) {
    // in clubs.html, display all clubs'markers, without popup
    L.geoJSON(clubsGeoJsonData, {
      onEachFeature: onEachFeature,
    }).addTo(allClubsMap);
    formSearchClub.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputText = searchClubInput.value.toLowerCase();
      const inputTermArr = inputText.split(/\W+/gi);

      console.log(inputText);
      console.log(inputText.split(/\W+/gi));
      clubsGeoJsonData.features.forEach((feature) => {
        const clubSuburb =
          feature.properties.club_location.club_suburb.toLowerCase();
        const clubPostcode =
          feature.properties.club_location.club_postcode.toLowerCase();
        const suburbSplitArr = clubSuburb.split(/\W+/gi);
        inputTermArr.forEach((inputTerm) => {
          if (
            suburbSplitArr.indexOf(inputTerm) > -1 ||
            inputText === clubPostcode
          ) {
            L.geoJSON(feature, { onEachFeature: onEachFeature })
              .addTo(allClubsMap)
              .eachLayer((layer) => layer.openPopup());

            // set searched club geo to center, zoom 11
            allClubsMap.setView(
              Array(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
              ),
              11
            );
            console.log(
              Array(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
              )
            );
          }
        });
      });

      const clubCards = Array.from(
        document.querySelectorAll(".club-location-card")
      );
      clubCards.forEach((clubCard) => {
        const clubcardSuburb = clubCard.getAttribute("data-clubsuburb");
        const clubcardPostcode = clubCard.getAttribute("data-clubpostcode");
        const suburbSplitArr = clubcardSuburb.split(/\W+/gi);

        inputTermArr.forEach((inputTerm) => {
          if (
            suburbSplitArr.indexOf(inputTerm) > -1 ||
            inputText === clubcardPostcode ||
            inputText === ""
          ) {
            clubCard.style.display = "block";
          } else {
            clubCard.style.display = "none";
          }
        });
      });
    });
  } else if (window.location.pathname === "/html/club.html") {
    // in each club.html, display the club's marker & popup
    clubsGeoJsonData.features.forEach((feature) => {
      if (feature.properties.storeid == urlParams.get("clubid")) {
        L.geoJSON(feature, { onEachFeature: onEachFeature })
          .addTo(allClubsMap)
          .eachLayer((layer) => layer.openPopup());
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", addClubsMarker);
