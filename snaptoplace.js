<!-- Filename: snaptoplace.js -->
<!-- Created December 2, 2003 by Leah Culver -->
<!-- Last modified 12/15/2003 by Leah Culver -->

function snapToPlace(moveArray, oldColumn, newColumn, newColumnLeft, undo, animateMe)//Automatically position the card
{
	//alert("snap")
	//alert(oldColumn)
	newColumnLength = newColumn.length
	moveNum = moveArray[0]%13
	newExposedExists = false
	//snap to new position
	for(i = 0; i < moveArray.length; i++)
	{
		idNum = moveArray[i]
		attached = document.getElementById(idNum)
		//un-highlight the card
		attached.style.filter = ""

		if(newColumn == ace1 || newColumn == ace2 || newColumn == ace3 || newColumn == ace4)
		{
			if(klondike)//adjust score
			{
				if(undo && (oldColumn != col0 || oldColumn != ace1 || oldColumn != ace2 || oldColumn != ace3 || oldColumn != ace4))
					addToScore(15)//regain lost points
				else
					addToScore(10)//10 points for moving a card to the ace pile
			}
			newColumnTop = cellTop
			cellMove = true
		}
		else if(newColumn == col0)
		{
			addToScore(-5)//for an undo lose the points gained by moving to the table
			newColumnTop = cellTop
			cellMove = true
		}
		//free cell only
		else if(freecell && (newColumn == cell1 || newColumn == cell2 || newColumn == cell3 || newColumn == cell4))
		{
			newColumnTop = cellTop
			numMovable --
			cellMove = true
		}
		else
		{
			newColumnTop = (newColumn.length * overlap) + tableTop
			cellMove = false
		}
		
		//up the numMovable (will also cancel out cell to cell moves)
		if(freecell && (oldColumn == cell1 || oldColumn == cell2 || oldColumn == cell3 || oldColumn == cell4))
			numMovable++
		
		//alert(newColumn.toString() + " -- " + newColumn.length + " | " + oldColumn.toString() + " -- " + oldColumn.length)

		if(oldColumn == col0)//non-undo only
		{
			//5 points for playing the card from the discard pile
			addToScore(5)
			indexOf = findIndex(idNum, col0)
			//make new top card in discard pile moveable
			//in case flipNum is greater than one and the
			//checkbox is checked to show buried cards
			if(col0[indexOf+1])//check if buried card exists
			{
				document.getElementById(col0[indexOf+1]).className = 'drag'
			}
			spl = col0.splice(indexOf, 1)
		}
		else
		{
			// delete last card from array
			oldColumn.length --
		}

		if(newColumn != col0 || col0.length == 0)//non-undo
		{
			newColumn[newColumn.length] = attached.id
		}
		else//undo only
		{
			lastExposCardInd = -1
			//find the top exposed card index
			for(topIndex = col0.length-1; topIndex >= 0; topIndex--)
			{
				//alert("index: " + topIndex)
				checkMe = document.getElementById(col0[topIndex])
				if(checkMe.className == 'flip')
				{
					topIndex = -1
				}
				else //exit loop
					lastExposCardInd = topIndex
			}
			//alert("testing: " + newColumn + " top index: " + lastExposCardInd)
			if(lastExposCardInd != -1)
			{
				//insert the card into col0 array
				col0.splice(lastExposCardInd, 0, moveArray[0])
			}
			else
				newColumn[newColumn.length] = attached.id
		}
		
		if(!animateMe)
		{
			attached.style.left = newColumnLeft
			attached.style.top = newColumnTop
			if(!undo && moveNum == 0 && (newColumn == ace1 || newColumn == ace2 || newColumn == ace3 || newColumn == ace4))
				checkEndGame()
		}
	}
	
	if(animateMe)
		queueAnimation(moveArray, newColumnLeft, newColumnLength, newColumn, cellMove)
	
	//new moveable card on the old pile
	if(klondike && oldColumn != col0)
	{
		n = oldColumn[oldColumn.length - 1]
		if(n != null)
		{
			newMove = document.getElementById(n)
			//check if this is a new card to flip
			if(newMove.className != "drag")
			{
				if(!undo)
				{
					//alert("new card!")
					//5 points for exposing a card from the stacks
					addToScore(5)
					newMove.src = cardFolder + n + ".gif"
					newExposedExists = true
				}
				newMove.className = "drag"
			}
		}
	}

	if(event.shiftKey)//shift key is down and a stack has been moved
	{
		//document.getElementById(moveArray[0]).style.filter = ""//clear the filter(no longer moveable)
		//un-highlight every card in the deck(for now?)
		for(q=0; q < deck.length; q++)
		{
			active = document.getElementById(deck[q])
			active.style.filter = ""
		}
	}
	//print out the arrays for debugging
	//alert(newColumn.toString() + " -- " + newColumn.length + " | " + oldColumn.toString() + " -- " + oldColumn.length)

	if(oldColumn == ace1 || oldColumn == ace2 || oldColumn == ace3 || oldColumn == ace4)
	{
		if(newColumn == ace1 || newColumn == ace2 || newColumn == ace3 || newColumn == ace4)
		{
			//break even - moving ace to ace
			addToScore(-10)
		}
		else
		{
			//lose points if moved from ace pile (net loss 5 pts.)
			if(undo)
				addToScore(-10)
			else
				addToScore(-15)
		}
	}

	if(!undo) //regular move
	{
		numMoves++
		//alert(numMoves)

		if(freecell && (newColumn == ace1 || newColumn == ace2 || newColumn == ace3 || newColumn == ace4))
		{
			//may not move cards from the ace piles
			attached.className = "noDrag"
			undoArray[0] = null
			document.getElementById('undoButton').className = "inactiveLink"
		}
		else
		{
			//add stuff to undo array
			undoArray[0] = moveArray
			undoArray[1] = oldColumn
			undoArray[2] = newColumn
			undoArray[3] = newExposedExists
			document.getElementById('undoButton').className = "activeLink"
		}
		
	}
	else //this was an undo!
	{
		numMoves--
		//alert(numMoves)
		//clear undo array
		undoArray[0] = null
		document.getElementById('undoButton').className = "inactiveLink"
	}
}


