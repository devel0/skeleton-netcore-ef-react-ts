#!/bin/bash

executing_dir()
{
	dirname `readlink -f "$0"`
}
exdir=$(executing_dir)

cd "$exdir"/srvapp
#migrname="migr-$(uuid -F siv)"
migrname="migr-$(date -u -Is)"

echo "---> creating migration [$migrname]"
dotnet ef migrations add $migrname

echo "---> updating database"
dotnet ef database update

if [ "$?" != "0" ]; then
	echo "*** skip backup migrations"
else
	echo "---> backup migrations"
	"$exdir"/backup-migr.sh

	cd "$exdir"

	echo "If you working on a shared db is suggested to commit/push your sources now so that other developers can restore migrations from database with accordingly code-first sources"
fi