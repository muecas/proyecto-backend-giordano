## Listar procesos para el comando (OSX)

Listar todos los procesos de app.ts: 

`ps -ax | grep app.ts`

Resultado modo `fork` (`ts-node app.ts`):

```
4504 ttys000    0:03.36 node /usr/local/bin/ts-node app.ts
4517 ttys001    0:00.00 grep app.ts # proceso línea de comando
```

Resultado modo `cluster` (`ts-node app.ts --mode=cluster --cpus=4`):

```
4555 ttys000    0:03.33 node /usr/local/bin/ts-node app.ts --mode=cluster --cpus=4
4558 ttys000    0:05.43 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts --mode=cluster --cpus=4
4559 ttys000    0:05.32 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts --mode=cluster --cpus=4
4560 ttys000    0:05.37 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts --mode=cluster --cpus=4
4561 ttys000    0:05.39 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts --mode=cluster --cpus=4
4564 ttys001    0:00.00 grep app.ts # proceso línea de comando
```

## Utilizando Forever

No funcionó con mi versión de OS/Node, no puedo correr `forever`.

Comando:

`forever ts-node app.ts --mode=fork`

Errores:

````
warn:    --minUptime not set. Defaulting to: 1000ms
warn:    --spinSleepTime not set. Your script will exit if it does not stay up for at least 1000ms
(node:5228) Warning: Accessing non-existent property 'padLevels' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
(node:5228) Warning: Accessing non-existent property 'padLevels' of module exports inside circular dependency
error:   Cannot start forever
error:   script /Users/luciano/Dropbox/Git/backend/desafios/13/ts-node does not exist.

````

## Utilizando PM2

Requiere `pm2 install typescript` y `pm2 install ts-node`

Listar todos los procesos de PM2:

`pm2 list`

Resultado modo `fork` (`pm2 start app.ts --watch`):

````
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 1   │ app        │ default     │ 1.0.0   │ fork    │ 6110     │ 8s     │ 2    │ online    │ 0%       │ 240.0mb  │ luciano  │ enabled  │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
````

Resultado modo `cluster` (`pm2 start app.ts --name="Server" --watch -i 4 `):

````
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 2   │ Server     │ default     │ 1.0.0   │ cluster │ 6240     │ 0s     │ 0    │ online    │ 0%       │ 92.1mb   │ luciano  │ enabled  │
│ 3   │ Server     │ default     │ 1.0.0   │ cluster │ 6241     │ 0s     │ 0    │ online    │ 0%       │ 55.8mb   │ luciano  │ enabled  │
│ 4   │ Server     │ default     │ 1.0.0   │ cluster │ 6246     │ 0s     │ 0    │ online    │ 0%       │ 43.6mb   │ luciano  │ enabled  │
│ 5   │ Server     │ default     │ 1.0.0   │ cluster │ 6251     │ 0s     │ 0    │ online    │ 0%       │ 29.6mb   │ luciano  │ enabled  │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
````

## Servidor Nginx

### Configuración 1

Archivo de configuración `nginx-02.conf`

Ejecutar el servidor principal (servidor único corriendo en el puerto 8080):

`pm2 start app.ts --name="main" --watch -- --port=8081`

Crear cluster de servidores:

`pm2 start app.ts --name="cluster1" --watch -- --mode=cluster --cpus=4 --port=8082`

Esto generará 2 instancias del servidor:

- http://localhost:8081
- http://localhost:8082

El 8081 para el proceso principal y el cluster de 4 subprocesos en 8082 para `/api/randoms`

Utilicé el 8081 para el principal dado que Nginx en mi máquina no era capaz de rutear otro nombre de servidor que no fuese `localhost`, por lo que `localhost:8080` rsponde a Nginx y `localhost:8081/5` responde al proceso de node.

`pm2 list` devolvería entonces:

```
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 3   │ cluster    │ default     │ 1.0.0   │ fork    │ 3622     │ 0s     │ 0    │ online    │ 0%       │ 1.4mb    │ luciano  │ enabled  │
│ 2   │ main       │ default     │ 1.0.0   │ fork    │ 3604     │ 8s     │ 0    │ online    │ 0%       │ 248.9mb  │ luciano  │ enabled  │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

y `ps -ax | grep app.ts` devolvería entonces:

```
 4100 ??         0:03.19 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts  
 4117 ??         0:03.21 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts     
 4133 ??         0:04.26 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts     
 4134 ??         0:04.23 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts     
 4135 ??         0:04.29 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts     
 4136 ??         0:04.25 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts     
 4142 ttys000    0:00.00 grep app.ts
```

### Configuración 2

Archivo de configuración `nginx-02.conf`

Ejecutar el servidor principal (servidor único corriendo en el puerto 8080):

`pm2 start app.ts --name="main" --watch -- --port=8081`

Crear cluster de 4 servidores:

`pm2 start app.ts --name="cluster1" --watch -- --port=8082`

`pm2 start app.ts --name="cluster2" --watch -- --port=8083`

`pm2 start app.ts --name="cluster3" --watch -- --port=8084`

`pm2 start app.ts --name="cluster4" --watch -- --port=8085`

Esto generará 5 instancias del servidor:

- http://localhost:8081
- http://localhost:8082
- http://localhost:8083
- http://localhost:8084
- http://localhost:8085

El 8081 para el proceso principal y el cluster de 4 servidores en 8082/5 para `/api/randoms`

Utilicé el 8081 para el principal dado que Nginx en mi máquina no era capaz de rutear otro nombre de servidor que no fuese `localhost`, por lo que `localhost:8080` rsponde a Nginx y `localhost:8081/5` responde al proceso de node.

`pm2 list` devolvería entonces:

```
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 9   │ cluster1    │ default     │ 1.0.0   │ fork    │ 8856     │ 31s    │ 0    │ online    │ 0%       │ 210.7mb  │ luciano  │ enabled  │
│ 10  │ cluster2    │ default     │ 1.0.0   │ fork    │ 8891     │ 12s    │ 0    │ online    │ 0%       │ 247.0mb  │ luciano  │ enabled  │
│ 11  │ cluster3    │ default     │ 1.0.0   │ fork    │ 8911     │ 6s     │ 0    │ online    │ 0%       │ 246.0mb  │ luciano  │ enabled  │
│ 12  │ cluster4    │ default     │ 1.0.0   │ fork    │ 8928     │ 0s     │ 0    │ online    │ 0%       │ 1.0mb    │ luciano  │ enabled  │
│ 8   │ main        │ default     │ 1.0.0   │ fork    │ 8838     │ 39s    │ 0    │ online    │ 0%       │ 216.4mb  │ luciano  │ enabled  │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

y `ps -ax | grep app.ts` devolvería entonces:

```
 8966 ??         0:04.34 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts  
 8967 ??         0:04.40 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts   
 8968 ??         0:04.44 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts   
 8969 ??         0:04.46 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts   
 8970 ??         0:04.43 node /Users/luciano/Dropbox/Git/backend/desafios/13/app.ts   
 9004 ttys000    0:00.00 grep app.ts
```