#!/usr/bin/perl

print "Content-type: text/html\n\n";
print "<table border>";
print "<th>N</th><th colspan=2>name</th><tr>";

$w = `who`;
@sp = split(/\n/,$w);
@sp=sort(@sp);
$t=1;
for($i=0; $sp[$i] ; $i++){
    @name1 =split(/\b/,$sp[$i]);
    @name2 =split(/\b/,$sp[$i+1]);
    if($name1[0] cmp $name2[0]){
        print "<td>";
	print $t;
	print "<td>";
	#print $name1[14];
	#print " ";
	print $sp[$i];
        print "<td>";
	#print "<tr>";
	if($t > 1){
	    print "&&&&&";
	}
	else{
	    print "&nbsp;";
	}
	$t=1;
	print "<tr>";
    }
    else{
	if($name1[14] cmp $name2[14]){
	    print "<td>";
	    print $t;
	    print "<td>";
	    print $sp[$i];
	    print "<td>";
	    if(t > 1){
		print "&&&&&";
	    }
	    else{
	        print "&nbsp;";
	    }
	    print "<tr>";
	    $t=1;
	    #$i++;
	}
	else{
	    $t++;
	}
    }
    #print "<tr>";
}
print "</table>";