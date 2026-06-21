const imageWidth = 2494;
const imageHeight = 3707;

const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 3
});

const bounds = [
    [0, 0],
    [imageHeight, imageWidth]
];

L.imageOverlay(
    'assets/faerun.png',
    bounds
).addTo(map);

map.fitBounds(bounds);

map.setMaxBounds(bounds);

L.control.measure({
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'miles',
    activeColor: '#db4a29',
    completedColor: '#9b2d14'
}).addTo(map);

fetch('pins.json')
    .then(response => response.json())
    .then(pins => {

        pins.forEach(pin => {

            const marker = L.marker([
                pin.y,
                pin.x
            ]).addTo(map);

            marker.bindPopup(`
                <h3>${pin.name}</h3>

                <a
                    class="wiki-link"
                    href="${pin.url}"
                    target="_top">

                    Otwórz stronę
                </a>
            `);
        });

    });