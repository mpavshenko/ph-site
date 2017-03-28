var fs = require('fs');
var tr = require('transliteration');

function renderRow(r) {
    return `<p class="decree-main">
        <a target="_blank" href="${r[5]}">
            ${r[0]} от ${r[2]} №${r[1]} 
        </a>
        </p>
        <p class="decree-about">${r[4]}.<p>`
}

function renderNavLi(g) {
    return `<li> <a href="#${tr.slugify(g)}">${g}</a></li>`;
} 

function renderGroup(g, rows) {
    return `<h2 id="${tr.slugify(g)}">${g}</h2>\n` +
        rows.map(renderRow).join('\n') +
        '<hr>';
}

var groupByType = (g, r) => {
    name = r[0];
    name = name.replace('Приказ', 'Приказы');
    name = name.replace('ФЗ', 'Федеральные законы');
    name = name.replace('Постановление', 'Постановления');
    (g[name] = g[name] || []).push(r);
    return g;
}

var mergeGroups = (all, g) => {
    all = all.concat(groups[g]);
    delete groups[g];
    return all;
};


var groups = fs.readFileSync('documents.csv')
    .toString()
    .split('\n')
    .map(s => s.split(';').map(s => s.trim()))
    .reduce(groupByType, {});


groups['ГОСТы'] = ['ГОСТ Р ИСО', 'ГОСТ Р', 'ГОСТ'].reduce(mergeGroups, []);

groups['Другое'] = [
    'МУ', 
    'Закон РФ', 
    'Распоряжение Правительства РФ', 
    'Приложение к распоряжению Правительства РФ', 
    'РЕШЕНИЕ', 
    'ТР ТС', 
    'ФАРМАКОПЕЯ'].reduce(mergeGroups, []);

var content = Object.keys(groups)
    .map(g => renderGroup(g, groups[g]))
    .join('\n');

var nav = Object.keys(groups)
    .map(renderNavLi)
    .join('\n');

fs.writeFileSync('../view/ext/documents.html', content);
fs.writeFileSync('../view/ext/documents-nav.html', nav);
