const crypto = require('crypto');

class InvalidArgumentsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidArgumentsError';
    }
}

class HMAC {
    static generateKey() {
        return crypto.randomBytes(32).toString('hex'); // 256-bit key
    }

    static generateHMAC(key, message) {
        return crypto.createHmac('sha256', key).update(message).digest('hex');
    }
}

class Rules {
    constructor(moves) {
        this.moves = moves;
        this.moveCount = moves.length;
    }

    // Determine if the player's move wins, loses, or draws
    getResult(playerMoveIndex, computerMoveIndex) {
        if (playerMoveIndex === computerMoveIndex) {
            return 'Draw';
        }

        const half = Math.floor(this.moveCount / 2);
        const distance = (computerMoveIndex - playerMoveIndex + this.moveCount) % this.moveCount;

        return distance <= half ? 'Lose' : 'Win';
    }

    // Display help table showing who beats whom
    showHelp() {
        const headers = [''].concat(this.moves);
        const table = this.moves.map((move, i) => {
            return [move].concat(
                this.moves.map((_, j) => {
                    if (i === j) return 'Draw';
                    const result = this.getResult(i, j);
                    return result === 'Win' ? 'Lose' : 'Win';
                })
            );
        });

        console.log(tabulate([headers].concat(table), { headers: 'firstrow' }));
    }
}

class Game {
    constructor(moves) {
        if (!Game.isValidInput(moves)) {
            throw new InvalidArgumentsError(
                'Invalid input. You must provide an odd number of at least 3 non-repeating moves. Example: node game.js rock paper scissors'
            );
        }
        this.moves = moves;
        this.rules = new Rules(moves);
        this.key = HMAC.generateKey();
        this.computerMoveIndex = Math.floor(Math.random() * moves.length);
        this.hmac = HMAC.generateHMAC(this.key, moves[this.computerMoveIndex]);
    }

    static isValidInput(moves) {
        return moves.length >= 3 && moves.length % 2 === 1 && new Set(moves).size === moves.length;
    }

    showMenu() {
        console.log(HMAC: ${this.hmac});
        console.log('Available moves:');
        this.moves.forEach((move, index) => {
            console.log(${index + 1} - ${move});
        });
        console.log('0 - Exit');
        console.log('? - Help');
    }

    play() {
        const stdin = process.stdin;
        stdin.setEncoding('utf8');
        this.showMenu();

        stdin.on('data', (input) => {
            input = input.trim();
            if (input === '0') {
                console.log('Exiting...');
                process.exit(0);
            } else if (input === '?') {
                this.rules.showHelp();
                this.showMenu();
            } else {
                const playerMoveIndex = parseInt(input) - 1;
                if (isNaN(playerMoveIndex) || playerMoveIndex < 0 || playerMoveIndex >= this.moves.length) {
                    console.log('Invalid input. Please try again.');
                    this.showMenu();
                } else {
                    this.resolveGame(playerMoveIndex);
                    process.exit(0);
                }
            }
        });
    }

    resolveGame(playerMoveIndex) {
        const playerMove = this.moves[playerMoveIndex];
        const computerMove = this.moves[this.computerMoveIndex];
        console.log(Your move: ${playerMove});
        console.log(Computer move: ${computerMove});

        const result = this.rules.getResult(playerMoveIndex, this.computerMoveIndex);
        console.log(result === 'Draw' ? 'It\'s a draw!' : You ${result.toLowerCase()}!);

        console.log(HMAC key: ${this.key});
    }
}

// Parse command-line arguments
const moves = process.argv.slice(2);

try {
    const game = new Game(moves);
    game.play();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}