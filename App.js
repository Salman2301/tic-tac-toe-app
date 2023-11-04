import React, { useState } from "react";
import { Animated } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TicTacToe = () => {
  const [theme, setTheme] = useState(themes[0]);

  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [lastCurrentPlayer, setLastCurrentPlayer] = useState("X");

  const [board, setBoard] = useState(Array(9).fill(null));
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winnerStyleStrike, setWinnerStyleStrike] = useState("");

  const strikeAnimation = new Animated.Value(0);

  const animateStrike = () => {
    Animated.timing(strikeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

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
      setWinner(calculatedWinner.winner);
      setWinnerStyleStrike(calculatedWinner.winnerStyleStrike);
      setScore((prevScore) => ({
        ...prevScore,
        [calculatedWinner.winner]: prevScore[calculatedWinner.winner] + 1,
      }));
      setIsGameOver(true);
    } else if (newBoard.every((square) => square !== null)) {
      // draw
      setIsGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

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

    const winnerStyleStrikes = ["H1", "H2", "H3", "V1", "V2", "V3", "TL", "TR"];

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], winnerStyleStrike: winnerStyleStrikes[i]};
      }
    }

    return null;
  };

  const resetScore = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setLastCurrentPlayer("X");
    setScore({ X: 0, O: 0 });
    setWinnerStyleStrike("");
    strikeAnimation.setValue(0);
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
      <Text style={[styles.squareText, { color: theme.squareTextColor }]}>
        {board[index]}
      </Text>
    </TouchableOpacity>
  );

  const renderWinnerStrike = () => {
    animateStrike();
    const winnerStrikeName = "winnerStrike" + winnerStyleStrike;
    const strikeStyle = styles[winnerStrikeName];
    const interpolatedStrike = strikeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    const animatedStrikeStyle = {
      ...strikeStyle,
      [["H1","H2","H3"].includes(winnerStyleStrike) ?  "width": "height"]: interpolatedStrike,
    };

    if (winnerStyleStrike === "TL") {
      animatedStrikeStyle.transform = [ 
        { translateX: strikeAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 74],
        }) },
        { translateY: 0 },
        { rotate: "-45deg"}
      ]
    }
    else if(winnerStyleStrike === "TR") {
      animatedStrikeStyle.transform = [ 
        { translateX: strikeAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [150, 74],
        }) },
        { translateY: 0 },
        { rotate: "45deg"}
      ]
    }
    return <Animated.View style={animatedStrikeStyle}></Animated.View>;
  };

  return (
    <View style={[styles.body, { backgroundColor: theme.backgroundColor }]}>
      <TouchableOpacity style={styles.headerContainer} onPress={changeTheme}>
        <FontAwesome
          name={theme.name === "dark-theme" ? "sun-o" : "moon-o"}
          color={theme.name === "dark-theme" ? "white" : "black"}
          size={24}
        />
      </TouchableOpacity>
      <View style={styles.gameBody}>
        <Text style={[styles.header, { color: theme.headerColor }]}>
          {board.every((e) => e === null)
            ? `Start Game: Player ${currentPlayer}`
            : winner
            ? `Player ${winner} Wins!!`
            : isGameOver
            ? "Game Drawn"
            : `Player ${currentPlayer} Turn`}
        </Text>
        <View>
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
          <Text style={[styles.scoreTitle, { color: theme.scoreTextColor }]}>
            Score
          </Text>
          <View style={styles.scoreTextContainer}>
            <View style={styles.playerScore}>
              <Text
                style={[styles.scoreBigText, { color: theme.scoreTextColor }]}
              >
                {score.X}
              </Text>
              <Text
                style={[styles.playerName, { color: theme.scoreTextColor }]}
              >
                Player X
              </Text>
            </View>
            <View style={styles.playerScore}>
              <Text
                style={[styles.scoreBigText, { color: theme.scoreTextColor }]}
              >
                {score.O}
              </Text>
              <Text
                style={[styles.playerName, { color: theme.scoreTextColor }]}
              >
                Player O
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {board.every((e) => e === null) ? null : (
            <TouchableOpacity style={styles.button} onPress={startNewGame}>
              <Text style={styles.buttonText}>
                {isGameOver ? "Rematch" : "New Game"}
              </Text>
            </TouchableOpacity>
          )}
          {score.X !== 0 || score.O !== 0 ? (
            <TouchableOpacity
              style={[styles.button, { justifyContent: "flex-end" }]}
              onPress={resetScore}
            >
              <Text style={styles.buttonText}>Reset Score</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const themes = [
  {
    name: "dark-theme",
    backgroundColor: "#282c34",
    headerColor: "#61dafb",
    squareTextColor: "#fff",
    scoreTextColor: "#fff",
    modalBackgroundColor: "#282c34",
    modalTextColor: "#61dafb",
    borderColor: "#fff",
  },
  {
    name: "Theme 1",
    backgroundColor: "#f0f0f0",
    headerColor: "#333",
    squareTextColor: "#000",
    scoreTextColor: "#000",
    modalBackgroundColor: "#fff",
    modalTextColor: "#000",
  },
];

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingLeft: 20,
  },
  gameBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
  },
  square: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  squareText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-around",
    width: "80%",
    height: 50
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "80%",
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
    color: "#fff",
    textAlign: "center",
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
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#0d8ec6",
    opacity: 0.8,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: -14,
  },
  scoreTextContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  playerScore: {
    alignItems: "center",
    fontWeight: "normal",
    fontSize: 28,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  scoreBigText: {
    fontSize: 32,
    fontWeight: "normal",
    color: "#fff",
  },

  button: {
    backgroundColor: "#0d8ec6",
    paddingVertical: 10,
    borderRadius: 5,
    width: 120,
    margin: 5,
    height: 40
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
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
    transform: [
      { translateY: 0 },
      { translateX },
      { rotate }
    ],
  };
}

export default TicTacToe;
