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
exampleProperty: z_Assets/Decks/Business Card Dungeon/Dungeon16.png
---
<% await tp.file.move("/3-Mechanics/NPCs/" + tp.file.title) %>
<%*
const hasTitle = !tp.file.title.startsWith("NewNPC");
let title;
if (!hasTitle) {
    title = await tp.system.prompt("Enter NPC Name");
    await tp.file.rename(title);
} else {
    title = tp.file.title;
}
_%>
# `=this.fullName`
>[!column] Przegląd
>> ![[PlaceholderPortret.png|300]]
>
>> ###### Podstawowe Informacje
>> |   |   |
>> |---|---|
>> | Miejsce pobytu | `=this.Location` |
>> | Stowarzyszenie | `=this.AssociatedGroup` |
>> | Płeć | `=this.gender` |
>> | Rasa | `=this.race` |
>> | Wiek | `=this.age` |
>> | Stan zdrowia | `=this.vitality` |
>> ###### Statystyki
>> |   |   |
>> |---|---|
>> | Charakter | `=this.alignment` |
>> | Klasa | `=this.class` |
>> | Rola postaci | `=this.character-role` |

>[!statblock]- Statblock
> ```statblock
> name: Nazwa
> monster: Commoner
> columns: 2
> source: Homebrew
> image: PlaceholderPortret.png
> ```
## Opis
`=this.fullName` - 
##### Rollplay
- 
##### Wygląd
- 
##### Notatki DM
- 