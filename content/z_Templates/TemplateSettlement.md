---
NoteIcon: settlement
tags:
  - Category/Settlement
Community-Size: 
Alignment: Neutrlane
Government: 
type: Osada
politics: 
leader: 
guildsgroups: 
region:
  - Wybrzeże Mieczy
size: Wioska
population: 500
commonraces:
  - Ludzie
  - Gnomy
  - Elfy
  - Krasnoludy
religion: 
exports: 
imports:
---

<% await tp.file.move("/2-World/" + tp.file.title) %>

<%*
const hasTitle = !tp.file.title.startsWith("NewLocation");
let title;
if (!hasTitle) {
    title = await tp.system.prompt("Location Name");
    await tp.file.rename(title);
} else {
    title = tp.file.title;
}
_%>


> [!infobox]
> # `=this.file.name`
> ![[MapPlaceholder.png|cover hsmall]]
> ###### Geografia
> |   |   |
> |---|---|
> | **Typ** | `=this.type` |
> | **Rozmiar** | `=this.size` |
> | **Region** | `=this.region` |
> ###### Polityka
> |   |   |
> |---|---|
> | **Typ Rządów** | `=this.politics` |
> | **Władca** | `=this.leader` |
> | **Obrona** | `=this.defences` |
> ###### Społeczeństwo
> |   |   |
> |---|---|
> | **Populacja** | `=this.population` |
> | **Rasy** | `=this.commonraces` |
> | **Religie** | `=this.religion` |
> ###### Handel
> |   |   |
> |---|---|
> | **Export** | `=this.exports` |
> | **Import** | `=this.imports` |
## Informacje Ogólne
Placeholder

## Mapa
![[MapPlaceholder.png|Placeholder Map]]

## Zdjęcia
![[ImagePlaceholder.png|Placeholder Picture]]

## NPC godni uwagi
Placeholder

## Historia
Placeholder

## Interesujące miejsca
Placeholder

## Relacje wewnętrzne
Placeholder

## Relacje zewnętrzne
Placeholder

## Dodatkowe uwagi
Placeholder

