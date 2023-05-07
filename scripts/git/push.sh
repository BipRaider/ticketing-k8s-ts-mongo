#!/bin/sh
echo [ Git add ]
git add .

echo [ Git status ]
git status

echo [ Add a message to a commit? "Updated: "]
read commit

echo [ Git commit as: "Updated: ${commit}"]
git commit -m "Updated: ${commit}"

echo ["Need to raise version? [y\n]"]
read version
if [ "${version}" == "y" ]; then
  npm version patch
fi

echo ["Make git push?[y\n]"]
read push
if [ "${push}" == "y" ]; then
  git push
fi




