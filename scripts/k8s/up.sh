#!/bin/sh
echo [Up nginx]
npm run nginx
echo [Apply all service]
npm run k:apply