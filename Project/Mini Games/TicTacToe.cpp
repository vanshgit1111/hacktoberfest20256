// Ultimate Tic-Tac-Toe Game in C++
// Enhanced with colors, score tracking, and improved user interface

#include <iostream>
#include <vector>
#include <limits>
#include <string>
#include <chrono>
#include <thread>

// --- Constants ---

// Algorithm:
// 1. Initialize a 4D board representing 9 small 3×3 boards inside a big 3×3 board.
// 2. Player X starts the game with freedom to play on any sub-board.
// 3. After each move, set the next player’s board based on the position chosen.
// 4. Check if the current small board is won or full; update the big board status.
// 5. If the big board has a winning line or all boards are full, the game ends.
// 6. Alternate turns between players until a win or draw occurs.

// Time Complexity:
// O(1) per move → each turn involves constant-time checks (rows, columns, diagonals).
// Overall game = O(81) = O(1) since the grid size is fixed (9 boards of 9 cells).

// Space Complexity:
// O(1) → uses fixed-size 4D vector (3×3×3×3 = 81 cells) and small auxiliary arrays.
#include <iostream>
#include <vector>

// --- Constants ---
const char PLAYER_X = 'X';
const char PLAYER_O = 'O';
const char EMPTY = ' ';

// ANSI Color Codes for better visualization
const std::string RESET = "\033[0m";
const std::string RED = "\033[31m";
const std::string GREEN = "\033[32m";
const std::string YELLOW = "\033[33m";
const std::string BLUE = "\033[34m";
const std::string MAGENTA = "\033[35m";
const std::string CYAN = "\033[36m";

// Score tracking
struct GameScore {
    int playerX;
    int playerO;
    int draws;
    GameScore() : playerX(0), playerO(0), draws(0) {}
};

// --- Function Prototypes ---
void printBoard(const std::vector<std::vector<std::vector<std::vector<char>>>>& boards,
               const std::vector<std::vector<char>>& bigBoardState);
bool checkWin(const std::vector<std::vector<char>>& board, char player);
bool isBoardFull(const std::vector<std::vector<char>>& board);
void clearScreen();
void displayGameStatus(char currentPlayer, int bigRow, int bigCol, const GameScore& score);
bool getValidMove(int& boardRow, int& boardCol, int& row, int& col, 
                 int bigRow, int bigCol, 
                 const std::vector<std::vector<std::vector<std::vector<char>>>>& gameBoards,
                 const std::vector<std::vector<char>>& bigBoardState);
void displayWelcomeMessage();
void pause(int milliseconds);
bool playAgain();

