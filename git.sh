


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