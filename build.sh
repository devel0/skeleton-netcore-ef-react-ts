#!/bin/bash

exdir=$(dirname `readlink -f "$0"`)

"$exdir"/inc-version.sh patch

# image=your-docker-repository/sys
image=myapps/srvapp

cat "$exdir"/srvapp/ClientApp/package.json | sed 's/"version": ".*"/"version": "0.1.0"/g' > "$exdir"/srvapp/ClientApp/package-dkcache.json

SRCDK="$exdir"/Dockerfile
TMPDK="$exdir"/Dockerfile.tmp

# changes to Dockerfile if required to set some env
cat "$SRCDK" | cat "$exdir"/Dockerfile > "$TMPDK"

touch "$exdir"/srvapp/ClientApp/.yalc

docker build -t $image -f "$TMPDK" "$exdir"/.

if [ "$?" != "0" ]; then
    echo "image build failed"
    exit 1
fi

# uncomment follow to push on remote repository
# docker push $image

rm -f "$TMPDK"
rm -f "$exdir"/srvapp/ClientApp/package-dkcache.json

