<!-- Filename: cookie.js -->
<!-- Created December 3, 2003 by Leah Culver -->
<!-- Last modified 12/18/2003 by Leah Culver -->

//This div is supposed to look like a prompt box
//to prompt a user for their name after they have
//a high score.

document.write("<div id='highScoreDialogue'")
document.write("style='position:absolute;")
document.write("visibility: hidden;")
document.write("background-color:#ffffff; layer-background-color:#ffffff;'>")
document.write("<table width=300><tr><td class=border>")
document.write("<table width=100%><tr><td class=input align=center>")
document.write("<br>Congratulations!")
if(klondike)
	document.write("<br>You have a high score.")
else if(freecell)
	document.write("<br>You have a fast time.")
document.write("<br><br>Please enter your name:")
document.write("<br><input type=text id='inputName' size='14' maxlength=8 value ='' align=right style='color: #466782;  font-family: verdana; font-weight: bold; font-size:12px'>")
document.write("<br><br><img name='ok' value='ok' onClick='updateRecord()' class='activeLink' src='buttons/ok.gif'>")
document.write("&nbsp&nbsp&nbsp<img name='cancel' value='cancel' onClick='cancelRecord()' class='activeLink' src='buttons/cancel.gif'>")
document.write("</td></tr></table></td></tr></table>")
document.write("</div>")

function cancelRecord()
{
	if(klondike)
		window.location.replace("solitaire.html")
	else if(freecell)
		window.location.replace("freecell.html")
}

function updateRecord()
{
	nameField = document.getElementById("inputName")
	playerName = nameField.value
	if(klondike)
		stringValue = score
	else if(freecell)
		stringValue = mins + ":" + secs
		
	if(playerName == "")
	{
		r = Math.random()*3
		n = Math.ceil(r)
		if(n == 1)
			playerName = "Dude"
		else if(n == 2)
			playerName = "No Name"
		else
			playerName = "Somebody"
	}
	if(index == 0) //top value
	{
		cn += playerName + "=" + stringValue + "&"
	}
	else
	{
		for(i=0; i < index; i++)
		{
			cn += players[i] + "=" + records[i] + "&"
		}
	}

	if(index == records.length - 1) //last high score
		{cn += playerName + "=" + stringValue}
	else
	{
		if(index != 0)
			{cn += playerName + "=" + stringValue + "&"}

		for(i=index+1; i < records.length; i++)
		{
			if(i == records.length - 1)//last value in list
				{cn += players[i-1] + "=" + records[i-1]}
			else
				{cn += players[i-1] + "=" + records[i-1] + "&"}
		}
	}
	if(klondike)
	{
		setCookie("kscore", cn)
		window.location.replace("solitaire.html")
	}
	else if(freecell)
	{
		setCookie("ftime", cn)
		window.location.replace("freecell.html")
	}
}