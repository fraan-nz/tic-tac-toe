import { useState } from "react";
import "./App.css";

const INITIAL_STATE = new Array(9).fill("");

const WINNING_COMPS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

enum Player {
	X = "X",
	O = "O",
}

enum Status {
	Playing = "PLAYING",
	Draw = "DRAW",
	Finished = "FINISHED",
}

function App() {
	const [turn, setTurn] = useState<Player>(Player.X);
	const [cells, setCells] = useState<(Player | "")[]>(INITIAL_STATE);
	const [status, setStatus] = useState<Status>(Status.Playing);
	const [scoreboard, setScoreboard] = useState<Record<Player, number>>(() => ({
		[Player.X]: 0,
		[Player.O]: 0,
	}));

	const handleClick = (index: number) => {
		if (status !== Status.Playing) return;

		if (cells[index] === "") {
			const draft = [...cells];
			draft[index] = turn;

			const hasWon = WINNING_COMPS.some((comp) => {
				return comp.every((cell) => {
					return turn === draft[cell];
				});
			});

			if (hasWon) {
				setStatus(Status.Finished);
				setScoreboard((scoreboard) => ({
					...scoreboard,
					[turn]: scoreboard[turn] + 1,
				}));
			}

			if (!draft.some((cell) => cell === "")) {
				setStatus(Status.Draw);
			}

			setTurn((turn) => (turn === Player.X ? Player.O : Player.X));
			setCells(draft);
		}
	};

	const handleReset = () => {
		setCells(INITIAL_STATE);
		setStatus(Status.Playing);
	};

	return (
		<main className="main">
			<h1>Tic Tac Toe</h1>
			<div className="main__container">
				<div className="board">
					{cells.map((cell, index) => (
						<div
							key={index}
							className="cell"
							onClick={() => handleClick(index)}
						>
							{cell}
						</div>
					))}
				</div>
				<section className="scoreboard">
					<p>Turn of: {turn}</p>
					<div className="scoreboard__points">
						<p>Player X: {scoreboard.X}</p>
						<p>Player O: {scoreboard.O}</p>
					</div>
				</section>
			</div>
			{status !== Status.Playing && (
				<section className="section__bottom">
					<article role="alert">
						{status === Status.Draw && "Draw!"}
						{status === Status.Finished &&
							`${turn === Player.O ? "X" : "O"} Win!`}
					</article>
					<button onClick={handleReset}>Reset</button>
				</section>
			)}
		</main>
	);
}

export default App;
