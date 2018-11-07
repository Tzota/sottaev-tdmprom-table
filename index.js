const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const {page} = require('./utils');

const records = parse(
    fs.readFileSync('./input.csv', 'utf-8'),
    {
        columns: ['name', 'from', 'due', '_', '_2', '_3', '_4', '_5'],
        delimiter: ';',
        skip_empty_lines: true,
        cast: (value, {column}) => {
            if (!['from', 'due'].includes(column)) return value;

            let parts = value.split('/');
            if (parts.length === 3) {
                return new Date(parts[2], parts[0] - 1, parts[1]);
            }
            parts = value.split('.');

            if (parts.length === 3) {
                return new Date(+parts[2] + (parts[2] < 2000 ? 2000 : 0) , parts[1] - 1, parts[0]);
            }

            return '';
        },
    },
);

const [headers, ...data] = records;
const stop = new Date(headers._);
const result = page(data, stop);

try {
    fs.accessSync('./build');
} catch (error) {
    fs.mkdirSync('./build');
}

fs.writeFileSync('./build/index.html', result, 'utf-8');
