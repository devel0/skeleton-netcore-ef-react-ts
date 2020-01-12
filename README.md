# skeleton netcore ef react ts

skeleton for netcore, db ef code-first ( server side ) + react typescript, json preserve ref ( client side ) solution and docker builder

---

- [recent changes](#recent-changes)
- [features](#features)
- [requirements](#requirements)
- [quickstart](#quickstart)
- [build and run container](#build-and-run-container)
- [update database and diagram](#update-database-and-diagram)
  * [backup migrations](#backup-migrations)
  * [restore migrations](#restore-migrations)
  * [automatic backup/restore migration test](#automatic-backuprestore-migration-test)
- [description of example](#description-of-example)

---

![](doc/example.gif)

## recent changes

- automatic backup/restore migrations
- dialog `msg` interpret html
- react-scripts 3.3.0 ( support optional chaining )
- centralized webapi try catch

## features

- single solution debug ( just open in code, hit F5, to debug server and client )
- server side
    - net core ef code-first ( with reverse db diagram and typescript generation )
    - net core webapi http2
    - db triggers [example](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/0ab3f72a1505170e2856b9de0bae2cd7cacdc55c/srvapp/MyDbContext.cs#L147)
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
    - [docker-dotnet](https://github.com/devel0/docker-dotnet/blob/b1d4f3be7938505cbd48e460e7274398b85a4d32/README.md#L11-L16)

## quickstart

**clone**

```sh
git clone https://github.com/devel0/skeleton-netcore-ef-react-ts.git YOURPRJ
cd YOURPRJ
code .
```

**configure your variables**

| token | description |
|---|---|
| srvapp | name of the application server+client |
| srvdb | name of database |

| variable | description |
|---|---|
| dbhost | host of database |
| dbname | name of database |

| file | tokens to replace |
|---|---|
| add-migr.sh | srvapp |
| backup-migr.sh, restore-migr.sh | srvapp |
| build.sh | srvapp |
| Dockerfile | srvapp |
| gen-ts.sh | srvapp |
| gen-db-dia.sh | srvdb, dbname, dbhost |
| get-cur-ver.sh | srvdb |
| inc-version.sh | srvapp, srvdb |
| srvapp/Code/Global.cs | srvapp, srvdb, dbname, dbhost |

**set pgpass for dev db scripts**

- [see here](https://github.com/devel0/knowledge/blob/4275a7062f0126631d961afbd0c9d5b5154002d7/doc/psql-password-in-file.md)

**tune config.json**

- hit F5 first time to autocreate `~/.config/srvapp/config.json` file
- tune variables into `config.json` to allow server db connection ( note: if use localhost instead an ip then config will not work for dockerized version )

**create database and apply first migration**

```sh
echo "create database srvdb | psql -h localhost -U postgres"
./add-migr.sh
```

**autgen typescript**

```sh
./gen-ts.sh
```

**start**

- from `CTRL+SHIFT+D` select `.NET Core Launch (web)`
- hit F5 from vscode to start server-client

**add other packages**

```sh
cd srvapp/ClientApp
npm install other-lib --save
npm install @types/other-lib --save-dev
```

## build and run container

```sh
docker run -p 5555:5000 -v ~/tmp/srvapp-data:/data -v ~/.config/srvapp/config.json:/data/config.json myapps/srvapp
```

output

```
---> env.EnvironmentName=[Production] ; env.IsDevelopment=False
Hosting environment: Production
Content root path: /app
Now listening on: http://[::]:5000
Application started. Press Ctrl+C to shut down.
```

try connect to `http://localhost:5555`

of course for an online usage an https crypt required ( for that use nginx and a letsencrypt certificate )

## update database and diagram

![](doc/db/db.png)

- create/modify tables in `srvapp/Types/db`
- edit `srvapp/MyDbContext.cs` to add [set](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/MyDbContext.cs#L112-L114) and [constraints](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/MyDbContext.cs#L89-L98) such as indexes, unique indexes if required
- execute a new migration `./add-migr.sh`

**about Migrations folder**

- :warning: `srvapp/Migrations` folder not in git ( because other developers may work on other stage of migrations on other database hosts )
- take care to maintain `Migrations` for official or production database in order to apply new migrations
- if you lost Migrations folder on an official db a workaround to reget in sync is the following:
    - from psql `create database anotherdb`
    - tune `config.json` to point `anotherdb`
    - remove `srvapp/Migrations` folder if any
    - issue an `./add-migr.sh`
    - edit `__EFMigrationsHistory` on official database so that equals to `anotherdb` table ( should there only 1 row `MigrationId`,`ProductVersion` )
    - gets back `config.json` to official database name
    - now if your official database was in sync with latest code-first changes you can run another `./add-migr.sh` without errors
    - if your official db was out of sync you need to integrate by hand what missed and here you can inspect the `srvapp/Migrations` folder converted to SQL scripts using following `cd srvapp; dotnet ef migrations script > manual.sql` then applying some of `manual.sql` depending on whats lacks

- an experimental tool that take care to backup automatically migrations is provided (see below), this way you have not to worry about migrations backup because db have its own. :family: If you working in team on a common database you have to apply follow procedure before any db `./add-migr.sh` command:
    - pull latest sources
    - ./restore-migr.sh
then
    - commit/push your sources

### backup migrations

this task is automatically applied just after `./add-migr.sh` and provied to zip `Migrations` folder copying to database `migrations_backup` table

or run manually through `./backup-migr.sh`

output

```sh
devel0@tuf:~/Documents/opensource/skeleton-netcore-ef-react-ts$ ./backup-migr.sh 
---> backup migrations from [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations] to db
  - zipping
  - copying to db
```

### restore migrations

`./restore-migr.sh`

output

```sh
devel0@tuf:~/Documents/opensource/skeleton-netcore-ef-react-ts$ ./restore-migr.sh 
this will replace [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations] with data from db migrations backup.
press a key to continue or CTRL+C to abort

---> restore migrations from db to [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations]
  - copying from db
  - found    6.4 Kb size migrations zip
  - extracting to [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations]
```

### automatic backup/restore migration test

```sh
devel0@tuf:~/Documents/opensource/skeleton-netcore-ef-react-ts$ ./add-migr.sh 
---> creating migration [migr-2020-01-12T10:14:13+00:00]
...
---> updating database
...
---> backup migrations
---> backup migrations from [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations] to db
  - zipping
  - copying to db
If you working on a shared db is suggested to commit/push your sources now so that other developers can restore migrations from database with accordingly code-first sources
```

- simulate deletion of Migrations folder

```sh
rm -fr srvapp/Migrations
```

- try `./add-migr.sh` again and you'll receive error

```sh
devel0@tuf:~/Documents/opensource/skeleton-netcore-ef-react-ts$ ./add-migr.sh 
---> creating migration [migr-2020-01-12T10:16:49+00:00]
...
---> updating database
...
42P07: relation "migrations_backup" already exists
*** skip backup migrations
```

- recover using `./restore-migr.sh`

```sh
devel0@tuf:~/Documents/opensource/skeleton-netcore-ef-react-ts$ ./restore-migr.sh 
this will replace [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations] with data from db migrations backup.
press a key to continue or CTRL+C to abort

---> restore migrations from db to [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations]
  - copying from db
  - found   10.1 Kb size migrations zip
  - extracting to [/home/devel0/Documents/opensource/skeleton-netcore-ef-react-ts/srvapp/Migrations]
```

- now `./add-migr.sh` will work again

## description of example

- fake authentication ( need to implement your own auth logic )
- two buttons ( add creates new record, get retrieve list of record )
- database store ( eg. [ExampleStore](srvapp/ClientApp/src/components/store/ExampleStore.tsx) ) uses [react-hookstore](https://github.com/jhonnymichel/react-hookstore#readme) to allow working on store from any part of the code with reflection of [result](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/ClientApp/src/components/Home.tsx#L35)
- Datetime
    - in C# DateTime can store Kind local, utc or unspecified and npgsql DateTime gets back from DB as Unspecified so a [little auto-conversion](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/cc4bfcf1700708628c18be6b98bb2e69586b625d/srvapp/Types/db/SampleTable.cs#L26) needed
    - in Javascript Date mean only localtime
    - when C# DateTime is correcly kinded to UTC will serialized into json as "Z" ending ( utc time ) and correctly converted back when [parseRefsResponse](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/cc4bfcf1700708628c18be6b98bb2e69586b625d/srvapp/ClientApp/src/components/store/ExampleStore.tsx#L67) into objet

**keynotes**

- server
    - [setup of Newtonsoft JSON](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Startup.cs#L33-L36) serializer to preserve ref
    - connect [Global](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Startup.cs#L40) singleton
    - add [db context](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Startup.cs#L44-L49) with [npgsql plugin](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Startup.cs#L124-L126)
    - webapi generic [request](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Types/CommonRequest.cs#L12-L16) and [response](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Types/CommonResponse.cs#L40-L44)
    - db context [ctx](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Controllers/CommonController.cs#L26) injected into common controller
    - db connect on a [config.json](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Code/Config.cs#L11)
    - [add](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Controllers/ExampleController.cs#L21-L41) and [list](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Controllers/ExampleController.cs#L43-L60) webapi samples
    - design [constraint of tables](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/Types/db/SampleTable.cs#L13) through interfaces
- client
    - version app request [update check](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/ClientApp/src/index.tsx#L22)
    - general [layout](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/ClientApp/src/App.tsx#L32-L51) with appbar and router switch with public and private routes
    - [error page](https://github.com/devel0/skeleton-netcore-ef-react-ts/blob/90c6e00a56434fba57119c708f7803b3ef3dffc5/srvapp/ClientApp/src/components/ErrorPage.tsx#L69) that shows server exception