"use strict";
(() => {
	let isPlayerMove = true;
	let gameOver = false;
	const rows = 6;
	const cols = 7;
	const gameBoard = [];
	const gameBoardContainer = document.getElementById("gameboard");
	const cellSize = 120;
	const winCheckLength = 3;

	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	const gameOverCheck = () => {
		let counter = 0;
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j <= winCheckLength; j++) {
				for (let k = 1; k < winCheckLength + 1; k++) {
					counter = gameBoard[i][j] == gameBoard[i][j + k] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === winCheckLength) return true;
				counter = 0;
			}
		}
		for (let i = 0; i < winCheckLength; i++) {
			for (let j = 0; j < cols; j++) {
				for (let k = 1; k < winCheckLength + 1; k++) {
					counter = gameBoard[i][j] == gameBoard[i + k][j] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === winCheckLength) return true;
				counter = 0;
			}
		}
		for (let i = 0; i < winCheckLength; i++) {
			for (let j = 0; j <= winCheckLength; j++) {
				for (let k = 1; k < winCheckLength + 1; k++) {
					counter = gameBoard[i][j] == gameBoard[i + k][j + k] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === winCheckLength) return true;
				counter = 0;
			}
		}
		for (let i = 0; i < winCheckLength; i++) {
			for (let j = winCheckLength; j < cols; j++) {
				for (let k = 1; k < winCheckLength + 1; k++) {
					counter = gameBoard[i][j] == gameBoard[i + k][j - k] && gameBoard[i][j] > 0 ? counter + 1 : counter;
				}
				if (counter === winCheckLength) return true;
				counter = 0;
			}
		}
		return false;
	};

	const animateDrop = (inputRow, inputCol, currentRow, moveTurn) => {
		if (currentRow === inputRow) return;
		document.getElementById("d" + currentRow + inputCol).classList.add(moveTurn ? "redPlaced" : "yellowPlaced");
		sleep(125).then(() => {
			document.getElementById("d" + currentRow + inputCol).classList.remove(moveTurn ? "redPlaced" : "yellowPlaced");
		});
		sleep(150).then(() => {
			animateDrop(inputRow, inputCol, currentRow + 1, moveTurn);
		});
	};

	const playerMove = e => {
		if (!gameOver) {
			document.getElementById("uiblocker").style.display = "block";
			var col = Number(e.currentTarget.id.substring(2));
			let startingRow;
			for (let i = rows - 1; i > -1; i--) {
				if (gameBoard[i][col] === 0) {
					animateDrop(i, col, 0, isPlayerMove);
					document.getElementById("d" + i + col).classList.remove("yellowHighLight");
					document.getElementById("d" + i + col).classList.remove("redHighlight");
					gameBoard[i][col] = isPlayerMove ? 1 : 2;
					startingRow = i;
					break;
				}
			}
			sleep(150 * startingRow).then(() => {
				document.getElementById("d" + startingRow + col).classList.add(isPlayerMove ? "redPlaced" : "yellowPlaced");
				sleep(150).then(() => {
					if (gameOverCheck()) {
						gameOver = true;
						alert("Game Over!");
					}
					document.getElementById("uiblocker").style.display = "none";
					isPlayerMove = !isPlayerMove;

				});
			});
		}
	};

	const highLightMove = e => {
		if (!gameOver) {
			var col = Number(e.currentTarget.id.substring(2));
			for (let i = rows - 1; i > -1; i--) {
				if (gameBoard[i][col] === 0) {
					document.getElementById("d" + i + col).classList.add(isPlayerMove ? "redHighlight" : "yellowHighLight");
					break;
				}
			}
		}
	};

	const highLightMoveReset = e => {
		if (!gameOver) {
			var col = Number(e.currentTarget.id.substring(2));
			for (let i = rows - 1; i > -1; i--) {
				if (gameBoard[i][col] === 0) {
					document.getElementById("d" + i + col).classList.remove("yellowHighLight");
					document.getElementById("d" + i + col).classList.remove("redHighlight");
					break;
				}
			}
		}
	};

	(() => {
		for (let i = 0; i < cols; i++) {
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
