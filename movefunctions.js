<!-- Filename: movefunctions.js -->
<!-- Created December 2, 2003 by Leah Culver -->
<!-- Last modified 12/17/2003 by Leah Culver -->

//onmouse down function
function drag()
{
	mouseIsDown = true
	if(dragapproved == true)
	{
		//alert("lost card")
		returnToOriginalPile()
		dragapproved = false
	}
	if(!document.all) // not IE
	return
	//check if element clicked on is movable
	if(event.srcElement.className=="drag")
	{
		dragapproved = true
		activeCard = event.srcElement
		cardNum = activeCard.id
		column = findColumn(cardNum)

		originalCardLeftPos = activeCard.style.pixelLeft
		originalCardTopPos = activeCard.style.pixelTop
		x = event.clientX
		y = event.clientY
		newxPos = event.clientX
		newyPos = event.clientY
		xCardCenter = document.getElementById(cardNum).style.pixelLeft + (cardWidth/2)
		yCardCenter = document.getElementById(cardNum).style.pixelTop + (cardHeight/2)

		moveArray = createMovingArray(cardNum, column, false)

		document.onmousemove = move
	}
}

//onmousemove action
function move()
{
	if (event.button == 1 && dragapproved)
	{
		//get the latest mouse position
		newxPos = event.clientX
		newyPos = event.clientY
		//find the vertical center of the card
		xCardCenter = document.getElementById(moveArray[0]).style.pixelLeft + (cardWidth/2)
		yCardCenter = document.getElementById(moveArray[0]).style.pixelTop + (cardHeight/2)
		//debug
		//s = document.getElementById('scoreField')
		//s.value = newxPos + " - " + newyPos
		for(i = 0; i < moveArray.length; i ++)
		{
			idNum = moveArray[i]
			attached = document.getElementById(idNum)
			attached.style.pixelLeft = originalCardLeftPos + newxPos - x
			attached.style.pixelTop = originalCardTopPos + newyPos - y + overlap*i
		}
		return false
	}
}

function dblclickAction()
{
	if(event.srcElement.className=="drag" && acceptDblClick == true)
	{
		dblClickElement = event.srcElement.id
		findPossibleMoves(dblClickElement, true)
	}
}

function createMovingArray(cardNum, column, willAnimate)
{
	if(column == col0 || column == ace1 || column == ace2 || column == ace3 || column == ace4)
	{
		moveArray = new Array(cardNum)
	}
	else
	{
		indexOf = findIndex(cardNum, column)
		moveArray = column.slice(indexOf, column.length)
	}
	
	if(!willAnimate)
	{
		for(i = 0; i < moveArray.length; i++)
		{
			document.getElementById(moveArray[i]).style.zIndex = zPos // becomes the top layer
			zPos++
		}
	}
	return moveArray
}

function findPossibleMoves(cardNum, moveMeThere)
{
	moveable = false
	prevColumn = findColumn(cardNum)
	
	if(klondike)
		end = columnArray.length
	else if(freecell)
		end = 13 //do not count the free cells

	//check if in any columns except col0 and the free cells
	for(i=1; i < end; i++)
	{
		if(!(freecell && columnArray[i].length == 0 && i < 9))//this is checked later
		{
			if(prevColumn != columnArray[i] && validateCard(cardNum, prevColumn, columnArray[i]))
			{
				newColumn = columnArray[i]
				leftPos = leftPosArray[i]
				moveable = true
			}
		}
	}
	
	//special moves to empty spot or free cell
	if(freecell && !moveable)
	{
		//check if cards can be moved to an empty spot
		//check if in any columns except col0 and the free cells
		for(i=1; i < end; i++)
		{
			if(columnArray[i].length == 0 && prevColumn != columnArray[i] && validateCard(cardNum, prevColumn, columnArray[i]))
			{
				//alert("to empty column")
				newColumn = columnArray[i]
				leftPos = leftPosArray[i]
				moveable = true
			}
		}
	
		if(!moveable)//check if it can be moved to a free cell
		{
			for(i=end; i < columnArray.length; i++)
			{
				if(prevColumn != columnArray[i] && validateCard(cardNum, prevColumn, columnArray[i]))
				{
					newColumn = columnArray[i]
					leftPos = leftPosArray[i]
					moveable = true
				}
			}
		}
	}

	if(moveable)
	{
		if(moveMeThere)//snap card to position
		{
			ani = false
			if(document.getElementById("animOption").checked)
				ani = true
				
			tempArray = createMovingArray(cardNum, prevColumn, ani)
				
			snapToPlace(tempArray, prevColumn, newColumn, leftPos, false, ani)
			if(freecell)
				assignMovableClass()
		}
		else //return to calling function true or false
		{
			//The following are not prefered moves, so they won't be highlighted
			//even though they are valid.
			//Ace to another ace pile
			//King to another empty spot
			return true
		}
	}
}