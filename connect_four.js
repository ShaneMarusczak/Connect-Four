"use strict";
(() => {
	let playerIsRed = true;
	let isPlayersTurn = false;
	let gameOver = false;
	let gameStarted = false;
	let playerNumber;
	let computNumber;
	const alreadyChecked = [];
	const rows = 6;
	const cols = 7;
	const gameBoard = [];
	const gameBoardContainer = document.getElementById("gameboard");
	const floatingCircles = document.getElementById("floatingCircles");
	const cellSize = 120;
	const winCheckLength = 3;

	const isAlreadyChecked = (arr) => {
		for (const checked of alreadyChecked) {
			if (checked == arr) return true;
		}
		return false;
	};

	const inARowCheck = ({ inARow, attackMode, toCheck = null } = {}) => {
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
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === toCheck) {
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
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === toCheck) {
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
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === toCheck) {
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
					} else if (attackMode && !isAlreadyChecked(inARowPieces) && gameBoard[i][j] === toCheck) {
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
		window.sleep(120).then(() => {
			document.getElementById("d" + currentRow + inputCol).classList.remove(moveTurn ? "redPlaced" : "yellowPlaced");
		});
		window.sleep(125).then(() => {
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
			window.sleep(125 * startingRow).then(() => {
				document.getElementById("d" + startingRow + col).classList.add(playerIsRed ? "redPlaced" : "yellowPlaced");
				window.sleep(150).then(() => {
					const possibleWinners = inARowCheck({
						"attackMode": false,
						"inARow": winCheckLength
					});
					if (possibleWinners.length === 4) {
						winnersHighlight(playerIsRed ? "redHighlight" : "yellowHighLight", possibleWinners);
						gameOver = true;
						window.modal("Player Wins!", 2000);
						document.getElementById("uiblocker").style.display = "none";
					} else {
						window.sleep(200).then(() => compMove());
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

	const colForComp = () => {
		const foundThreeComp = inARowCheck({
			"attackMode": true,
			"inARow": 2,
			"toCheck": computNumber
		});
		const foundThreeOfComp = foundThreeComp.length === 3;
		if (foundThreeOfComp && foundThreeComp[0][1] === foundThreeComp[1][1] && gameBoard[foundThreeComp[0][0] - 1][foundThreeComp[0][1]] === 0) {
			alreadyChecked.push(foundThreeComp);
			return foundThreeComp[0][1];
		}
		if (foundThreeOfComp && foundThreeComp[0][0] === foundThreeComp[2][0]) {
			if (foundThreeComp[2][1] + 1 < cols - 1 && gameBoard[foundThreeComp[2][0]][foundThreeComp[2][1] + 1] === 0) {
				alreadyChecked.push(foundThreeComp);
				return foundThreeComp[2][1] + 1;
			}
			if (foundThreeComp[0][1] - 1 >= 0 && gameBoard[foundThreeComp[0][0]][foundThreeComp[0][1] - 1] === 0) {
				alreadyChecked.push(foundThreeComp);
				return foundThreeComp[0][1] - 1;
			}
		}


		const foundThreePlayer = inARowCheck({
			"attackMode": true,
			"inARow": 2,
			"toCheck": playerNumber
		});
		const foundThreeOfPlayer = foundThreePlayer.length === 3;
		if (foundThreeOfPlayer && foundThreePlayer[0][1] === foundThreePlayer[1][1] && gameBoard[foundThreePlayer[0][0] - 1][foundThreePlayer[0][1]] === 0) {
			alreadyChecked.push(foundThreePlayer);
			return foundThreePlayer[0][1];
		}
		if (foundThreeOfPlayer && foundThreePlayer[0][0] === foundThreePlayer[2][0]) {
			if (foundThreePlayer[2][1] + 1 < cols - 1 && gameBoard[foundThreePlayer[2][0]][foundThreePlayer[2][1] + 1] === 0) {
				if (foundThreePlayer[2][0] < 5 && gameBoard[foundThreePlayer[2][0] + 1][foundThreePlayer[2][1] + 1] != 0) {
					alreadyChecked.push(foundThreePlayer);
					return foundThreePlayer[2][1] + 1;
				}

			}
			if (foundThreePlayer[0][1] - 1 >= 0 && gameBoard[foundThreePlayer[0][0]][foundThreePlayer[0][1] - 1] === 0) {
				if (foundThreePlayer[0][0] < 5 && gameBoard[foundThreePlayer[0][0] + 1][foundThreePlayer[0][1] - 1] != 0) {
					alreadyChecked.push(foundThreePlayer);
					return foundThreePlayer[0][1] - 1;
				}
			}
		}

		const foundTwoPlayer = inARowCheck({
			"attackMode": true,
			"inARow": 1,
			"toCheck": playerNumber
		});
		const foundTwoOfPlayer = foundTwoPlayer.length === 2;
		if (foundTwoOfPlayer && foundTwoPlayer[0][1] === foundTwoPlayer[1][1] && gameBoard[foundTwoPlayer[0][0] - 1][foundTwoPlayer[0][1]] === 0) {
			alreadyChecked.push(foundTwoPlayer);
			return foundTwoPlayer[0][1];
		}
		if (foundTwoOfPlayer && foundTwoPlayer[0][0] === foundTwoPlayer[1][0]) {
			if (foundTwoPlayer[1][1] + 1 < cols - 1 && gameBoard[foundTwoPlayer[1][0]][foundTwoPlayer[1][1] + 1] === 0) {
				if (foundTwoPlayer[1][0] < 5 && gameBoard[foundTwoPlayer[1][0] + 1][foundTwoPlayer[1][1] + 1] != 0) {
					alreadyChecked.push(foundTwoPlayer);
					return foundTwoPlayer[1][1] + 1;
				}

			}
			if (foundTwoPlayer[0][1] - 1 >= 0 && gameBoard[foundTwoPlayer[0][0]][foundTwoPlayer[0][1] - 1] === 0) {
				if (foundTwoPlayer[0][0] < 5 && gameBoard[foundTwoPlayer[0][0] + 1][foundTwoPlayer[0][1] - 1] != 0) {
					alreadyChecked.push(foundTwoPlayer);
					return foundTwoPlayer[0][1] - 1;
				}
			}
		}


		const foundTwoComp = inARowCheck({
			"attackMode": true,
			"inARow": 1,
			"toCheck": playerNumber
		});
		const foundTwoOfComp = foundTwoComp.length === 2;
		if (foundTwoOfComp && foundTwoComp[0][1] === foundTwoComp[1][1] && gameBoard[foundTwoComp[0][0] - 1][foundTwoComp[0][1]] === 0) {
			alreadyChecked.push(foundTwoComp);
			return foundTwoComp[0][1];
		}
		if (foundTwoOfComp && foundTwoComp[0][0] === foundTwoComp[1][0]) {
			if (foundTwoComp[1][1] + 1 < cols - 1 && gameBoard[foundTwoComp[1][0]][foundTwoComp[1][1] + 1] === 0) {
				alreadyChecked.push(foundTwoComp);
				return foundTwoComp[1][1] + 1;
			}
			if (foundTwoComp[0][1] - 1 >= 0 && gameBoard[foundTwoComp[0][0]][foundTwoComp[0][1] - 1] === 0) {
				alreadyChecked.push(foundTwoComp);
				return foundTwoComp[0][1] - 1;
			}
		}
		return window.randomIntFromInterval(1, cols - 2);
	};

	const compMove = () => {
		document.getElementById("uiblocker").style.display = "block";
		let col = colForComp();
		while (gameBoard[0][col] !== 0) {
			col = window.randomIntFromInterval(0, cols - 1);
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
		window.sleep(125 * row).then(() => {
			document.getElementById("d" + row + col).classList.add(playerIsRed ? "yellowPlaced" : "redPlaced");
			window.sleep(150).then(() => {
				const possibleWinners = inARowCheck({
					"attackMode": false,
					"inARow": winCheckLength
				});
				document.getElementById("uiblocker").style.display = "none";
				if (possibleWinners.length === 4) {
					winnersHighlight(playerIsRed ? "yellowHighLight" : "redHighlight", possibleWinners);
					gameOver = true;
					window.modal("Computer Wins!", 2000);
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
		computNumber = 2;
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
		computNumber = 1;
		playerNumber = 2;
		window.sleep(400).then(() => compMove());
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
				const topPosition = j * cellSize;
				const leftPosition = i * cellSize;
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

