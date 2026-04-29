---
NoteIcon: player
aliases:
  - Bob
tags:
  - player
Player: Bob
Role: Player
Class:
  - Barbarian
Race:
  - Human
level: 8
hp: 71
ac: 22
modifier: 4
pasperc: 13
Status: Active
PlayerKnownLanguages:
  - Celestial
  - Common
  - Dwarvish
---

<% await tp.file.move("/1-Party/" + tp.file.title) %>

<%*
const hasTitle = !tp.file.title.startsWith("NewPlayer");
let title;
if (!hasTitle) {
    title = await tp.system.prompt("Enter Player Name");
    await tp.file.rename(title);
} else {
    title = tp.file.title;
}
_%>
# `=this.file.name`

| Image                                              | Char Name         | Player Name    | Class         | Race         | Level         |
| -------------------------------------------------- | ----------------- | -------------- | ------------- | ------------ | ------------- |
| <img src="PlaceholderPortret.png" alt=img width="180"> | `=this.file.name` |  `VIEW[{Player}]` | `VIEW[{Class}]` | `VIEW[{Race}]` | `VIEW[{level}]` |
