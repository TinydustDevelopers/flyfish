#!/bin/bash

REPODIR=$1
REPOGITDIR=${REPODIR}'/.git'

echo $REPODIR
echo $REPOGITDIR

if [ -d $REPOGITDIR ]
then
	cd $REPODIR
  git pull origin master
else
  mkdir -p $REPODIR
  cd $REPODIR
  git init
  git remote add origin $2
  git pull origin master
fi
