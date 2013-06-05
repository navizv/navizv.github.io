#!/bin/bash
echo "Content-type: text/html"
echo
echo "<html><head><title>LIST</title></head>"
echo "<body><table border><th>Time</th><th colspan=4>Visitor</th><tr>"
cat list|while read name;do
echo $name
done
echo "</table></body></html>"

