<? header('Content-type: text/html; charset=windows-1251'); ?>
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
    <td><b>Username</b></td>
    <td><b>Computer</b></td>
    <td><b>Info</b></td>
   </tr>
<!-- PHP -->
<?

$T_NSU = array(
	'wsc101' => NULL,
	'wsc102' => NULL,
	'wsc103' => NULL,
	'wsc104' => NULL,
	'wsc105' => NULL,
	'wsc106' => NULL,
	'wsc107' => NULL,
	'wsc108' => NULL,
	'wsc109' => NULL,
	'wsc110' => NULL,
	'wsc111' => NULL,
	'wsc112' => NULL
);

$T_SK = array(
	'wsc201' => NULL,
	'wsc202' => NULL,
	'wsc203' => NULL,
	'wsc204' => NULL,
	'wsc205' => NULL,
	'wsc206' => NULL,
	'wsc207' => NULL,
	'wsc208' => NULL,
	'wsc209' => NULL,
	'wsc210' => NULL,
	'wsc211' => NULL,
	'wsc212' => NULL,
	'wsc213' => NULL
);

$fp = fopen('http://ccfit.nsu.ru/~romankov/smbstatus/smb.cgi', 'r');
while ($buf = fgets($fp, 1024))
{
	$buf = explode(':', $buf);
	$pw = posix_getpwnam($buf[0]);
	echo '<tr><td>'.$buf[0].'</td><td>'.$buf[2]
		.'</td><td>'.$pw['gecos'].', '.$buf[1]."</td></tr>\n";
}
fclose($fp);

?>
<!-- ~PHP -->
  </table>
 </body>
</html>
