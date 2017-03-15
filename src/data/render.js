var fs = require('fs');

function renderRow(r) {
    return `<p class="decree-main">
        <span class="decree-date">${r[3]}</span> 
        <a href="${r[5]}">
            ${r[0]} №${r[1]} от ${r[2]}
        </a>
        </p>
        <p class="decree-about">${r[4]}.<p>`
}

var content = fs.readFileSync('documents.csv')
    .toString()
    .split('\n')
    .map(s => s.split(';').map(s => s.trim()))
    .map(renderRow)
    .join('\n');

fs.writeFileSync('../view/ext/documents.html', content);

