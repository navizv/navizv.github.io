#!/bin/bash

echo "Content-type: text/html; charset=KOI8-U"
echo
echo "<HTML>"
echo "<HEAD>"
echo "<TITLE>Hello World</TITLE>"
echo "</HEAD>"
echo "<BODY>"
echo "<h1>Greeting!!</h1>"

echo "$#<br>"
echo "qwertyy="
echo "$1<br>"
echo "qwertyy="
echo "$a<br>"

echo "<br>"

#echo "$HTTP_USER_AGENT <br>"
#echo "$REMOTE_ADDR"
echo `./a.out -v`

echo "</BODY></HTML>"