const imageWidth = 4800;
const imageHeight = 6600;

// ==========================
// MAPA
// ==========================
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -4,
    maxZoom: 4,
    zoomControl: true,
    attributionControl: false
});

const bounds = [
    [0, 0],
    [imageHeight, imageWidth]
];

// ==========================
// OBRAZ MAPY
// ==========================
L.imageOverlay(
    'assets/tellusmap.webp',
    bounds
).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds);


// ==========================
// DEFAULTOWE PINY (READ ONLY)
// ==========================
fetch('pins.json')
    .then(r => r.json())
    .then(pins => {

        pins.forEach(pin => {

            L.marker([pin.y, pin.x])
                .addTo(map)
                .bindPopup(`
                    <h3>${pin.name}</h3>
                    <a href="${pin.url}" target="_top">
                        Otwórz stronę
                    </a>
                `);
        });

    })
    .catch(err => console.error("pins.json error:", err));


// ==========================
// PANEL CZASU PODRÓŻY (D&D - MILE)
// ==========================
const PanelPodrozy = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function (map) {
        this._div = L.DomUtil.create('div', 'panel-czasu-dnd');
        
        this._div.style.backgroundColor = '#f4eae1';
        this._div.style.border = '2px solid #5c2c16';
        this._div.style.borderRadius = '8px';
        this._div.style.padding = '12px';
        this._div.style.fontFamily = 'Georgia, serif';
        this._div.style.fontSize = '13px';
        this._div.style.color = '#331a00';
        this._div.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        this._div.style.minWidth = '220px';
        
        this.update(0);
        return this._div;
    },
    update: function (dystans) {
        if (dystans === 0) {
            this._div.innerHTML = `<b style="color: #5c2c16;">Dziennik Podróży</b><br><span style="color: #666;">Użyj linijki, aby zmierzyć długośc podróży...</span>`;
            return;
        }

        const GODZIN_NA_DZIEN = 8;
        const vWolny = 2.0;    
        const vNormalny = 3.0; 
        const vSzybki = 4.0;   

        function formatujCzas(dystans, predkosc) {
            const lacznieGodzin = dystans / predkosc;
            const dni = Math.floor(lacznieGodzin / GODZIN_NA_DZIEN);
            const resztaGodzin = Math.round(lacznieGodzin % GODZIN_NA_DZIEN);
            
            let wynik = "";
            if (dni > 0) wynik += `${dni}d `;
            if (resztaGodzin > 0 || dni === 0) wynik += `${resztaGodzin}h`;
            return wynik;
        }

        this._div.innerHTML = `
            <h4 style="margin: 0 0 8px 0; color: #5c2c16; border-bottom: 1px solid #5c2c16; padding-bottom: 4px;">
                Dystans: ${dystans.toFixed(1)} mi
            </h4>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <tr style="font-weight: bold; color: #5c2c16;">
                    <th style="padding: 2px 0;">Tempo</th>
                    <th style="padding: 2px 0; text-align: right;">Czas</th>
                </tr>
                <tr style="border-bottom: 1px dotted #9c7a59;">
                    <td style="padding: 4px 0;">Wolne</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: bold;">${formatujCzas(dystans, vWolny)}</td>
                </tr>
                <tr style="border-bottom: 1px dotted #9c7a59;">
                    <td style="padding: 4px 0;">Normalne</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: bold;">${formatujCzas(dystans, vNormalny)}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0;">Szybkie</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: bold;">${formatujCzas(dystans, vSzybki)}</td>
                </tr>
            </table>
            <p style="margin: 8px 0 0 0; font-size: 10px; color: #666; text-align: center;">
                *Zakładane ${GODZIN_NA_DZIEN}h marszu na dobę
            </p>
        `;
    }
});

const panelPodrozy = new PanelPodrozy();
map.addControl(panelPodrozy);


// ==========================
// ZMIENNE GLOBALNE I PRZYCISKI INTERFEJSU
// ==========================
const SKALA_MI = 1; 

let liniaPomiaru = null;
let punktyPomiaru = [];

// Flagi stanów narzędzi
let czyMierzy = false;
let czyDodajePina = false;

// Referencje do elementów DOM przycisków
let elPrzyciskPomiaru = null;
let elPrzyciskPina = null;

// --- Przycisk Linijki ---
const PrzyciskPomiaru = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
        const kontener = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const przycisk = L.DomUtil.create('a', '', kontener);
        
        przycisk.innerHTML = '📏';
        przycisk.href = '#';
        przycisk.title = 'Włącz / Wyłącz pomiar odległości';
        przycisk.style.fontSize = '16px';
        przycisk.style.display = 'flex';
        przycisk.style.alignItems = 'center';
        przycisk.style.justifyContent = 'center';
        przycisk.style.cursor = 'pointer';
        przycisk.style.backgroundColor = '#fff';
        przycisk.style.width = '30px';
        przycisk.style.height = '30px';

        elPrzyciskPomiaru = przycisk;

        L.DomEvent.on(przycisk, 'click', function (e) {
            L.DomEvent.stop(e); // Zatrzymuje propagację i domyślne akcje przeglądarki
            przelaczTrybPomiaru();
        });

        return kontener;
    }
});

// --- Przycisk Pinezki ---
const PrzyciskNowegoPina = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
        const kontener = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const przycisk = L.DomUtil.create('a', '', kontener);
        
        przycisk.innerHTML = '📍';
        przycisk.href = '#';
        przycisk.title = 'Pobierz koordynaty JSON dla nowego punktu';
        przycisk.style.fontSize = '16px';
        przycisk.style.display = 'flex';
        przycisk.style.alignItems = 'center';
        przycisk.style.justifyContent = 'center';
        przycisk.style.cursor = 'pointer';
        przycisk.style.backgroundColor = '#fff';
        przycisk.style.width = '30px';
        przycisk.style.height = '30px';

        elPrzyciskPina = przycisk;

        L.DomEvent.on(przycisk, 'click', function (e) {
            L.DomEvent.stop(e); // Bezpieczne zatrzymanie zdarzenia
            przelaczTrybPina();
        });

        return kontener;
    }
});

