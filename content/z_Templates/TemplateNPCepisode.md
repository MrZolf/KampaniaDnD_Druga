---
fullName: 
Gender: Mężczyzna
Race: 
Age: 
Class: 
Alignment: 
Character-Role: 
Location: 
AssociatedGroup: 
Vitality: Żywy
NoteIcon: npc
---
<% await tp.file.move("/3-Mechanics/NPCs/Epizodyczni/" + tp.file.title) %>
<%*
const hasTitle = !tp.file.title.startsWith("NewNPCepisode");
let title;
if (!hasTitle) {
    title = await tp.system.prompt("Enter NPC Name");
    await tp.file.rename(title);
} else {
    title = tp.file.title;
}
_%>
# `=this.fullName`
> ###### Podstawowe Informacje
> |   |   |
> |---|---|
> | Miejsce pobytu | `=this.Location` |
> | Stowarzyszenie | `=this.AssociatedGroup` |
> | Płeć | `=this.gender` |
> | Rasa | `=this.race` |
> | Wiek | `=this.age` |
> | Stan zdrowia | `=this.vitality` |
> ###### Statystyki
> |   |   |
> |---|---|
> | Charakter | `=this.alignment` |
> | Klasa | `=this.class` |
> | Rola postaci | `=this.character-role` |
## Opis
`=this.fullName` - 
##### Rollplay
- 
##### Wygląd
- 
##### Notatki DM
- 