#!/bin/bash

executing_dir()
{
	dirname `readlink -f "$0"`
}
exdir=$(executing_dir)

cd "$exdir"/srvapp
migrname="migr-$(uuid -F siv)"

echo "---> creating migration [$migrname]"
dotnet ef migrations add $migrname

echo "---> updating database"
dotnet ef database update

cd "$exdir"
