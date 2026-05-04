## This project is made with ❤️ by Safiullah

make sure you have .env file and variable name as

- DATABASE_URL=your-postgres-SQL-db-url
- PORT=3000

## Please DO NOT RUN index.html file in your browser to view the project instead run command inside base directory

```bash
    npm install
    node server.js
```

## once configured open below url in terminal

```bash

        http://localhost:3000/index.html

```

## Hard kill port if not server.js gives error like

```bash
    node server.js
    node:events:486
        throw er; // Unhandled 'error' event
        ^

    Error: listen EADDRINUSE: address already in use :::3000
        at Server.setupListenHandle [as _listen2] (node:net:1940:16)
        at listenInCluster (node:net:1997:12)
        at Server.listen (node:net:2102:7)
        at app.listen (C:\Users\safiu\Downloads\eduspark\eduspark\node_modules\express\lib\application.js:635:24)
        at Object.<anonymous> (C:\Users\safiu\Downloads\eduspark\eduspark\server.s:174:5)
        at Module._compile (node:internal/modules/cjs/loader:1760:14)
        at Object..js (node:internal/modules/cjs/loader:1893:10)
        at Module.load (node:internal/modules/cjs/loader:1480:32)
        at Module._load (node:internal/modules/cjs/loader:1299:12)
        at TracingChannel.traceSync (node:diagnostics_channel:328:14)
        Emitted 'error' event on Server instance at:
        at emitErrorNT (node:net:1976:8)
        at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    code: 'EADDRINUSE',
    errno: -4091,
    syscall: 'listen',
    address: '::',
    port: 3000
    }

    Node.js v24.11.0
```

Then run below command

```bash
       npx kill-port 3000
       node server.js
```
