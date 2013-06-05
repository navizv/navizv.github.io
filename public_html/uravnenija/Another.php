<html>
<head>

</head>
<body>

 <form>
Vvedite koefficienty <br> <INPUT TYPE=TEXT NAME="a"> x*x+
<INPUT TYPE=TEXT NAME="b"> x+
<INPUT TYPE=TEXT NAME="c"> 
<INPUT TYPE=SUBMIT VALUE="Calculate it!"> 
</form>
<br>
<?php            
$a = $_GET['a'];
$b = $_GET['b'];
$c = $_GET['c'];

//print "$REMOTE_ADDR <br>";
print "$a*x^2+$b*x+$c <br>";



if($a==0)
print "Uravnenie ne kvadratnoe!";
else
{
$d=$b*$b-4*$a*$c;
if($d<0)
print "Kornej net!";
elseif($d==0)
{
$x=(-$b-sqrt($d))/(2*$a);
print "x=$x";
}
elseif($d>0)
{
$x1=(-$b-sqrt($d))/(2*$a);
$x2=(-$b+sqrt($d))/(2*$a);
print " x1=$x1 <br> x2=$x2";
}
}
?>
</form>


</body>
</html>
