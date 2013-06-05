#!/bin/bash
echo "Content-type: text/html"
echo
echo "<html><head><title>no title</title></head>"
echo "<body>no body</body></html>"
echo "<td> `date` <td> $REMOTE_ADDR <td> $REMOTE_HOST <td> $REMOTE_USER <td> $REMOTE_IDENT <tr>">>list
#traceroute -I $REMOTE_ADDR|while read name1 name name2;do
#echo $name >tmp
#done
#e=`cat tmp`
#echo "<td><td> $e <tr>">>list
rm tmp
# $name<br>"
#done
#echo "</body></html>"