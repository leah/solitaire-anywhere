<!-- Filename: validatecard.js -->
<!-- Created December 2, 2003 by Leah Culver -->
<!-- Last modified 12/3/2003 by Leah Culver -->

//Is this a valid move?
function validateCard(moveId, oldColumn, newColumn)
{
	if(oldColumn != newColumn)
	{
		prevId = newColumn[newColumn.length - 1] // top card on new column

		prevNum = prevId%13
		moveNum = moveId%13

		prevSuitColor = prevId < 27? "black":"red"
		moveSuitColor = moveId < 27? "black":"red"
		
		//ace pile check
		if(newColumn == ace1 || newColumn == ace2 || newColumn == ace3 || newColumn == ace4)
		{
			//must be the top card in the old pile
			if(oldColumn != col0 && oldColumn != ace1 && oldColumn != ace2 && oldColumn!= ace3 && oldColumn != ace4 && (findIndex(moveId, oldColumn) != oldColumn.length-1))
			{
				return false
				//alert("cannot move to ace pile. Under other cards.")
			}
			else
			{
				if(moveId <= 13)
					{suit = "spades"}
				else if(moveId <= 26)
					{suit = "clubs"}
				else if(moveId <= 39)
					{suit = "diamonds"}
				else
					{suit = "hearts"}

				if(moveNum == 1 && !prevNum) //ace, first card in pile and previous card doesn't exist
				{
					setAcePileSuit(newColumn, suit)
					return true
				}
				else if(prevNum+1 == moveNum || (prevNum == 12 && moveNum == 0))
				{
					setSuit = getAcePileSuit(newColumn)
					if(suit == setSuit)
					{
						return true
					}
				}
			}
		}
		//Klondike, kings in an empty spot
		else if(klondike && newColumn.length == 0 && moveNum == 0) //Kings can go in an empty spot
		{
			return true
		}
		//Free Cell, "free cell" rules
		else if(freecell && (newColumn == cell1 || newColumn == cell2 || newColumn == cell3 || newColumn == cell4))
		{
			//must have been the top card (only one card can be moved to a free cell)
			if(findIndex(moveId, oldColumn) == oldColumn.length-1 && newColumn.length == 0)
			{
				return true
			}
		}
		//Free Cell, any card in empty column
		else if(freecell && newColumn.length == 0)
		{
			return true
		}
		//alternating color, decrementing value check
		else if(prevNum-1 == moveNum || (prevNum == 0 && moveNum == 12))
		{
			if(!(prevNum == 1 && moveNum == 0))//kings can't go on aces
			{
				if(prevSuitColor != moveSuitColor)
				{
					//alert(prevNum + " -- " + moveNum)
					return true
				}
			}
		}
	}
	return false
}