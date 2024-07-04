#!/bin/bash
cd test-server
wget -nc https://piston-data.mojang.com/v1/objects/450698d1863ab5180c25d7c804ef0fe6369dd1ba/server.jar
wget -nc https://download.oracle.com/java/22/archive/jdk-22_linux-x64_bin.tar.gz
tar --verbose --gzip --extract --file=jdk-22_linux-x64_bin.tar.gz --one-top-level=java --strip-components=1