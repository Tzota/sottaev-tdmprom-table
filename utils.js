const moment = require('moment');

const fmtDate = date => date ? moment(date).format('DD.MM.YYYY') : '';

const withPercent = ({from, due, ...rest}, stop) => ({
  from,
  due,
  ...rest,
  percent: (!from || !due || !stop) ? 0 : Math.round(100 * (due-stop)/(due-from)),
});

const line = ({name, from, due, percent, info}) => `
<tr>
  <td class="name">${name}</td>
  <td class="from">${fmtDate(from)}</td>
  <td class="due">${fmtDate(due)}</td>
  <td class="percent ${percent < 50 ? 'expiring' : ''}">${percent}${percent > 0 ? '%' : ''}</td>
  <td class="info">${info}</td>
</tr>
`;

const page = (data, stop) => `
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body {font-family: sans-serif}
    table {width: 100%; border-spacing: 0;}
    tr:nth-child(odd) {background-color: #cccccc}
    td {padding-left: 1em;font-size:125%}
    .from, .due, .percent, .info {white-space: nowrap}
    .name {width: 100%}
    .expiring {background-color: #FFC7CE !important}
  </style>
</head>
<body>
<h1>Сроки склад ${fmtDate(stop)}</h1>
${data.reduce((acc, {name, from, due, info}) => {
  if (from === '' && due === '') {
    acc.push([name, []]);
  } else {
    (acc[acc.length - 1][1]).push({name, from, due, stop, info})
  }
  return acc;
}, [])
  .map(([name, lines]) => `<h2>${name}</h2><table>${lines
    .map(o => withPercent(o, stop))
    .sort((x, y) => x.percent - y.percent)
    .map(line)
    .join('')}</table>`)
  .join('')
}
<!-- Yandex.Metrika informer -->
<a href="https://metrika.yandex.ru/stat/?id=51103667&amp;from=informer"
target="_blank" rel="nofollow"><img src="https://informer.yandex.ru/informer/51103667/3_1_FFFFFFFF_EFEFEFFF_0_pageviews"
style="width:88px; height:31px; border:0;" alt="Яндекс.Метрика" title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)" class="ym-advanced-informer" data-cid="51103667" data-lang="ru" /></a>
<!-- /Yandex.Metrika informer -->

<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter51103667 = new Ya.Metrika2({
                    id:51103667,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true
                });
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/tag.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks2");
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/51103667" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</body>
</html>
`;

module.exports = {
  page,
};
