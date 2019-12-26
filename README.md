# skeleton netcore ef react ts

## features

- single solution debug ( just open in code, hit F5, to debug server and client )
- server side
    - net core ef code-first ( with reverse db diagram and typescript generation )
    - net core webapi http2
- client side
    - react typescript ( babel, rollup, webpack )
    - json with [preserve reference](https://github.com/devel0/json-serialize-refs#readme) that allow circular refs
- docker builder
    - allow to cache nuget, npmjs packages

## requirements

- [psql db server](https://github.com/devel0/knowledge/blob/4275a7062f0126631d961afbd0c9d5b5154002d7/doc/create-pgsql-container.md)
- (optional) for db diagramming install [schema crawler](https://github.com/devel0/knowledge/blob/4275a7062f0126631d961afbd0c9d5b5154002d7/doc/psql-schema-crawler.md#L3-L9)
- (optional) for deploy in docker
    - [docker-ubuntu](https://github.com/devel0/docker-ubuntu/blob/c22ed8a57767a23c6af0ea814f693035e67a8351/README.md#L7-L12)
    - [docker-dotnet](https://github.com/devel0/docker-dotnet/blob/a7e3f3312e5f8aa66c7c401d89daf3c7b0a1dae4/README.md#L12-L17)

## quickstart

### clone

```sh
git clone https://github.com/devel0/skeleton-netcore-ef-react-ts.git YOURPRJ
cd YOURPRJ
code .
```

### configure your variables

| token | description |
|---|---|
| srvapp | name of the application server+client |
| srvdb | name of database |
| dbhost | host of database |
| dbname | name of database |

### set pgpass for dev db scripts

- [see here](https://github.com/devel0/knowledge/blob/4275a7062f0126631d961afbd0c9d5b5154002d7/doc/psql-password-in-file.md)

### tune config.json

- hit F5 first time to autocreate `~/.config/srvapp/config.json` file
- tune variables into `config.json` to allow server db connection ( note: if use localhost instead an ip then config will not work for dockerized version )

### create database and apply first migration

```sh
echo "create database srvdb | psql -h localhost -U postgres"
./add-migr.sh
```

### start

- from `CTRL+SHIFT+D` select `.NET Core Launch (web)`
- hit F5 from vscode to start server-client

from vscode terminal ``ctrl+` ``

## build and run container

```sh
docker run -p 5555:5000 -v ~/tmp/srvapp-data:/data -v ~/.config/srvapp/config.json:/data/config.json myapps/srvapp
```

output

```
---> env.EnvironmentName=[Production] ; env.IsDevelopment=False
warn: Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager[35]
      No XML encryptor configured. Key {db173e85-4a34-497e-9559-0ad8da926988} may be persisted to storage in unencrypted form.
Hosting environment: Production
Content root path: /app
Now listening on: http://[::]:5000
Application started. Press Ctrl+C to shut down.
```

try connect to `http://localhost:5555`

of course for an online usage an https crypt required ( for that use nginx and a letsencrypt certificate )

## update database and diagram

- create/modify tables in `srvapp/Types/db`
- edit `srvapp/MyDbContext.cs` to add [set]() and [constraints]() such as indexes, unique indexes if required
- execute a new migration `./add-migr.sh`

### about Migrations folder

- :warning: `srvapp/Migrations` folder not in git ( because other developers may work on other stage of migrations on other database hosts )
- take care to maintain `Migrations` for official or production database in order to apply new migrations