map.addControl(new PrzyciskPomiaru());
map.addControl(new PrzyciskNowegoPina());


// ==========================
// KONTROLA TRYBÓW (LOGIKA)
// ==========================

function przelaczTrybPomiaru() {
    if (czyDodajePina) wylaczTrybPina(); // Jeśli drugie narzędzie działa, wyłącz je
    czyMierzy = !czyMierzy;
    
    if (czyMierzy) {
        elPrzyciskPomiaru.style.backgroundColor = '#db4a29';
        elPrzyciskPomiaru.style.color = '#fff';
        map.getContainer().style.cursor = 'crosshair';
    } else {
        wylaczTrybPomiaru();
    }
}

function wylaczTrybPomiaru() {
    czyMierzy = false;
    if (elPrzyciskPomiaru) {
        elPrzyciskPomiaru.style.backgroundColor = '#fff';
        elPrzyciskPomiaru.style.color = '';
    }
    map.getContainer().style.cursor = '';
    czyscLiniePomiaru();
}

function przelaczTrybPina() {
    if (czyMierzy) wylaczTrybPomiaru(); // Jeśli linijka działa, wyłącz ją
    czyDodajePina = !czyDodajePina;

    if (czyDodajePina) {
        elPrzyciskPina.style.backgroundColor = '#2b82c9';
        elPrzyciskPina.style.color = '#fff';
        map.getContainer().style.cursor = 'cell';
    } else {
        wylaczTrybPina();
    }
}

function wylaczTrybPina() {
    czyDodajePina = false;
    if (elPrzyciskPina) {
        elPrzyciskPina.style.backgroundColor = '#fff';
        elPrzyciskPina.style.color = '';
    }
    map.getContainer().style.cursor = '';
}


// ==========================
// AKCJE PO KLIKNIĘCIU NA MAPIE (ZJEDNOCZONE)
// ==========================

// Jeden główny i niezmienny nasłuchiwacz mapy zapobiega awariom wątków w przeglądarce
map.on('click', function (e) {
    if (czyMierzy) {
        obslugaKliknieciaPomiaru(e);
    } else if (czyDodajePina) {
        obslugaKliknieciaPina(e);
    }
});

function obslugaKliknieciaPomiaru(e) {
    const punkt = e.latlng;

    if (!liniaPomiaru) {
        liniaPomiaru = L.polyline([punkt], {
            color: '#db4a29',
            weight: 4,
            dashArray: '5, 10'
        }).addTo(map);
    } else {
        liniaPomiaru.addLatLng(punkt);
    }

    const kropka = L.circleMarker(punkt, {
        radius: 5,
        color: '#9b2d14',
        fillColor: '#fff',
        fillOpacity: 1,
        weight: 2
    }).addTo(map);
    
    punktyPomiaru.push(kropka);

    const wspolrzedne = liniaPomiaru.getLatLngs();
    let calkowityDystans = 0;

    for (let i = 0; i < wspolrzedne.length - 1; i++) {
        const dx = wspolrzedne[i+1].lng - wspolrzedne[i].lng;
        const dy = wspolrzedne[i+1].lat - wspolrzedne[i].lat;
        calkowityDystans += Math.sqrt(dx * dx + dy * dy);
    }

    const wynikWMilach = calkowityDystans * SKALA_MI;

    kropka.bindTooltip(`${wynikWMilach.toFixed(1)} mi`, {
        permanent: true,
        direction: 'top',
        opacity: 0.9
    }).openTooltip();

    panelPodrozy.update(wynikWMilach);
}

function obslugaKliknieciaPina(e) {
    const x = Math.round(e.latlng.lng);
    const y = Math.round(e.latlng.lat);
    
    const nazwaLokacji = prompt("Podaj nazwę nowej lokacji (np. Baldur's Gate):", "Nowa Lokacja");
    
    if (nazwaLokacji !== null) {
        const urlSlug = "/" + nazwaLokacji
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') 
            .trim()
            .replace(/\s+/g, '-');        

        const jsonWpis = `    {
        "name": "${nazwaLokacji}",
        "x": ${x},
        "y": ${y},
        "url": "${urlSlug}"
    }`;

        L.popup()
            .setLatLng(e.latlng)
            .setContent(`
                <div style="font-family: sans-serif; min-width: 240px;">
                    <b style="color: #2b82c9;">📍 Koordynaty wygenerowane!</b>
                    <p style="margin: 5px 0; font-size: 11px; color: #555;">Skopiuj i wklej do pliku <code>pins.json</code>:</p>
                    <textarea readonly style="width: 100%; height: 95px; font-family: monospace; font-size: 11px; resize: none; border: 1px solid #ccc; padding: 4px;" onclick="this.select()">${jsonWpis}</textarea>
                    <small style="color: #888; font-size: 9px; display: block; margin-top: 3px;">💡 Kliknij wewnątrz pola, aby automatycznie zaznaczyć tekst.</small>
                </div>
            `)
            .openOn(map);
    }
    
    // Po wygenerowaniu danych wyłączamy tryb celownika i przywracamy normalną mapę
    wylaczTrybPina();
}

function czyscLiniePomiaru() {
    if (liniaPomiaru) {
        map.removeLayer(liniaPomiaru);
        liniaPomiaru = null;
    }
    punktyPomiaru.forEach(kropka => map.removeLayer(kropka));
    punktyPomiaru = [];
    panelPodrozy.update(0);
}