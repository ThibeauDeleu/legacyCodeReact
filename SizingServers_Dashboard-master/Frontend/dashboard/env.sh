#!/bin/bash
folder=$1

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment 
echo "window._env_ = {" >> ./env-config.js

for d in $folder/*; do
    while read -r line || [[ -n "$line" ]];
    do
    # Split env variables by character `=`
    varname=${d##*/}
    varname=${varname// /_}
    varvalue=$(printf '%s\n' "$line")

    # # Read value of current variable if exists as Environment variable
    # value=$(printf '%s\n' "${!varname}")
    # # Otherwise use value from .env file
    # [[ -z $value ]] && value=${varvalue}
    
    # Append configuration property to JS file
    echo "  $varname: \"$varvalue\"," >> ./env-config.js
    done < "$d"
done

echo "}" >> ./env-config.js