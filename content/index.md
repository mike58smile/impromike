
```dataviewjs
// Define colors at the beginning
const itemColor = "rgb(184,119,35)";
const subItemColor = "#FFF1D0";
const noSubItemsColor = "gray";
const dateColor = "#999"; // Color for the date

const thisNote = dv.current().file.link;

// find all items that link to this note and have type = "main"
let items = dv.pages()
    .where(p => p.file.outlinks.includes(thisNote) && p.type === "main");

for (let item of items) {
    // Build item display name with full_name if it exists
    let itemDisplay = item.file.name;
    if (item.full_name) {
        itemDisplay += ` - ${item.full_name}`;
    }
    
    // Item link in custom color with space below
    dv.el("div", `<a href="obsidian://open?vault=${dv.app.vault.getName()}&file=${encodeURIComponent(item.file.path)}" style="color: ${itemColor}; font-weight: bold; display: block; margin-bottom: 8px; text-decoration: none;">${itemDisplay}</a>`);

    // find all subItems that link to both this item and the note
    let subItems = dv.pages()
        .where(p => p.file.outlinks.includes(item.file.link) 
                 && p.file.outlinks.includes(thisNote));

    if (subItems.length > 0) {
        subItems.forEach(subItem => {
            // Build subItem display name with full_name if it exists
            let subItemDisplay = subItem.file.name;
            if (subItem.full_name) {
                subItemDisplay += ` - ${subItem.full_name}`;
            }
            
            // Format the date as dd.MM. if it exists
            let dateDisplay = subItem.date ? ` <span style="color: ${dateColor};">(${subItem.date.toFormat("dd.MM.")})</span>` : "";
            
            // SubItem links with date, indented
            dv.el("div", `<a href="obsidian://open?vault=${dv.app.vault.getName()}&file=${encodeURIComponent(subItem.file.path)}" style="color: ${subItemColor}; margin-left: 20px; text-decoration: none;">${subItemDisplay}</a>${dateDisplay}`);
        });
    }

    // Add extra space after each item block
    dv.el("div", `<div style="height: 12px;"></div>`);
}

```
# Obsah
```dataview
LIST WITHOUT ID
WHERE contains(file.outlinks, this.file.link)
AND !contains(file.folder, "Templates")
SORT datetime DESC

```
