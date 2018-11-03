const moment = require('moment');

const fmtDate = date => date ? moment(date).format('DD.MM.YYYY') : '';

const percent = (from, due, stop) => Math.round(100 * (due-stop)/(due-from));

const diff = (from, due, stop) => {
  if (!from || !due || !stop) return '';

  return `${percent(from, due, stop)}%`;
};

const line = ({name, from, due, stop}) => `
<tr>
  <td class="name">${name}</td>
  <td class="from">${fmtDate(from)}</td>
  <td class="due">${fmtDate(due)}</td>
  <td class="percent ${percent(from, due, stop) < 50 ? 'expiring' : ''}">${diff(from, due, stop)}</td>
</tr>
`;

const page = (data, stop) => `
<html>
<head>
  <style>
    body {font-family: sans-serif}
    table {width: 100%; border-spacing: 0;}
    tr:nth-child(odd) {background-color: #cccccc}
    td {padding-left: 1em;font-size:125%}
    .from, .due, .percent {white-space: nowrap}
    .name {width: 100%}
    .expiring {background-color: #FFC7CE !important}
  </style>
</head>
<body>
<h1>Сроки склад ${fmtDate(stop)}</h1>
${data.reduce((acc, {name, from, due}) => {
  if (from === '' && due === '') {
    acc.push([name, []]);
  } else {
    (acc[acc.length - 1][1]).push({name, from, due, stop})
  }
  return acc;
}, [])
  .map(([name, lines]) => `<h2>${name}</h2><table>${lines.map(line).join('')}</table>`)
  .join('')
}
</body>
</html>
`;

module.exports = {
  page,
};
