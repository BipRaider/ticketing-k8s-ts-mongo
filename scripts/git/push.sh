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
if [ "${commitChange}" == "y" ]; then

  condition=""
  new_commit="update"

  while [ "${condition}" != "no" ]; do
      echo ["Enter a new commit"]
      read newCommit
      new_commit=$newCommit
      echo [ New commit: "$new_commit"]
      echo ["rechange commit? [y]"]
      read cond
      if [ "${cond}"]; then
        condition=$cond
      else
        git commit --amend -m "$new_commit"
        condition="no"
      fi
  done
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