function undo()
{
	if(undoArray[0])//array has been set
	{
		columnMoveTo = undoArray[1] //old column
		if(columnMoveTo == col0)
			leftP = pileUpLeft
		else
			leftP = findLeftPosition(columnMoveTo)
		mArray = undoArray[0]
		//bring cards to the top
		for(i=0; i < mArray.length; i++)
		{
			document.getElementById(mArray[i]).style.zIndex = zPos
			zPos++
		}

		//if this card is from pile to different pile
		if(columnMoveTo != undoArray[2])
		{
			snapToPlace(mArray, undoArray[2], columnMoveTo, leftP, true, false)
			if(freecell)
				assignMovableClass()

			if(undoArray[3])//a card was revealed in a stack, flip it back over
			{
				objUnder = document.getElementById(columnMoveTo[columnMoveTo.length - mArray.length - 1])
				objUnder.className = ""
				objUnder.src = cardFolder + "back.gif"
				//make sure it is under the top cards
				objUnder.style.zIndex = document.getElementById(mArray[0]).style.zIndex - 1
				addToScore(-5)
			}

			if(columnMoveTo == col0)
			{
				flipIndex = document.getElementById('numFlip')
				numToFlip = flipIndex.value
				numToCheck = mArray[0]
				new0Index = findIndex(numToCheck, col0)
				cardBelow = col0[new0Index+1]

				if(cardBelow)
				{
					if(document.getElementById(cardBelow).style.left != pileUpLeft+"px")
					{
						// find the left position of the card below the undo card
						// and place it next to that card.
						objCardBelow = document.getElementById(cardBelow)
						objCardBelow.className = "" //make the buried card unmovable
						pxNumLeft = objCardBelow.style.left
						pxIndex = pxNumLeft.indexOf("px")//prepare to remove the 'px'
						numLeft = parseInt(pxNumLeft.substring(0, pxIndex))//convert to integer for addition
						document.getElementById(numToCheck).style.left = numLeft + flipSpace
					}
					else if(numToFlip > 1 && document.getElementById('showDealt').checked)//last resort to check if it is the second card
					{
						document.getElementById(numToCheck).style.left = pileUpLeft + flipSpace
					}
				}
			}
		}
		//if the last move was a flip
		else if(klondike)//undo the flip
		{
			//alert("you are trying to undo a flip.  : " + mArray)
			for(k=mArray.length-1; k >= 0; k--)
			{
				flipBack = document.getElementById(mArray[k])
				flipBack.src = cardFolder + "back.gif"
				flipBack.style.left = pileDownLeft
				flipBack.className = 'flip'
				//alert(mArray[k])
				flipBack.style.zIndex = zPos
				zPos++
			}
			document.getElementById('undoButton').className = "inactiveLink"
		}
	}
}


aniArray = new Array()
numSteps = 20
animTime = null
endGame = false

function queueAnimation(moveArray, newColumnLeft, newColumnLength, newColumn, cellMove)
{
	acceptDblClick = false
	
	firstCard = document.getElementById(moveArray[0])
	left = firstCard.style.left
	pxIndex = left.indexOf("px")//prepare to remove the 'px'
	startLeft = parseInt(left.substring(0, pxIndex))//convert to integer for addition
	
	topC = firstCard.style.top
	pxIndex2 = topC.indexOf("px")//prepare to remove the 'px'
	startTop = parseInt(topC.substring(0, pxIndex2))//convert to integer for addition
	
	endLeft = newColumnLeft

	if(cellMove)
		endTop = cellTop
	else
		endTop = newColumnLength * overlap + tableTop

	aArray = new Array()
	aArray[0] = moveArray
	aArray[1] = startLeft
	aArray[2] = startTop
	aArray[3] = endLeft
	aArray[4] = endTop
	aArray[5] = 0 //animation counter
	aArray[6] = newColumn //use for end game check
	aniArray[aniArray.length] = aArray
	
	if(animTime == null)
		animate()
}

function animate()
{	
	e = aniArray[0]
	
	loops = 1
	if(aniArray.length > 1 && e[5] == numSteps/2)
		loops = 2
	
	for(j=0; j < loops; j++)
	{
		e = aniArray[j]
		if(e[5] == 0 && !document.getElementById("soundOption").checked)
			document.cardSound.play()
		e[5]++
		cardLeft = (((e[3] - e[1])/numSteps) * e[5]) + e[1]
		cardTop  = (((e[4] - e[2])/numSteps) * e[5]) + e[2]
		
		ma = e[0]
		for(i=0; i < ma.length; i++)
		{
			card = document.getElementById(ma[i])
			card.style.zIndex = zPos
			zPos++
			card.style.left = cardLeft
			card.style.top = cardTop + (i*overlap)
		}
		
		//check if it is a king going to an ace pile
		if(ma[0]%13 == 0 && (e[6] == ace1 || e[6] == ace2 || e[6] == ace3 || e[6] == ace4))
			endGame = true
		else
			endGame = false
	}

	e = aniArray[0]
	if(e[5] == numSteps)
		aniArray = aniArray.slice(1)
	
	if(aniArray.length == 0)
	{
		clearTimeout(animTime)
		animTime = null
		acceptDblClick = true
		
		//check end game
		if(endGame)
			checkEndGame()
	}
	else
	{
		animTime = setTimeout("animate()", 10)
	}
}