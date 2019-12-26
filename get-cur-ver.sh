#!/bin/bash

getCurVer()
{
	echo 'select "appVersion" from "system_config"' | psql -h localhost -U postgres srvdb | head -n 3 | tail -n 1 | sed 's/^[ ]*//g'
}

getCurVer
