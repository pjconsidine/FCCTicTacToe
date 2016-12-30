A Pen created at CodePen.io. You can find this one at http://codepen.io/pete_considine/pen/ZWmGmq.

Development Notes: 

ROUTINE FOR COMPUTER GOING FIRST
    1. computer chooses a corner
			2. human chooses center
					3. computer chooses corner that sums to 15
					4. human chooses corner
							5. computer blocks and sets up fork
					4. human chooses edge
							5. computer blocks
							5. game is a draw
			2. human chooses other than center
					3. computer chooses corner with the value that does not sum to 10;
					4. human blocks
					5. computer chooses third corner and sets up a fork

					If your opponent puts the second O on the opposite edge, making a row or 
					column that reads O-X-O, put your second X in a corner. Then, if your 
					opponent puts the third O in the edge that is adjacent to your X, making 
					a line that reads O-X-O, put your third X in the empty square to block their 
					row of two O's. From here, you can always win with your fourth X

ROUTINE FOR PERSON GOING FIRST
		1. human chooses edge
				computer chooses center
				human chooses edge that sums to 15
					computer chooses a corner
				computer blocks
			
		human chooses center
				computer chooses corner
				human chooses corner
					computer chooses corner or blocks
					game is a draw
				human chooses edge
					computer blocks
					game is a draw
			
		human chooses corner
				computer chooses center
				human chooses corner
				computer chooses edge or blocks
				game is a draw