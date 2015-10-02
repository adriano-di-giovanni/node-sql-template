# SQLTemplate

SQLTemplate is a simple SQL template engine and query runner for Node.js.

## Installation

```
npm install node-sql-template mysql --save
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
    path = require('path');

var
    SQLTemplate = require('node-sql-template');

var
    options = {
        template: {
            dir: path.resolve(__dirname, './sql'),
            ext: 'sql'
        }
    },
    template = SQLTemplate.forge(options),

    // escape values are optional
    // see https://github.com/felixge/node-mysql#escaping-query-values
    // see https://github.com/felixge/node-mysql#escaping-query-identifiers
    escape = [ 1 ];

console.log(template.render('example-1', escape)); // SELECT 1
```

### Query execution w/ callback

`/sql/example-2.sql`

```sql
SELECT * FROM `player` WHERE `name` LIKE ?
```

`/index.js`

```javascript

var
    path = require('path');

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
            password: 'root',
            multipleStatements: true
        },

        isDebug: true // sql will be output to the console upon #run()
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
    path = require('path');

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
            password: 'root',
            multipleStatements: true
        },

        isDebug: true // sql will be output to the console upon #run()
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

## Change Log

### 0.2.3

Fix package definition

### 0.2.2

Add `#end()` method to release connection pool.

### 0.2.1

Add `isDebug` option to output sql upon `#run()`.

### 0.2.0

you now need to also `npm install` mysql package
