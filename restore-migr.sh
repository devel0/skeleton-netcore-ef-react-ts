#!/bin/bash

executing_dir()
{
        dirname `readlink -f "$0"`
}
exdir=$(executing_dir)

migrations_fld="$exdir"/srvapp/Migrations

echo "this will replace [$migrations_fld] with data from db migrations backup."
echo "press a key to continue or CTRL+C to abort"
read -n 1

cd "$exdir"/srvapp
ASPNETCORE_ENVIRONMENT=Development dotnet run --restore-migrations "$exdir"/srvapp/Migrations
