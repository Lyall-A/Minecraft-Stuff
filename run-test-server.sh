#!/bin/bash
cd test-server
node . & ./java/bin/java -jar server.jar --nogui
