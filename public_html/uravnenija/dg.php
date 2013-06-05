<html>
<body bgcolor="green">  <h3>
<?php  
$a=$a*$znaka;
$b=$b*$znakb;
$c=$c*$znakc; 
if($a<0)  $ur="-";
else;
if($a!=1 && $a!=-1 && $a!=0) $ur.="$a";
else;
if($a!=0) $ur.="x<SUP>2</SUP>";
else;
if($b>0 && $a!=0)  $ur.="+";
else;
if($b!=1 && $b!=-1 && $b!=0) $ur.="$b";
else;
if($b!=0) $ur.="x";
else;
if($c>0 && ($a!=0 || $b!=0))  $ur.="+";
else;
if($c!=0) $ur.="$c";
else;
$ur.="=0";
if($a==0)
print "Уравнение $ur не квадратное!";
else
{
$d=$b*$b-4*$a*$c;
if($d<0)
print "У уравнения $ur нет корней!";
elseif($d==0)
{
$x=(-$b-sqrt($d))/(2*$a);
print "У уравнения $ur один корень: <br> x = $x";
}
elseif($d>0)
{
$x1=(-$b-sqrt($d))/(2*$a);
$x2=(-$b+sqrt($d))/(2*$a);
print "У уравнения $ur два корня: <br> x1 = $x1 <br> x2 = $x2";
}
}
?>   
</h3>
</body>
</html>