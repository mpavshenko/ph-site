var fs = require('fs');

function renderRow(r) {
    return `<p class="decree-main">
        <a href="${r[5]}">
            ${r[0]} от ${r[2]} №${r[1]} 
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

