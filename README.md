# SQLTemplate

SQLTemplate is a simple SQL template engine and query runner for Node.js.

## Installation

```
npm install node-sql-template --save
```

## Usage

### Template rendering

`/sql/example-1.sql`

```sql
SELECT ?
```

`/index.js`

```javascript

var
    SQLTemplate = require('node-sql-template');

var
    options = {
        template: {
            dir: path.resolve(__dirname, './sql'),
            ext: 'sql'
        }
    },
    template = SQLTemplate.forge(options);

console.log(template.render('example-1', [ 1 ])); // SELECT 1
```

### Query execution w/ callback

`/sql/example-2.sql`

```sql
SELECT * FROM `player` WHERE `name` LIKE ?
```

`/index.js`

```javascript

var
    SQLTemplate = require('node-sql-template');

var
    options = {
        template: {
            dir: path.resolve(__dirname, './sql'),
            ext: 'sql'
        },
        
        // https://github.com/felixge/node-mysql#connection-options
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'root'
        }
    },
    template = SQLTemplate.forge(options);

template.run('example-2', [ 'A%' ], function (error, rows) {
    console.log(error, rows);
});
```

### Query execution w/o callback

`/sql/example-2.sql`

```sql
SELECT * FROM `player` WHERE `name` LIKE ?
```

`/index.js`

```javascript

var
    SQLTemplate = require('node-sql-template');

var
    options = {
        template: {
            dir: path.resolve(__dirname, './sql'),
            ext: 'sql'
        },

        // https://github.com/felixge/node-mysql#connection-options
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'root'
        }
    },
    template = SQLTemplate.forge(options),

    stream = template.run('example-2', [ 'A%' ]);

stream
    .on('error', function (error) {

    })
    .on('result', function (row) {

    })
    .on('fields', function (fields) {

    })
    .on('end', function (end) {

    });
```