int main() {
    GameScore score;
    bool continuePlaying = true;

    while (continuePlaying) {
        // Initialize game boards
        std::vector<std::vector<std::vector<std::vector<char>>>> gameBoards(3, 
            std::vector<std::vector<std::vector<char>>>(3, 
            std::vector<std::vector<char>>(3, 
            std::vector<char>(3, EMPTY))));

        std::vector<std::vector<char>> bigBoardState(3, std::vector<char>(3, EMPTY));

        char currentPlayer = PLAYER_X;
        int bigRow = -1; // -1 indicates free choice
        int bigCol = -1;
        bool gameOver = false;
        char winner = EMPTY;

        displayWelcomeMessage();
        pause(2000); // 2-second pause
        clearScreen();

    while (!gameOver) {
            clearScreen();
            printBoard(gameBoards, bigBoardState);
            displayGameStatus(currentPlayer, bigRow, bigCol, score);

            int row, col, boardRow, boardCol;
            if (!getValidMove(boardRow, boardCol, row, col, bigRow, bigCol, gameBoards, bigBoardState)) {
                continue;
            }

            // Make the move
            gameBoards[boardRow][boardCol][row][col] = currentPlayer;

            // Update the next player's required board
            bigRow = row;
            bigCol = col;
        }

            // Check if the current move won the small board
            if (checkWin(gameBoards[boardRow][boardCol], currentPlayer)) {
                bigBoardState[boardRow][boardCol] = currentPlayer;
                std::cout << CYAN << "\nPlayer " << currentPlayer << " wins the small board at position ("
                         << boardRow << "," << boardCol << ")!" << RESET << std::endl;
                pause(1500);
            } else if (isBoardFull(gameBoards[boardRow][boardCol])) {
                bigBoardState[boardRow][boardCol] = 'D'; // 'D' for Draw
            }
            
            // Check if the current move won the entire game
            if (checkWin(bigBoardState, currentPlayer)) {
                winner = currentPlayer;
                gameOver = true;
            } else if (isBoardFull(bigBoardState)) {
                gameOver = true;
            }

            // Switch players if game is not over
            if (!gameOver) {
                currentPlayer = (currentPlayer == PLAYER_X) ? PLAYER_O : PLAYER_X;
            }
        }

        clearScreen();
        printBoard(gameBoards, bigBoardState);

        // Update scores and display results
        if (winner != EMPTY) {
            if (winner == PLAYER_X) score.playerX++;
            else score.playerO++;
            std::cout << GREEN << "\n🎉 Congratulations! Player " << winner << " wins the game! 🎉" << RESET << std::endl;
        } else {
            score.draws++;
            std::cout << YELLOW << "\n🤝 The game is a draw! 🤝" << RESET << std::endl;
        }

        // Display final scores
        std::cout << MAGENTA << "\nScore Board:" << RESET << std::endl;
        std::cout << "Player X: " << score.playerX << " wins" << std::endl;
        std::cout << "Player O: " << score.playerO << " wins" << std::endl;
        std::cout << "Draws: " << score.draws << std::endl;

        continuePlaying = playAgain();
    }

    return 0;
}

void displayWelcomeMessage() {
    std::cout << CYAN << R"(
    ╔═══════════════════════════════════════╗
    ║     Ultimate Tic-Tac-Toe Game         ║
    ║     Enhanced Edition v2.0             ║
    ╚═══════════════════════════════════════╝)" << RESET << std::endl;
    
    std::cout << YELLOW << "\nGame Rules:" << RESET << std::endl;
    std::cout << "1. The game consists of 9 small Tic-Tac-Toe boards within one big board" << std::endl;
    std::cout << "2. Win three small boards in a row to win the game" << std::endl;
    std::cout << "3. Your move determines which board your opponent must play in next" << std::endl;
    std::cout << "4. If sent to a completed board, your opponent can play anywhere" << std::endl;
}

