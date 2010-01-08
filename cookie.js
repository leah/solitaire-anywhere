<!-- Filename: cookie.js -->
<!-- Created November 17, 2003 by Leah Culver -->
<!-- Last modified 11/17/2003 by Leah Culver -->

//set a cookie using the cookie name and value
//results in a cookie that looks like: cookieName:name=value
function setCookie(cookieName, cookieValue)
{
	today = new Date();
	//expires in 5 years
	exp = new Date(today.getTime() + 5*365*24*60*60*1000);
	gmt = exp.toGMTString();
	document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + gmt + ";"
}

//returns an array of name value pairs
function getCookieArray(cName)
{
	bigCookie = document.cookie
	start = bigCookie.indexOf(cName)
	if(start != -1)//cookie exists by that name
	{
		start += cName.length + 1//skip the name and = sign
		end = bigCookie.indexOf(';', start)
		if(end == -1)
			end = bigCookie.length
		cookieString = unescape(bigCookie.substring(start, end))
		nv = cookieString.split("&")
		return nv
	}
	else
		return false
}

//sets the expiration date of the cookie to the past
function deleteCookie(NameOfCookie)
{
    document.cookie = NameOfCookie + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT"
    alert("cookie deleted.")
}