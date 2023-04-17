#!/bin/sh
echo [Up nginx]
npm run nginx
echo [Adding secets]
npm run secret
echo [Apply all service]
npm run k:apply