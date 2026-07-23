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
// OBRAZ MAPY (GŁÓWNY)
// ==========================
L.imageOverlay(
    'assets/tellusmap.webp',
    bounds
).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds);


// ==========================
// WARSTWA DODATKOWA (GRANICE - DOMYŚLNIE UKRYTA)
// ==========================
// Bez .addTo(map) na starcie -> warstwa jest wyłączona
const warstwaGranic = L.imageOverlay(
    'assets/granice.png',
    bounds
);


// ==========================
// WARSTWA I DEFAULTOWE PINY (READ ONLY)
// ==========================
const warstwaPinezek = L.layerGroup().addTo(map);

fetch('pins.json')
    .then(r => r.json())
    .then(pins => {
        pins.forEach(pin => {
            L.marker([pin.y, pin.x])
                .addTo(warstwaPinezek)
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
// PANEL CZASU PODRÓŻY (D&D 5e - PEŁNY)
// ==========================
const PanelPodrozy = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function (map) {
        this._div = L.DomUtil.create('div', 'panel-czasu-dnd');
        
        // Stylizacja panelu
        this._div.style.backgroundColor = '#f4eae1';
        this._div.style.border = '2px solid #5c2c16';
        this._div.style.borderRadius = '8px';
        this._div.style.padding = '12px';
        this._div.style.fontFamily = 'Georgia, serif';
        this._div.style.fontSize = '12px';
        this._div.style.color = '#331a00';
        this._div.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        this._div.style.width = '320px';
        this._div.style.maxHeight = '80vh';
        this._div.style.overflowY = 'auto';

        // Blokada przesuwania i powiększania mapy podczas klikania wewnątrz panelu
        L.DomEvent.disableClickPropagation(this._div);
        L.DomEvent.disableScrollPropagation(this._div);
        
        this.update(0);
        return this._div;
    },
    update: function (dystans) {
        if (dystans === 0) {
            this._div.innerHTML = `<b style="color: #5c2c16;">Dziennik Podróży</b><br><span style="color: #666;">Użyj linijki, aby zmierzyć długość podróży...</span>`;
            return;
        }

        // --- BAZA DANYCH PODRÓŻY ---
        const tempoLadowe = {
            szybkie:  { dzien: 30, godzina: 4, minuta: '400 ft (120 m)', efekt: '-5 do pas. Percepcji' },
            normalne: { dzien: 24, godzina: 3, minuta: '300 ft (90 m)',  efekt: '-' },
            wolne:    { dzien: 18, godzina: 2, minuta: '200 ft (60 m)',  efekt: 'Można się skradać' }
        };

        const statki = [
            { nazwa: 'Drakkar',       godzina: 3,   doba: 72,  minuta: '272 ft (83 m)' },
            { nazwa: 'Galera',        godzina: 4,   doba: 96,  minuta: '384 ft (117 m)' },
            { nazwa: 'Kuter',         godzina: 1,   doba: 24,  minuta: '108 ft (33 m)' },
            { nazwa: 'Łódź wiosłowa', godzina: 1.5, doba: 36,  minuta: '164 ft (50 m)' },
            { nazwa: 'Okręt wojenny', godzina: 2.5, doba: 60,  minuta: '246 ft (75 m)' },
            { nazwa: 'Żaglowiec',     godzina: 2,   doba: 48,  minuta: '220 ft (67 m)' }
        ];

        // --- FUNKCJE PRZELICZAJĄCE (BEZ MINUT) ---
        // Marsz lądowy (max 8 godzin na dobę)
        function ObliczMarsz(dystans, miDzien, miGodzina) {
            let dni = Math.floor(dystans / miDzien);
            const resztaMil = dystans % miDzien;
            let g = Math.round(resztaMil / miGodzina);

            if (g >= 8) {
                dni += 1;
                g = 0;
            }

            let wynik = "";
            if (dni > 0) wynik += `${dni}d `;
            if (g > 0 || dni === 0) wynik += `${g}h`;
            return wynik.trim();
        }

        // Podróż wodna (statki płyną 24h na dobę)
        function ObliczStatek(dystans, miDoba, miGodzina) {
            let dni = Math.floor(dystans / miDoba);
            const resztaMil = dystans % miDoba;
            let g = Math.round(resztaMil / miGodzina);

            if (g >= 24) {
                dni += 1;
                g = 0;
            }

            let wynik = "";
            if (dni > 0) wynik += `${dni}d `;
            if (g > 0 || dni === 0) wynik += `${g}h`;
            return wynik.trim();
        }

        // Generowanie wierszy dla statków
        const wierszeStatkow = statki.map(s => `
            <tr style="border-bottom: 1px dotted #c8b8a6;">
                <td style="padding: 3px 0;"><b>${s.nazwa}</b></td>
                <td style="padding: 3px 0; text-align: center; font-weight: bold; color: #1b4965;">
                    ${ObliczStatek(dystans, s.doba, s.godzina)}
                </td>
                <td style="padding: 3px 0; text-align: right; color: #555; font-size: 10px;">
                    ${s.godzina} mi/h (${s.doba} mi/doba)
                </td>
            </tr>
        `).join('');

        // --- RENDEROWANIE HTML ---
        this._div.innerHTML = `
            <h4 style="margin: 0 0 6px 0; color: #5c2c16; border-bottom: 1px solid #5c2c16; padding-bottom: 4px; display: flex; justify-content: space-between;">
                <span>Dystans:</span>
                <span>${dystans.toFixed(1)} mi (${(dystans * 1.5).toFixed(1)} km)</span>
            </h4>

            <!-- GŁÓWNA TABELA LĄDOWA -->
            <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 8px;">
                <tr style="font-weight: bold; color: #5c2c16; border-bottom: 1px solid #5c2c16;">
                    <th style="padding: 2px 0;">Tempo</th>
                    <th style="padding: 2px 0; text-align: center;">Czas (8h na dzień)</th>
                    <th style="padding: 2px 0; text-align: right;">Efekt</th>
                </tr>
                <tr style="border-bottom: 1px dotted #9c7a59;">
                    <td style="padding: 3px 0;">Szybkie</td>
                    <td style="padding: 3px 0; text-align: center; font-weight: bold;">${ObliczMarsz(dystans, tempoLadowe.szybkie.dzien, tempoLadowe.szybkie.godzina)}</td>
                    <td style="padding: 3px 0; text-align: right; font-size: 10px; color: #8b0000;">-5 Percepcja</td>
                </tr>
                <tr style="border-bottom: 1px dotted #9c7a59;">
                    <td style="padding: 3px 0;">Normalne</td>
                    <td style="padding: 3px 0; text-align: center; font-weight: bold;">${ObliczMarsz(dystans, tempoLadowe.normalne.dzien, tempoLadowe.normalne.godzina)}</td>
                    <td style="padding: 3px 0; text-align: right; font-size: 10px; color: #666;">-</td>
                </tr>
                <tr>
                    <td style="padding: 3px 0;">Wolne</td>
                    <td style="padding: 3px 0; text-align: center; font-weight: bold;">${ObliczMarsz(dystans, tempoLadowe.wolne.dzien, tempoLadowe.wolne.godzina)}</td>
                    <td style="padding: 3px 0; text-align: right; font-size: 10px; color: #2e8b57;">Skradanie</td>
                </tr>
            </table>

            <!-- SEKCJA ROZWIJANA (SEKCJE & DODATKI) -->
            <details style="border-top: 1px solid #5c2c16; padding-top: 6px; margin-top: 4px;">
                <summary style="font-weight: bold; color: #5c2c16; cursor: pointer; outline: none; user-select: none;">
                    Podróż Wodna i Szczegóły
                </summary>

                <!-- TABELA STATKÓW -->
                <h5 style="margin: 10px 0 4px 0; color: #1b4965; border-bottom: 1px solid #1b4965; padding-bottom: 2px;">
                    Podróż Wodna (Pływanie 24h/dobę)
                </h5>
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11px;">
                    <tr style="font-weight: bold; color: #1b4965;">
                        <th style="padding: 2px 0;">Statek</th>
                        <th style="padding: 2px 0; text-align: center;">Czas</th>
                        <th style="padding: 2px 0; text-align: right;">Szybkość</th>
                    </tr>
                    ${wierszeStatkow}
                </table>

                <!-- OPIS ZASAD -->
                <h5 style="margin: 10px 0 4px 0; color: #5c2c16; border-bottom: 1px solid #5c2c16; padding-bottom: 2px;">
                    Zasady Szczegółowe
                </h5>
                
                <ul style="margin: 4px 0; padding-left: 16px; font-size: 11px; color: #444; line-height: 1.3;">
                    <li><b>Dzień marszu:</b> Zakłada 8 godzin marszu na dobę.</li>
                    <li><b>Forsowny marsz:</b> Każda godzina powyżej 8h wymaga rzutu na Kondycję (ST 10 + 1 za każdą kolejną h). Porażka = +1 poziom wyczerpania.</li>
                    <li><b>Wierzchowce:</b> Mogą galopować z podwójną prędkością przez 1h. Każda kolejna godzina galopu daje +1 poziom wyczerpania wierzchowcowi.</li>
                    <li><b>Trudny teren:</b> Zmniejsza prędkość ruchu o połowę.</li>
                    <li><b>Nurt rzeki:</b> Łodzie i kutry płynące z prądem dodają prędkość nurtu do swojej szybkości (+3 mi/h / +5 km/h).</li>
                </ul>
                </div>
            </details>
        `;
    }
});

const panelPodrozy = new PanelPodrozy();
map.addControl(panelPodrozy);


// ==========================
// ZMIENNE GLOBALNE I PRZYCISKI INTERFEJSU
// ==========================
const SKALA_MI = 0.2; 

let liniaPomiaru = null;
let punktyPomiaru = [];

// Flagi stanów narzędzi i warstw
let czyMierzy = false;
let czyDodajePina = false;
let czyPinezkiWidoczne = true;
let czyGraniceWidoczne = false; // Domyślnie NIEWIDOCZNE

// Referencje do elementów DOM przycisków
let elPrzyciskPomiaru = null;
let elPrzyciskPina = null;
let elPrzyciskWidocznosci = null;
let elPrzyciskGranic = null;

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
            L.DomEvent.stop(e);
            przelaczTrybPomiaru();
        });

        return kontener;
    }
});

