#!/bin/bash
echo "Content-type: text/html; charset=KOI8-U"
echo
#echo "m=$1 n=$# m=`cat $1` d=$?"
if [ $# == 1 ] ;then
    cat $1
else
    ./print.cgi DNF.htm
fi