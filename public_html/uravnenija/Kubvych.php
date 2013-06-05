<html>
<body bgcolor="green">  <h3>

<?php
//print "RH=$REMOTE_HOST<br>";
//print "RA=$REMOTE_ADDR<br>";
//print "RU=$REMOTE_USER<br>";
/* Primenyaem znaki */

    $a=$a*$znaka;
    $b=$b*$znakb;
    $c=$c*$znakc; 
    $d=$d*$znakd; 
    $tch=(int)$tch;
    $tch=(float)"1E-$tch";
////print "tch=$tch<br>";
/* Formiruem stroku uravnenija */

    if($a == -1) $ur="-";
    else;
    if($a!=1 && $a!=-1 && $a!=0) $ur.="$a";
    else;
    if($a!=0) $ur.="x<SUP>3</SUP>";
    else;
    if($b>0 && $a!=0)  $ur.="+";
    else;
    if($b!=1 && $b!=-1 && $b!=0) $ur.="$b";
    else;
    if($b == -1) $ur.="-";
    else;
    if($b!=0) $ur.="x<SUP>2</SUP>";
    else;
    if($c>0 && ($a!=0 || $b!=0))  $ur.="+";
    else;
    if($c!=1 && $c!=-1 && $c!=0) $ur.="$c";
    else;
    if($c==-1) $ur.="-";
    else;
    if($c!=0) $ur.="x";
    else;
    if($d>0 && ($a!=0 || $b!=0 || $c!=0))  $ur.="+";
    else;
    if($d!=0) $ur.="$d";
    else;
    if($ur=="") $ur.="0";
    else;
    $ur.="=0";

/* Nachinayutsya vychisleniya */

    if($a==0)
	print "Уравнение $ur не кубическое!";
    else
    {
	if($a<0)
	{
	    $a*=-1;
	    $b*=-1;
	    $c*=-1;
	    $d*=-1;
	}
	else;
	$apr=3*$a;
	$bpr=2*$b;
	$cpr=$c;
	$dpr=$bpr*$bpr-4*$apr*$cpr;
	if($dpr<=0)
	{
	    print "У уравнения $ur один корень";
	    $z1=znach(0);
	    if($z1 == 0)
		$k=0;
	    else
	    {
		$step=$z1/abs($z1);
//		print "step = $step ";
		for($x=0;znach(0)*znach($x)>0;$x-=$step);
		$k=koren($x,$x+$step);
	    }
	    print "<BR>x1 = $k";
	    $y=znach($k);
	    print "<font color=\"green\">";
	    print "<BR><BR>y1 = $y";
	}
	else
	{
	    $x1pr=(-$bpr-sqrt($dpr))/(2*$apr);
	    $x2pr=(-$bpr+sqrt($dpr))/(2*$apr);
	    
//	    print "korni proizvodnoj x1=$x1pr x2=$x2pr";
	    
	    $ex1=znach($x1pr);
	    $ex2=znach($x2pr);
	    
	    $znz=$ex1*$ex2;
	    if($znz > 0)
	    {
		print "У уравнения $ur один корень";
		$z1=znach(0);
		if($z1 == 0)
		    $k=0;
		else
		{
		    $step=$z1/abs($z1);
//		    print "step = $step ";
		    for($x=0;znach(0)*znach($x)>0;$x-=$step);
		    $k=koren($x,$x+$step);
		}
		print "<BR>x1 = $k";
	    	$y=znach($k);
		print "<font color=\"green\">";
	    	print "<BR><BR>y1 = $y";
	    }
	    else if($znz == 0)
	    {
		print "У уравнения $ur два корня";
		if($ex1==0)
		{
		    $k1=$x1pr;
		    for($x=$x2pr;$ex2*znach($x)>0;$x+=1);
		    $k2=koren($x-1,$x);
		}
		else
		{
		    for($x=$x1pr;$ex1*znach($x)>0;$x-=1);
		    $k1=koren($x,$x+1);
		    $k2=$x2pr;    
		}
	        print "<BR>x1 = $k1<BR>x2 = $k2";
	    	$y1=znach($k1);
	    	$y2=znach($k2);
		print "<font color=\"green\">";
	    	print "<BR><BR>y1 = $y1<BR>y2 = $y2";
	    }
	    else
	    {
		print "У уравнения $ur три корня";
		for($x=$x1pr;$ex1*znach($x)>0;$x-=1);
		$k1=koren($x,$x+1);
		
		$k2=koren($x1pr,$x2pr);
		
		for($x=$x2pr;$ex2*znach($x)>0;$x+=1);
		
		$k3=koren($x-1,$x);
	        print "<BR>x1 = $k1<BR>x2 = $k2<BR>x3 = $k3";
	    	$y1=znach($k1);
	    	$y2=znach($k2);
	    	$y3=znach($k3);
		print "<font color=\"green\">";
	    	print "<BR><BR>y1 = $y1<BR>y2 = $y2<BR>y3 = $y3";
	    }
	
	    print "<BR>extremum1 = $ex1 extremum2 = $ex2";
	}
    }

    function znach($x)
    {
	global $a,$b,$c,$d;
	return $a*$x*$x*$x+$b*$x*$x+$c*$x+$d;	
    }
    
    function koren( $r, $l )
    {
	global $a,$b,$c,$d,$tch;
//	print "<BR>r=$r,l=$l";

//	for($i=0;$i<20000;$i++)
	while(1)
	{
	    $m = ((float)$r+(float)$l)/2;
//	    print "<BR>m=$m";
//	    $z=znach($m);
//	    print "<BR>z=$z";
	    if( abs(znach($m)) < $tch )
		return $m;
	    if(znach($m)*znach($r)>0)
		$r=$m;
	    else
		$l=$m;
	}
	return $m;
    }
?>   
</h3>
</body>
</html>