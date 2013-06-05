var wsh=WScript.CreateObject("WScript.Shell");
wsh.SendKeys("{NUMLOCK}");
while(true)
{
	wsh.SendKeys("{CAPSLOCK}");
	WScript.Sleep("300");
	wsh.SendKeys("{NUMLOCK}");
	wsh.SendKeys("{SCROLLLOCK}");
	WScript.Sleep("300");
	wsh.SendKeys("{NUMLOCK}");
	wsh.SendKeys("{CAPSLOCK}");
	WScript.Sleep("300");
	wsh.SendKeys("{SCROLLLOCK}");
}