// --- Przycisk Pinezki ---
const PrzyciskNowegoPina = L.Control.extend({
    options: { position: 'bottomright' },
    onAdd: function (map) {
        const kontener = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const przycisk = L.DomUtil.create('a', '', kontener);
        
        przycisk.innerHTML = 'GM';
        przycisk.href = '#';
        przycisk.title = 'Pobierz koordynaty JSON dla nowego punktu';
        przycisk.style.fontSize = '12px';
        przycisk.style.display = 'flex';
        przycisk.style.alignItems = 'center';
        przycisk.style.justifyContent = 'center';
        przycisk.style.cursor = 'pointer';
        przycisk.style.backgroundColor = '#fff';
        przycisk.style.width = '30px';
        przycisk.style.height = '30px';

        elPrzyciskPina = przycisk;

        L.DomEvent.on(przycisk, 'click', function (e) {
            L.DomEvent.stop(e);
            przelaczTrybPina();
        });

        return kontener;
    }
});

// --- Przycisk Widoczności Pinezek ---
const PrzyciskWidocznosciPinezek = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
        const kontener = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const przycisk = L.DomUtil.create('a', '', kontener);
        
        przycisk.innerHTML = '📌';
        przycisk.href = '#';
        przycisk.title = 'Pokaż / Ukryj pinezki';
        przycisk.style.fontSize = '16px';
        przycisk.style.display = 'flex';
        przycisk.style.alignItems = 'center';
        przycisk.style.justifyContent = 'center';
        przycisk.style.cursor = 'pointer';
        przycisk.style.backgroundColor = '#fff';
        przycisk.style.width = '30px';
        przycisk.style.height = '30px';

        elPrzyciskWidocznosci = przycisk;

        L.DomEvent.on(przycisk, 'click', function (e) {
            L.DomEvent.stop(e);
            przelaczWidocznoscPinezek();
        });

        return kontener;
    }
});

