```dataviewjs
const pages = dv.pages()
  .filter(p => !p.file.path.includes('z_Templates', '0-Brudnopis'))  // Wyklucz folder z_Templates
  .groupBy(p => p.NoteIcon)
  .filter(p => !!p.key);  // Filtruj strony bez właściwości noteType

// Labels
const noteTypes = pages.map(p => p.key).values;
// Data
const noteTypesCount = pages.map(p => p.rows.length).values;

const chartData = {
    type: 'bar',
    data: {
        labels: noteTypes,
        datasets: [{
            label: 'Ilość',
            data: noteTypesCount,
            backgroundColor: [
                '#3eb281'
            ],
        }]
    }
}

window.renderChart(chartData, this.container)
```

