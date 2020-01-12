#!/bin/bash

executing_dir()
{
        dirname `readlink -f "$0"`
}
exdir=$(executing_dir)

cd "$exdir"/srvapp
ASPNETCORE_ENVIRONMENT=Development dotnet run --backup-migrations "$exdir"/srvapp/Migrations

