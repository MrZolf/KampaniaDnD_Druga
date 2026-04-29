---
obsidianUIMode: preview
cssclasses:
  - json5e-item
tags:
  - item
aliases: 
SourceType: Magic Item
NoteIcon: magicitem
itemType: 
rarity: 
Dostrojenie:
---
<% await tp.file.move("/3-Mechanics/Items/" + tp.file.title) %>
<%*
const hasTitle = !tp.file.title.startsWith("NewMagicItem");
let title;
if (!hasTitle) {
    title = await tp.system.prompt("Enter Item Name");
    await tp.file.rename(title);
} else {
    title = tp.file.title;
}
_%>
# `=this.file.name`
*`=this.itemType`, `=this.rarity`*![[Imageplaceholder.png#right|500]]
#### Cechy
- **Dostrojenie**: `=this.Dostrojenie`
- **Obrażenia**: 1d8/1d10 cięte
- **Własności**: [[item-properties#Versatile|Półtoraręczny]]
#### Opis
Masz premię +1 do testów ataku i rzutów na obrażenia wykonywanych tą magiczną bronią. Jeśli trafisz nią obiekt, trafienie automatycznie liczy się jako trafienie krytyczne i możesz zdecydować, czy zadaje obrażenia obuchowe, czy tnące.

Dodatkowo, broń ta jest odporna na obrażenia pochodzące ze źródeł niemagicznych.
