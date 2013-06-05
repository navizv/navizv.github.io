#!/usr/bin/perl

print<<The_end;
Content-type: text/html; charset=KOI8-U


<html>
<head>
    <title>smbstatus</title>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
    <link rel="stylesheet" type="text/css" href="../style.css">
</head>
<body>
 <h1 align="center">smbstatus</h1><hr/>
 <table align="center" border="1px" cellpadding="5px">
    <tr bgcolor="silver">
    <th>Username
    <th>Info
    <th>Computer
    <tr>

The_end

%was = ();
for $_ (`smbstatus -S|sort -k 5`)
{
	@line = /\S+/g;
	if (not ($line[3] =~ /\d+/) || (1 == $was{$line[3]})) { next; }
	print "<td>$line[1]<td>$line[2]<td>$line[4]<tr>";
	$was{$line[3]} = 1; # set as "used"
}



print "</table></body></html>";


