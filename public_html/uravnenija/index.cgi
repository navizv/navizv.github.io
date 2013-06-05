#!/usr/bin/perl

print<<The_end;
Content-type: text/html; charset=KOI8-U

<html>
<head>

</head>
<body bgcolor="gray">
<ul>
<lh><a>Программы для решения уравнений:</a><lh>

    <li><a href = "print.cgi?Main.htm">квадратных</a><!--(или 
    <a href ="l.cgi">вот ещё</a>)-->
    <li><a href = "print.cgi?m1.htm">кубических</a>
</ul>
</body>
</html>


The_end


#`../obli.cgi`;
#print "vcs";