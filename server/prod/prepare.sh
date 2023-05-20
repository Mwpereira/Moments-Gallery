#!/bin/bash
cp "../package.json" "../dist"
cp "../.env" "../dist"
if [[ "$OSTYPE" == "msys" ]]
then
  tar.exe -a -c -f prod.zip "../dist"
else
  zip prod.zip "../dist"
fi
scp -i "TLGenesis.pem" -r "prod.zip" #ec2-user@ec2IP.compute-1.amazonaws.com:/home/ec2-user
exec bash
