const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const http = require('http');
const {page} = require('./utils');

const parseDate = value => {
    let parts = value.split('/');
    if (parts.length === 3) {
        return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    parts = value.split('.');

    if (parts.length === 3) {
        return new Date(+parts[2] + (parts[2] < 2000 ? 2000 : 0) , parts[1] - 1, parts[0]);
    }

    return '';
};

const records = parse(
    fs.readFileSync('./input.csv', 'utf-8'),
    {
        columns: ['name', 'from', 'due', '_', 'info', '_3', '_4', '_5'],
        // delimiter: ';',
        skip_empty_lines: true,
        cast: (value, {column}) => {
            if (!['from', 'due'].includes(column)) return value;

            return parseDate(value);
        },
    },
);

const [headers, ...data] = records;
const stop = parseDate(headers._);
const result = page(data, stop);

try {
    fs.accessSync('./build');
} catch (error) {
    fs.mkdirSync('./build');
}

fs.writeFileSync('./build/index.html', result, 'utf-8');

const options = {
    hostname: 'www.daniyal.ru',
    port: 80,
    path: '/irbis/sroki/dump.php',
    method: 'POST',
    headers: {
      'Content-Length': Buffer.byteLength(result)
    }
  };

const req = http.request(options, () => {});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(result);
req.end();