void clearScreen() {
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

void pause(int milliseconds) {
    std::this_thread::sleep_for(std::chrono::milliseconds(milliseconds));
}

void displayGameStatus(char currentPlayer, int bigRow, int bigCol, const GameScore& score) {
    std::cout << "\nCurrent Scores - X: " << score.playerX << " | O: " << score.playerO 
              << " | Draws: " << score.draws << std::endl;
    
    std::cout << GREEN << "\nPlayer " << currentPlayer << "'s turn" << RESET << std::endl;

    if (bigRow != -1 && bigCol != -1) {
        std::cout << "You must play in board at position (" << bigRow << "," << bigCol << ")" << std::endl;
    } else {
        std::cout << "You can play in any available board" << std::endl;
    }
}

// Function to print the entire Ultimate Tic-Tac-Toe board
void printBoard(const std::vector<std::vector<std::vector<std::vector<char>>>>& boards,
               const std::vector<std::vector<char>>& bigBoardState) {
    std::cout << "    0   1   2       0   1   2       0   1   2\n";
    std::cout << "  +---+---+---+   +---+---+---+   +---+---+---+\n";

    for (int bigRow = 0; bigRow < 3; ++bigRow) {
        for (int smallRow = 0; smallRow < 3; ++smallRow) {
            std::cout << bigRow * 3 + smallRow << " |";
            for (int bigCol = 0; bigCol < 3; ++bigCol) {
                for (int smallCol = 0; smallCol < 3; ++smallCol) {
                    char symbol = boards[bigRow][bigCol][smallRow][smallCol];
                    if (symbol == PLAYER_X)
                        std::cout << " " << BLUE << symbol << RESET << " |";
                    else if (symbol == PLAYER_O)
                        std::cout << " " << RED << symbol << RESET << " |";
                    else
                        std::cout << " " << symbol << " |";
                }
                if (bigCol < 2) std::cout << "   |";
            }
            std::cout << "\n  +---+---+---+   +---+---+---+   +---+---+---+\n";
        }
        if (bigRow < 2) {
            std::cout << "  +---+---+---+   +---+---+---+   +---+---+---+\n";
        }
    }

    // Display big board state
    std::cout << "\nBig Board State:\n";
    std::cout << "+-+-+-+\n";
    for (int i = 0; i < 3; ++i) {
        std::cout << "|";
        for (int j = 0; j < 3; ++j) {
            if (bigBoardState[i][j] == PLAYER_X)
                std::cout << BLUE << bigBoardState[i][j] << RESET;
            else if (bigBoardState[i][j] == PLAYER_O)
                std::cout << RED << bigBoardState[i][j] << RESET;
            else if (bigBoardState[i][j] == 'D')
                std::cout << YELLOW << "D" << RESET;
            else
                std::cout << " ";
            std::cout << "|";
        }
        std::cout << "\n+-+-+-+\n";
    }
}

bool getValidMove(int& boardRow, int& boardCol, int& row, int& col, 
                 int bigRow, int bigCol,
                 const std::vector<std::vector<std::vector<std::vector<char>>>>& gameBoards,
                 const std::vector<std::vector<char>>& bigBoardState) {
    
    std::cout << "\nEnter your move (big_board_row big_board_col small_board_row small_board_col): ";
    
    if (!(std::cin >> boardRow >> boardCol >> row >> col)) {
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << RED << "Invalid input. Please enter numbers only." << RESET << std::endl;
        pause(1500);
        return false;
    }

    // Validate coordinates
    if (boardRow < 0 || boardRow > 2 || boardCol < 0 || boardCol > 2 || 
        row < 0 || row > 2 || col < 0 || col > 2) {
        std::cout << RED << "Invalid coordinates. Must be between 0 and 2." << RESET << std::endl;
        pause(1500);
        return false;
    }

    // Check if the move is on the correct board
    if (bigRow != -1 && bigCol != -1 && (boardRow != bigRow || boardCol != bigCol)) {
        std::cout << RED << "You must play in the designated board!" << RESET << std::endl;
        pause(1500);
        return false;
    }

    // Check if the chosen board is already won
    if (bigBoardState[boardRow][boardCol] != EMPTY) {
        std::cout << RED << "This board is already completed. Choose another." << RESET << std::endl;
        pause(1500);
        return false;
    }

    // Check if the spot is already taken
    if (gameBoards[boardRow][boardCol][row][col] != EMPTY) {
        std::cout << RED << "This spot is already taken!" << RESET << std::endl;
        pause(1500);
        return false;
    }

    return true;
}

bool checkWin(const std::vector<std::vector<char>>& board, char player) {
    // Check rows and columns
    for (int i = 0; i < 3; ++i) {
        if ((board[i][0] == player && board[i][1] == player && board[i][2] == player) ||
            (board[0][i] == player && board[1][i] == player && board[2][i] == player)) {
            return true;
        }
    }
    // Check diagonals
    return (board[0][0] == player && board[1][1] == player && board[2][2] == player) ||
           (board[0][2] == player && board[1][1] == player && board[2][0] == player);
}

bool isBoardFull(const std::vector<std::vector<char>>& board) {
    for (const auto& row : board) {
        for (char cell : row) {
            if (cell == EMPTY) return false;
        }
    }
    return true;
}

bool playAgain() {
    char response;
    std::cout << "\nWould you like to play again? (y/n): ";
    std::cin >> response;
    return (response == 'y' || response == 'Y');
}
