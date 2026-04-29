---
tags:
  - Category/Group
Community-Size: 
Alignment: 
Government: 
Leader: 
PrimaryHome: 
NoteIcon: group
---
<% await tp.file.move("/3-Mechanics/Guilds and Groups/" + tp.file.title) %>
<%*  
const hasTitle = !tp.file.title.startsWith("NewGroup");  
let title;  
if (!hasTitle) {  
title = await tp.system.prompt("Group Name");  
await tp.file.rename(title);  
} else {  
title = tp.file.title;  
}  
_%>
> [!infobox]
> # `=this.file.name`
> ![[ImagePlaceholder.png]]
> ###### Kluczowi członkowie
> ###### Lider `=this.Leader`
> ```dataview
>TABLE WITHOUT ID 
> link(file.name) AS "Nazwa NPC", 
> Race AS "Rasa"
>FROM "3-Mechanics/NPCs"
>WHERE contains(AssociatedGroup,[[Synowie Popiołu]])
## Przegląd
...
## Etymologia
...
## Cele i zachowania
...
## Społeczeństwo
...
### Wiara
...
### Kultura
...
### Religia
...
## Posiadanie
...
## Historia
...
## Plotki i legendy
...

