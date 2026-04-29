---

kanban-plugin: board

---

## 

- [ ] ###### <font color="#245bdb">Nowa sesja</font>
	```meta-bind-button
	label: Nowa Sesja
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateJournal.md"
	    fileName: NewJournal
	```
- [ ] ###### <font color="#31859b">Nowy NPC</font>
	```meta-bind-button
	label: Nowy NPC
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateNPC.md"
	    fileName: NewNPC
	```
	```meta-bind-button
	label: Nowy Epizodyczny NPC
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateNPCepisode.md"
	    fileName: NewNPCepisode
	```
- [ ] ###### <font color="#47FF00">Nowy Statblock</font>
	```meta-bind-button
	label: Nowy Statblock
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateStatblock.md"
	    fileName: NewStatblock
	```
	*Wyłącz automatyczne parsowanie*
- [ ] ###### <font color="#7030a0">Nowy przedmiot</font>
	
	```meta-bind-button
	label: Nowy Przedmiot
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateMagicItem.md"
	    fileName: NewMagicItem
	```
- [ ] ###### <font color="#ffff00">Nowa lokacja</font>
	```meta-bind-button
	label: Nowa Lokacja
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateSettlement.md"
	    fileName: NewLocation
	```
- [ ] ###### <font color="#00b050">Nowe Stowarzyszenie</font>
	```meta-bind-button
	label: Nowe Stowarzyszenie
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateGroup.md"
	    fileName: NewGroup
	```
- [ ] ###### <font color="#e36c09">Nowy quest</font>
	```meta-bind-button
	label: Nowy Quest
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplateQuest.md"
	    fileName: NewQuest
	```
- [ ] ###### <font color="#ff0000">Nowy gracz</font>
	```meta-bind-button
	label: Nowy Gracz
	hidden: false
	id: ""
	style: primary
	actions:
	  - type: templaterCreateNote
	    templateFile: "z_Templates/TemplatePlayer.md"
	    fileName: NewPlayer
	```




%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false],"show-checkboxes":false,"hide-card-count":true,"lane-width":345,"full-list-lane-width":false,"show-add-list":false,"show-archive-all":false,"show-view-as-markdown":false,"show-board-settings":false,"show-search":false,"show-set-view":false}
```
%%