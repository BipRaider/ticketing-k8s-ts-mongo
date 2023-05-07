#!/bin/sh
echo [Git add ]
git add .

echo "Add a message to a commit?"
read namespace

echo [Git commit]
git commit -m "${namespace}"

echo [Up version package]
npm version patch

echo [Git push]
git push



