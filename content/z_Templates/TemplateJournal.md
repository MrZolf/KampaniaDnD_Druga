---
NoteIcon: journal
aat-render-enabled: true
fc-category:
  - Event Category 1
fc-display-name: 
sessionstatus: 
type: Session Journal
sessionDate: 2025-01-19
players: 4
Status: Odbyta
OneLiner: 1 Line Summary
timelines:
  - journal
tags:
  - journal
---
<% await tp.file.move("/1-Session Journals/" + tp.file.title) %>
<%*
const hasTitle = !tp.file.title.startsWith("NewJournal");
let title;
if (!hasTitle) {
    title = await tp.system.prompt("Enter Date (yyyy-mm-dd)");
    await tp.file.rename(title);
} else {
    title = tp.file.title;
}
_%> 

# Obecni
[[Aerinwynn Nyx]]
[[Hector Gíllárd]]
[[Ilmathar]]
[[Roland z Nooskopin]]
[[Xatedryn Blackbeak]]

# Przed sesją


# Sesja


## 1

## 2

## 3

## 4
