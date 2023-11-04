import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TicTacToe = () => {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [lastCurrentPlayer, setLastCurrentPlayer] = useState("X");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [theme, setTheme] = useState(themes[0]);
  const [winnerStyleStrike, setWinnerStyleStrike] = useState("");

  const getStyle = (index) => {
    const style = [styles.square, { borderColor: theme.borderColor }];
    if (index % 3 === 2) {
      // @ts-expect-error
      style.push({ borderRightWidth: 0 });
    }
    if (Math.floor(index / 3) === 2) {
      // @ts-expect-error
      style.push({ borderBottomWidth: 0 });
    }
    return style;
  };

  const handleMove = (index) => {
    if (board[index] || winner || isGameOver) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const calculatedWinner = calculateWinner(newBoard);

    if (calculatedWinner) {
      setWinner(calculatedWinner);
      setWinnerStyleStrike(calculateWinnerComboStyle(newBoard));
      setScore((prevScore) => ({ ...prevScore, [calculatedWinner]: prevScore[calculatedWinner] + 1 }));
      setIsGameOver(true);
    } else if (newBoard.every((square) => square !== null)) {
      setIsGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const calculateWinnerComboStyle = (squares) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const winnerStyleStrikes = [
      "H1", "H2", "H3",
      "V1", "V2", "V3",
      "TL", "TR"
    ];

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return `winnerStrike${winnerStyleStrikes[i]}`;
      }
    }
    return "";
  }

  const calculateWinner = (squares) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
 
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  };

  const resetScore = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setLastCurrentPlayer("X");
    setScore({ X: 0, O: 0 });
    setWinnerStyleStrike("");
    setWinner(null);
    setIsGameOver(false);
  };

  const startNewGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsGameOver(false);
    setWinnerStyleStrike("");
    const nextPlayer = lastCurrentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(nextPlayer);
    setLastCurrentPlayer(nextPlayer);
  };

  const changeTheme = () => {
    const nextThemeIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextThemeIndex]);
  };

  const renderSquare = (index) => (
    <TouchableOpacity style={getStyle(index)} onPress={() => handleMove(index)}>
      <Text style={[styles.squareText, { color: theme.squareTextColor }]}>{board[index]}</Text>
    </TouchableOpacity>
  );

  const renderWinnerStrike = () => {
    if (winnerStyleStrike) {
      return <View style={styles[winnerStyleStrike]}></View>;
    }
    return null;
  }

  return (
    <View style={[styles.body, { backgroundColor: theme.backgroundColor }]}>
      <TouchableOpacity style={styles.headerContainer} onPress={changeTheme}>
        {
          theme.name === 'dark-theme' ? (
            <FontAwesome name="sun-o" size={24} color="white" />
          ) : (
            <FontAwesome name="moon-o" size={24} color="black" />
          )
        }
      </TouchableOpacity>
      <View style={styles.gameBody}>

        <Text style={[styles.header, { color: theme.headerColor }]}>
          {board.every(e=>e===null) ? "Start Game" : winner ? `Winner: ${winner}` : isGameOver ? 'Game Drawn' : `Next Player: ${currentPlayer}`}
        </Text>
        <View style={styles.board}>
          <View style={styles.row}>
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </View>
          <View style={styles.row}>
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </View>
          <View style={styles.row}>
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </View>
          {renderWinnerStrike()}
        </View>
        
        
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreTitle, { color: theme.scoreTextColor }]}>Score</Text>
          <View style={styles.scoreTextContainer}>
            <View style={styles.playerScore}>
              <Text style={[styles.scoreBigText, { color: theme.scoreTextColor }]}>{score.X}</Text>
              <Text style={[styles.playerName, { color: theme.scoreTextColor }]}>Player X</Text>
            </View>
            <View style={styles.playerScore}>
              <Text style={[styles.scoreBigText, { color: theme.scoreTextColor }]}>{score.O}</Text>
              <Text style={[styles.playerName, { color: theme.scoreTextColor }]}>Player O</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {board.every(e => e === null) ? null : (
            <TouchableOpacity style={styles.button} onPress={startNewGame}>
              <Text style={styles.buttonText}>
                {board.every(e => e === null) ? "New Game" : isGameOver ? "Rematch" : "New Game"}
              </Text>
            </TouchableOpacity>
          )}
          {score.X !== 0 || score.O !== 0 ? (
            <TouchableOpacity style={[styles.button, {justifyContent: "flex-end"}]} onPress={resetScore}>
              <Text style={styles.buttonText}>Reset Score</Text>
            </TouchableOpacity>
          ) : null  
          }
        </View>
      </View>
    </View>

  );
};

const themes = [
  {
    name: 'dark-theme',
    backgroundColor: '#282c34',
    headerColor: '#61dafb',
    squareTextColor: '#fff',
    scoreTextColor: '#fff',
    modalBackgroundColor: '#282c34',
    modalTextColor: '#61dafb',
    borderColor: "#fff"
  },
  {
    name: 'Theme 1',
    backgroundColor: '#f0f0f0',
    headerColor: '#333',
    squareTextColor: '#000',
    scoreTextColor: '#000',
    modalBackgroundColor: '#fff',
    modalTextColor: '#000',
  },
];

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingLeft: 20,
  },
  gameBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  board: {},
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  squareText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    width: '80%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  themeButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  themeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  
  winnerStrikeH1: createWinnerStrikeStyle(0, 24),
  winnerStrikeH2: createWinnerStrikeStyle(0, 74),
  winnerStrikeH3: createWinnerStrikeStyle(0, 124),
  winnerStrikeV1: createWinnerStrikeStyle(24, 0),
  winnerStrikeV2: createWinnerStrikeStyle(74, 0),
  winnerStrikeV3: createWinnerStrikeStyle(124, 0),
  winnerStrikeTR: createWinnerStrikeStyleDiagonal(74, "45deg"),
  winnerStrikeTL: createWinnerStrikeStyleDiagonal(74, "-45deg"),

  scoreContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: "#0d8ec6",
    opacity: 0.8,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 10
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -14
  },
  scoreTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  playerScore: {
    alignItems: 'center',
    fontWeight: 'normal',
    fontSize: 28,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 20
  },
  scoreBigText: {
    fontSize: 32,
    fontWeight: 'normal',
    color: "#fff"
  },

  button: {
    backgroundColor: "#0d8ec6",
    paddingVertical: 10,
    borderRadius: 5,
    width: 120,
    margin: 5, // Adjust as needed
  },
  buttonText: {
    color: "#fff",
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

/**
 * @returns {any}
 */
function createWinnerStrikeStyle(translateX, translateY) {
  return {
    position: "absolute",
    width: translateX === 0 ? 150 : 2,
    height: translateX === 0 ? 2 : 150,
    backgroundColor: "red",
    transform: [{ translateX }, { translateY }],
  };
}
/**
 * @returns {*}
 */
function createWinnerStrikeStyleDiagonal(translateX, rotate) {
  return {
    position: "absolute",
    width: 2,
    height: 150,
    backgroundColor: "red",
    transform: [{ translateY: 0 }, { translateX }, { rotate }],
  };
}

export default TicTacToe;
