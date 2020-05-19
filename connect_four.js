"use strict";
(() => {
	let playerIsRed = true;
	let isPlayersTurn = false;
	let gameOver = false;
	let gameStarted = false;
	let playerNumber;
	const alreadyChecked = [];
	const rows = 6;
	const cols = 7;
	const gameBoard = [];
	const gameBoardContainer = document.getElementById("gameboard");
	const floatingCircles = document.getElementById("floatingCircles");
	const cellSize = 120;
	const winCheckLength = 3;
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	const alertModalControl = (message, duration) => {
		document.getElementById("alertshader").style.display = "block";
		document.getElementById("alertmessage").innerText = message;
		sleep(duration).then(() => {
			document.getElementById("alertshader").style.display = "none";
		});
	};

	const isAlreadyChecked = (arr) => {
		for (const checked of alreadyChecked) {
			let counter = 0;
			for (const ar of arr) {
				if (checked.includes(ar)) counter++;
				if (counter === arr.length) return true;
			}
		}
		return false;
	};

	const inARowCheck = (inARow, attackMode) => {
		let counter = 0;
		let inARowPieces = [];
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				for (let k = 1; k < inARow + 1; k++) {
					counter = i < rows && j + k < cols && gameBoard[i][j] == gameBoard[i][j + k] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === inARow) {
					for (let k = 0; k < inARow + 1; k++) {
						inARowPieces.push([i, j + k]);
					}
					if (!attackMode) {
						return inARowPieces;
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === playerNumber) {
						return inARowPieces;
					} else {
						inARowPieces = [];
					}
				}
				counter = 0;
			}
		}
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				for (let k = 1; k < inARow + 1; k++) {
					counter = i + k < rows && j < cols && gameBoard[i][j] == gameBoard[i + k][j] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === inARow) {
					for (let k = 0; k < inARow + 1; k++) {
						inARowPieces.push([i + k, j]);
					}
					if (!attackMode) {
						return inARowPieces;
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === playerNumber) {
						return inARowPieces;
					} else {
						inARowPieces = [];
					}
				}
				counter = 0;
			}
		}
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				for (let k = 1; k < inARow + 1; k++) {
					counter = i + k < rows && j + k < cols && gameBoard[i][j] == gameBoard[i + k][j + k] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === inARow) {
					for (let k = 0; k < inARow + 1; k++) {
						inARowPieces.push([i + k, j + k]);
					}
					if (!attackMode) {
						return inARowPieces;
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === playerNumber) {
						return inARowPieces;
					} else {
						inARowPieces = [];
					}
				}
				counter = 0;
			}
		}
		for (let i = 0; i < rows; i++) {
			for (let j = inARow; j < cols; j++) {
				for (let k = 1; k < inARow + 1; k++) {
					counter = i + k < rows && j - k >= 0 && gameBoard[i][j] == gameBoard[i + k][j - k] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === inARow) {
					for (let k = 0; k < inARow + 1; k++) {
						inARowPieces.push([i + k, j - k]);
					}
					if (!attackMode) {
						return inARowPieces;
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === playerNumber) {
						return inARowPieces;
					} else {
						inARowPieces = [];
					}
				}
				counter = 0;
			}
		}
		return inARowPieces;
	};

	const animateDrop = ({ inputRow, inputCol, moveTurn, currentRow = 0 } = {}) => {
		if (currentRow === inputRow) return;
		document.getElementById("d" + currentRow + inputCol).classList.add(moveTurn ? "redPlaced" : "yellowPlaced");
		sleep(120).then(() => {
			document.getElementById("d" + currentRow + inputCol).classList.remove(moveTurn ? "redPlaced" : "yellowPlaced");
		});
		sleep(125).then(() => {
			animateDrop({
				"currentRow": currentRow + 1,
				inputCol,
				inputRow,
				moveTurn
			});
		});
	};

	const winnersHighlight = (color, winners) => {
		for (const winner of winners) {
			document.getElementById("d" + winner[0] + winner[1]).classList.add(color);
		}
	};

	const playerMove = e => {
		if (!gameOver && gameStarted && isPlayersTurn) {
			document.getElementById("uiblocker").style.display = "block";
			var col = Number(e.currentTarget.id.substring(2));
			let startingRow;
			for (let i = rows - 1; i > -1; i--) {
				if (gameBoard[i][col] === 0) {
					animateDrop({
						"inputCol": col,
						"inputRow": i,
						"moveTurn": playerIsRed
					});
					document.getElementById("d" + i + col).classList.remove(playerIsRed ? "redHighlight" : "yellowHighLight");
					gameBoard[i][col] = playerIsRed ? 1 : 2;
					startingRow = i;
					break;
				}
			}
			sleep(125 * startingRow).then(() => {
				document.getElementById("d" + startingRow + col).classList.add(playerIsRed ? "redPlaced" : "yellowPlaced");
				sleep(150).then(() => {
					const possibleWinners = inARowCheck(winCheckLength, false);
					if (possibleWinners.length === 4) {
						winnersHighlight(playerIsRed ? "redHighlight" : "yellowHighLight", possibleWinners);
						gameOver = true;
						alertModalControl("Player Wins!", 2000);
						document.getElementById("uiblocker").style.display = "none";
					} else {
						sleep(200).then(() => compMove());
					}
				});
			});
		}
	};

	const highLightMove = e => {
		if (!gameOver && gameStarted && isPlayersTurn) {
			var col = Number(e.currentTarget.id.substring(2));
			for (let i = rows - 1; i > -1; i--) {
				if (gameBoard[i][col] === 0) {
					document.getElementById("d" + i + col).classList.add(playerIsRed ? "redHighlight" : "yellowHighLight");
					document.getElementById("fc" + col).classList.add(playerIsRed ? "redBounce" : "yellowBounce");
					document.getElementById("fc" + col).classList.add("gbounce");
					break;
				}
			}
		}
	};

	const highLightMoveReset = e => {
		if (!gameOver && gameStarted && isPlayersTurn) {
			var col = Number(e.currentTarget.id.substring(2));
			document.getElementById("fc" + col).classList.remove(playerIsRed ? "redBounce" : "yellowBounce");
			document.getElementById("fc" + col).classList.remove("gbounce");
			for (let i = rows - 1; i > -1; i--) {
				if (gameBoard[i][col] === 0) {
					document.getElementById("d" + i + col).classList.remove(playerIsRed ? "redHighlight" : "yellowHighLight");
					break;
				}
			}
		}
	};

	const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

	const colForComp = () => {
		const twoInARow = inARowCheck(1, true);
		const foundTwo = twoInARow.length === 2;
		const threeInARow = inARowCheck(2, true);
		const foundThree = threeInARow.length === 3;
		if (foundThree && threeInARow[0][1] === threeInARow[1][1] && gameBoard[threeInARow[0][0] - 1][threeInARow[0][1]] === 0) {
			alreadyChecked.push(threeInARow);
			return threeInARow[0][1];
		}
		if (foundThree && threeInARow[0][0] === threeInARow[2][0]) {
			if (threeInARow[2][1] + 1 < cols - 1 && gameBoard[threeInARow[2][0]][threeInARow[2][1] + 1] === 0) {
				alreadyChecked.push(threeInARow);
				return threeInARow[2][1] + 1;
			}
			if (threeInARow[0][1] - 1 >= 0 && gameBoard[threeInARow[0][0]][threeInARow[0][1] - 1] === 0) {
				alreadyChecked.push(threeInARow);
				return threeInARow[0][1] - 1;
			}
		}
		if (foundTwo && twoInARow[0][1] === twoInARow[1][1] && gameBoard[twoInARow[0][0] - 1][twoInARow[0][1]] === 0) {
			alreadyChecked.push(twoInARow);
			return twoInARow[0][1];
		}
		if (foundTwo && twoInARow[0][0] === twoInARow[1][0]) {
			if (twoInARow[1][1] + 1 < cols - 1 &&
				gameBoard[twoInARow[1][0]][twoInARow[1][1] + 1] === 0) {
				alreadyChecked.push(twoInARow);
				return twoInARow[1][1] + 1;
			}
			if (twoInARow[0][1] - 1 >= 0 &&
				gameBoard[twoInARow[0][0]][twoInARow[0][1] - 1] === 0) {
				alreadyChecked.push(twoInARow);
				return twoInARow[0][1] - 1;
			}
		}
		return randomIntFromInterval(0, cols - 1);
	};

	const compMove = () => {
		document.getElementById("uiblocker").style.display = "block";
		let col = colForComp();
		while (gameBoard[0][col] !== 0) {
			col = randomIntFromInterval(0, cols - 1);
		}
		for (let i = rows - 1; i > -1; i--) {
			if (gameBoard[i][col] === 0) {
				animateDrop({
					"inputCol": col,
					"inputRow": i,
					"moveTurn": !playerIsRed
				});
				gameBoard[i][col] = playerIsRed ? 2 : 1;
				compStepTwo(i, col);
				return;
			}
		}
		compMove();
	};

	const compStepTwo = (row, col) => {
		sleep(125 * row).then(() => {
			document.getElementById("d" + row + col).classList.add(playerIsRed ? "yellowPlaced" : "redPlaced");
			sleep(150).then(() => {
				const possibleWinners = inARowCheck(winCheckLength, false);
				document.getElementById("uiblocker").style.display = "none";
				if (possibleWinners.length === 4) {
					winnersHighlight(playerIsRed ? "yellowHighLight" : "redHighlight", possibleWinners);
					gameOver = true;
					alertModalControl("Computer Wins!", 2000);
					return;
				}
			});
		});
		isPlayersTurn = true;
	};

	const redChosen = () => {
		gameStarted = true;
		playerIsRed = true;
		isPlayersTurn = true;
		playerNumber = 1;
		document.getElementById("selectYellow").style.display = "none";
		document.getElementById("selectRed").removeEventListener("click", redChosen);
		document.getElementById("selectRed").classList.remove("pointerCursor");
	};

	const yellowChosen = () => {
		document.getElementById("uiblocker").style.display = "block";
		document.getElementById("selectRed").style.display = "none";
		document.getElementById("selectYellow").removeEventListener("click", yellowChosen);
		document.getElementById("selectYellow").classList.remove("pointerCursor");
		gameStarted = true;
		playerIsRed = false;
		playerNumber = 2;
		sleep(400).then(() => compMove());
	};

	(() => {
		document.getElementById("strtOvrBtn").addEventListener("click", () => location.reload());
		document.getElementById("selectRed").addEventListener("click", redChosen);
		document.getElementById("selectYellow").addEventListener("click", yellowChosen);


		for (let i = 0; i < cols; i++) {
			const circle = document.createElement("div");
			circle.id = "fc" + i;
			circle.classList.add("floatingCircle");
			floatingCircles.appendChild(circle);
			for (let j = 0; j < rows; j++) {
				const cell = document.createElement("div");
				gameBoardContainer.appendChild(cell);
				cell.id = "c" + j + i;
				const topPosition = j * cellSize + 5;
				const leftPosition = i * cellSize + 5;
				cell.style.top = topPosition + "px";
				cell.style.left = leftPosition + "px";
				const circleDiv = document.createElement("div");
				circleDiv.classList.add("circleDiv");
				cell.classList.add("squareDiv");
				cell.appendChild(circleDiv);
				cell.addEventListener("mouseover", highLightMove);
				cell.addEventListener("mouseleave", highLightMoveReset);
				cell.addEventListener("click", playerMove);
				circleDiv.id = "d" + j + i;
			}
		}
		for (let i = 0; i < rows; i++) {
			gameBoard.push([]);
			for (let j = 0; j < cols; j++) {
				gameBoard[i].push(0);
			}
		}
	})();
})();

