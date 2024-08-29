mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinate, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    style:"mapbox://styles/mapbox/streets-v12",
    zoom: 9 // starting zoom
});

const marker=new mapboxgl.Marker({color: "red"})
.setLngLat(coordinate)
 .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<p>Exact location provided after booking</p>"))
 .addTo(map);