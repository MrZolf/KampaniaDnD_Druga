---
NoteIcon: statblock
obsidianUIMode: source
cssclasses:
  - json5e-monster
tags:
  - ttrpg-cli/compendium/src/5e/home
statblock: inline
aliases: []
---
<% await tp.file.move("/3-Mechanics/CLI/bestiary/-homebrew/" + tp.file.title) %>
<%*
const hasTitle = !tp.file.title.startsWith("NewStatblock");
let title;
if (!hasTitle) {
    title = await tp.system.prompt("Statblock Name");
    await tp.file.rename(title);
} else {
    title = tp.file.title;
}
_%>
# `=this.file.name`
*Source: Homebrew

```statblock
"name": "Nazwa"
"size": "Medium"
"type": "humanoid"
"subtype": "Orc"
"alignment": "Chaotic Evil"
"ac": !!int "12"
"ac_class": "16 with [Barkskin](barkskin.md)"
"hp": !!int "30"
"stats":
- !!int "10"
- !!int "10"
- !!int "10"
- !!int "16"
- !!int "16"
- !!int "16"
"speed": "30 ft."
"skillsaves":
  "Medicine": !!int "4"
  "Nature": !!int "3"
  "Perception": !!int "4"
"senses": "passive Perception 14"
"languages": 
 Druidic,
 Draconic,
 Goblin
"traits":
- "desc": "The druid is a 4th-level spellcaster. Its spellcasting ability is Wisdom
    spell save DC 12, +4 to hit with spell attacks). It has the following druid
    spells prepared:\n\
    \n\
    
    Cantrips (at will): 
    [Druidcraft](druidcraft.md),
    [Shillelagh](shillelagh.md),
    [Poison Spray](poison-spray.md),
    [Acid Splash](acid-splash.md)
    \n\
    
    \n1st level (4 slots): 
    [Entangle](entangle.md),
    [Thunderwave](thunderwave.md),
    [Cure Wounds](cure-wounds.md),
    [Faerie Fire](faerie-fire.md)
    \n\
    
    \n2nd level (3 slots): 
    [Flaming Sphere](flaming-sphere.md),
    [Barkskin](barkskin.md)"
    
  "name": "Spellcasting"

"actions":
- "desc": "Melee Weapon Attack: +2 to hit (+5 to hit with shillelagh), reach
    5 ft., one target. \n\ Hit: 3 (1d6) bludgeoning damage, 4 (1d8) bludgeoning
    damage if wielded with two hands, or 6 (1d8 + 3) bludgeoning damage with [Shillelagh](shillelagh.md)."
  "name": "Quarterstaff"

"legendary_actions":
- "desc": "The dragon makes a Wisdom ([Perception](3-Mechanics/CLI/rules/skills.md#Perception))\
    \ check."
  "name": "Detect"

- "desc": "The dragon makes a tail attack."
  "name": "Tail Attack"

- "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon\
    \ must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning\
    \ damage and be knocked [prone](3-Mechanics/CLI/rules/conditions.md#Prone). The\
    \ dragon can then fly up to half its flying speed."
  "name": "Wing Attack (Costs 2 Actions)"

"lair_actions":
- "desc": "On initiative count 20 (losing initiative ties), the dragon takes a lair\
    \ action to cause one of the following effects; the dragon can't use the same\
    \ effect two rounds in a row:"
  "name": "Actions:"

- "desc": "- The dragon glimpses the future, so it has advantage on attack rolls,\
    \ ability checks, and saving throws until initiative count 20 on the next round.\
    \  \n- One creature the dragon can see within 120 feet of it must succeed on a\
    \ DC 15 Charisma saving throw or be banished to a dream plane, a different plane\
    \ of existence the dragon has imagined into being. To escape, the creature must\
    \ use its action to make a Charisma check contested by the dragon's. If the creature\
    \ wins, it escapes the dream plane. Otherwise, the effect ends on initiative count\
    \ 20 on the next round. When the effect ends, the creature reappears in the space\
    \ it left or in the nearest unoccupied space if that one is occupied.  "
  "name": ""

"source":
- "Homebrew"
"image": "Pasted image 20250301174037.png"
```
^statblock