<html><head><title>test</title></head><body>
<?php
echo "a=$a<br/>";
$a = $_GET['a'];
echo "a=$a<br/>";
echo "Hello!<br/>";
foreach ($_ENV as $k => $v) {
    echo "$k = $v<br/>";
}
//phpinfo( );
?>
</body></html>