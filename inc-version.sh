#!/bin/bash

if [ "$1" == "" ]; then
	echo "specify patch, minor or major"
	exit 0
fi

exdir=$(dirname `readlink -f "$0"`)

cd "$exdir"/srvapp/ClientApp

npm version $1

cd "$exdir"

exit 0

getCurVer()
{
	echo 'select "appVersion" from "system_config"' | psql -h localhost -U postgres srvdb | head -n 3 | tail -n 1 | sed 's/^[ ]*//g'
}

curVer=$(getCurVer)

echo "current version = [$curVer]"

let v=0
if [ "$curVer" != "initial" ]; then
	let v=$curVer+1
else
	v=1
fi

echo "update \"system_config\" set \"appVersion\"=$v" | psql -h localhost -U postgres srvdb >/dev/null

echo "next version = [$(getCurVer)]"
