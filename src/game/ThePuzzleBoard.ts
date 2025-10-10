import type { Board } from '../types';
import _ from 'lodash';
class ThePuzzleBoard {
	private board: Board;
	private shuffleFactor: number;

	public constructor() {
		this.board = ThePuzzleBoard.createBoard();
		this.shuffleFactor = 30;
	}

	//cria a matriz default

	public shuffle(): Board {
		const board = _.cloneDeep(this.board);
		for (let k = 0; k < this.shuffleFactor; k++) {
			// gera um dos movimentos possíveis aleatoriamente
			const [zi, zj] = ThePuzzleBoard.findZero(board);
			const moves = ThePuzzleBoard.possibleMoves(zi, zj);
			const [ni, nj] = moves[Math.floor(Math.random() * moves.length)];
			[board[zi][zj], board[ni][nj]] = [board[ni][nj], board[zi][zj]];
		}
		this.board = board;
		return _.cloneDeep(board);
	}

	//move uma peça para a posição livre.
	public move(i: number, j: number): Board {
		const board = _.cloneDeep(this.board);
		// encontra coordenadas do zero
		const [zi, zj] = ThePuzzleBoard.findZero(board);
		// verifica se (i,j) é adjacente a (zi,zj)
		if (Math.abs(i - zi) + Math.abs(j - zj) === 1) {
			// troca os valores
			[board[zi][zj], board[i][j]] = [board[i][j], board[zi][zj]];
			this.board = board;
		}
		return _.cloneDeep(this.board);
	}

	public static equalsTo(a: Board, b: Board): boolean {
		return _.isEqual(a, b);
	}

	public static generateNeighbors(b: Board): Board[] {
		const [zi, zj] = ThePuzzleBoard.findZero(b);
		const moves = ThePuzzleBoard.possibleMoves(zi, zj);
		const result: Board[] = [];
		for (const [ni, nj] of moves) {
			const nb = _.cloneDeep(b);
			// swap zero with (ni, nj)
			[nb[zi][zj], nb[ni][nj]] = [nb[ni][nj], nb[zi][zj]];
			result.push(nb);
		}
		return result;
	}

	public static createBoard(): Board {
		return [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 0]
		];
	}

	private static findZero(b: Board): [number, number] {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (b[i][j] === 0) return [i, j];
			}
		}
		return [2, 2];
	}

	private static inBounds(i: number, j: number): boolean {
		return i >= 0 && i < 3 && j >= 0 && j < 3;
	}

	private static possibleMoves(zi: number, zj: number): [number, number][] {
		const dirs: [number, number][] = [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1]
		];
		const res: [number, number][] = [];
		for (const [di, dj] of dirs) {
			const ni = zi + di;
			const nj = zj + dj;
			if (ThePuzzleBoard.inBounds(ni, nj)) res.push([ni, nj]);
		}
		return res;
	}

	public toString(): string {
		return ThePuzzleBoard.toString(this.board);
	}

	public static toString(board: Board): string {
		return board.flat().join(',');
	}
}

export { ThePuzzleBoard };
