---
obsidianUIMode: preview
---
# Sesje
```dataview
TABLE WITHOUT ID 
	link(file.name) AS "Nazwa sesji", 
	Status,
	sessionDate AS "Data", 
	players AS "Gracze"
from "1-Session Journals"
where (type = "Session Journal")
SORT sessionDate DESC
LIMIT 10
```
# Drużyna
```dataview  
TABLE WITHOUT ID 
    link(file.name) AS "Nazwa Postaci", 
    Player AS "Gracz", 
    Class AS "Klasa", 
    Race AS "Rasa", 
    level AS "Poziom"
from "1-Party"
where (Role = "Player")
where (Status = "Active")
```
# Ostatnio zmodyfikowani  NPC
```dataview  
TABLE WITHOUT ID 
	link(file.name) AS "Nazwa NPC", 
	Gender AS "Płeć", 
	Race AS "Rasa",
	Age AS "Wiek",
	Location AS "Lokacja",
	AssociatedGroup AS "Stowarzyszenie"  
FROM "3-Mechanics/NPCs"
WHERE (NoteIcon = "npc") 
SORT file.mtime DESC
LIMIT 10
```
# Ostatnio zmodyfikowane lokacje
```dataview  
TABLE WITHOUT ID 
	link(file.name) AS "Nazwa lokacji",
	type AS "Typ", 
	size AS "Rozmiar", 
	population AS "Populacja"  
FROM "2-World"
SORT file.mtime DESC
LIMIT 10
```
# Ostatnio zmodyfikowane przedmioty
```dataview  
TABLE WITHOUT ID 
	link(file.name) AS "Nazwa przedmiotu",
	itemType AS "Typ przedmiotu",
	rarity AS "Jakość",
	Dostrojenie AS "Wymaga dostrojenia"
FROM "3-Mechanics/Items"
WHERE (NoteIcon = "magicitem") 
SORT file.mtime DESC
LIMIT 10
```
# Ostatnio zmodyfikowane notatki
```dataview
TABLE WITHOUT ID
    link(file.path, file.folder + " / " + file.name) AS "Notatka",
    file.mtime AS "Ostatnio zmodyfikowana"
FROM "/"
WHERE file.mtime >= date(today) - dur(30 days)
AND file.name != this.file.name
    AND !contains(file.path, "z_Assets")
    AND !contains(file.path, "Inline Scripts")
    AND !contains(file.path, "z_Templates")
    AND !contains(file.path, "daily notes")
    AND !contains(file.path, "BRAT")
SORT file.mtime DESC
LIMIT 10
```
# Raport
```dataviewjs
const pages = dv.pages()
  .filter(p => !p.file.path.includes('z_Templates', '0-Brudnopis'))  // Wyklucz folder z_Templates
  .groupBy(p => p.NoteIcon)
  .filter(p => !!p.key);  // Filtruj strony bez właściwości noteType

// Labels
const noteTypes = pages.map(p => p.key).values;
// Data
const noteTypesCount = pages.map(p => p.rows.length).values;

const chartData = {
    type: 'bar',
    data: {
        labels: noteTypes,
        datasets: [{
            label: 'Ilość',
            data: noteTypesCount,
            backgroundColor: [
                '#3eb281'
            ],
        }]
    }
}

window.renderChart(chartData, this.container)
```

