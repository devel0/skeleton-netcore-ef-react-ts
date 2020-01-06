#!/bin/bash

if [ "$DOTNET_ROOT" == "" ]; then
	echo "specify DOTNET_ROOT env var"
	exit 0
fi

exdir=$(dirname `readlink -f "$0"`)

rm -fr "$exdir"/srvapp/bin "$exdir"/srvapp/obj
dotnet build "$exdir"/srvapp
#dotnet build /p:CopyLocalLockFileAssemblies=true

# follow required to allow ReinforcedTypings recognize some dll refs
cp -f "$DOTNET_ROOT"/shared/Microsoft.AspNetCore.App/3.1.0/* "$exdir"/srvapp/bin/Debug/netcoreapp3.1/

dstapi="$exdir/srvapp/ClientApp/src/api-autogen/"
rm -fr "$dstapi"

dotnet ~/.nuget/packages/reinforced.typings/1.5.6/tools/netcoreapp3.1/rtcli.dll \
	SourceAssemblies="$exdir/srvapp/bin/Debug/netcoreapp3.1/srvapp.dll" \
        ConfigurationMethod="srvapp.ReinforcedTypingsConfiguration.Configure" \
        TargetDirectory="$dstapi" \
        Hierarchy="true"

echo
echo "---> destination api = [$dstapi]"