// --- Przycisk Widoczności Granic (granice.png) ---
const PrzyciskWidocznosciGranic = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
        const kontener = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const przycisk = L.DomUtil.create('a', '', kontener);
        
        przycisk.innerHTML = '🗺️';
        przycisk.href = '#';
        przycisk.title = 'Pokaż / Ukryj granice';
        przycisk.style.fontSize = '16px';
        przycisk.style.display = 'flex';
        przycisk.style.alignItems = 'center';
        przycisk.style.justifyContent = 'center';
        przycisk.style.cursor = 'pointer';
        przycisk.style.backgroundColor = '#fff'; // Domyślnie białe tło (wyłączony)
        przycisk.style.width = '30px';
        przycisk.style.height = '30px';

        elPrzyciskGranic = przycisk;

        L.DomEvent.on(przycisk, 'click', function (e) {
            L.DomEvent.stop(e);
            przelaczWidocznoscGranic();
        });

        return kontener;
    }
});

map.addControl(new PrzyciskPomiaru());
map.addControl(new PrzyciskNowegoPina());
map.addControl(new PrzyciskWidocznosciPinezek());
map.addControl(new PrzyciskWidocznosciGranic());


// ==========================
// KONTROLA TRYBÓW I WARSTW (LOGIKA)
// ==========================

function przelaczWidocznoscGranic() {
    czyGraniceWidoczne = !czyGraniceWidoczne;

    if (czyGraniceWidoczne) {
        map.addLayer(warstwaGranic);
        elPrzyciskGranic.style.backgroundColor = '#db4a29'; // Czerwony/pomarańczowy po włączeniu
    } else {
        map.removeLayer(warstwaGranic);
        elPrzyciskGranic.style.backgroundColor = '#fff';    // Biały po wyłączeniu
    }
}

function przelaczWidocznoscPinezek() {
    czyPinezkiWidoczne = !czyPinezkiWidoczne;

    if (czyPinezkiWidoczne) {
        map.addLayer(warstwaPinezek);
        elPrzyciskWidocznosci.innerHTML = '📌';
        elPrzyciskWidocznosci.style.backgroundColor = '#fff';
    } else {
        map.removeLayer(warstwaPinezek);
        elPrzyciskWidocznosci.innerHTML = '📌';
        elPrzyciskWidocznosci.style.backgroundColor = '#db4a29';
    }
}

function przelaczTrybPomiaru() {
    if (czyDodajePina) wylaczTrybPina();
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
    if (czyMierzy) wylaczTrybPomiaru();
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