#!/bin/sh
echo [ Git add ]
git add .

echo [ Git status ]
git status

echo [ Add a message to a commit?]
read commit


if [ "${commit}" ]; then
echo [ Git commit as: "${commit}"]
  git commit -m "${commit}"
else
echo [ Git commit as: "update"]
  git commit -m "update"
fi


echo ["Need to change commit? [y\n]"]
read commitChange
rechange=y

while [ $rechange == "no"]; do
  echo ["Enter a new commit"]
  read new_commit
  echo [ Git commit as: "$new_commit"]
  echo ["Need to change commit? [y\n]"]
  read reCom
  if [ "${reCom}" =="y" ]; then
    rechange="no"
  else
    git commit --amend "$new_commit"
  fi
done


if [ "${commitChange}" == "y" ]; then
echo ["Enter a new commit"]
read new_commit

echo [ Git commit as: "$new_commit"]

  git commit --amend "$new_commit"
fi


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




