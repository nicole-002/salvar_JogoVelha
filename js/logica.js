var board = [0,1,2,3,4,5,6,7,8];
var currentPlayer = "X";
var gameOver = false;
var jogandoBot = false;
var statusJogador = document.getElementById("status");


function cellClick(cellIndex) {
  // Se o jogo não acabou e não é vez do bot e a célula está vazia
  if (!gameOver && !jogandoBot && typeof board[cellIndex] === 'number') {
    board[cellIndex] = "X"; // Marca X no tabuleiro
    updateGame(); // Atualiza a interface

    if (checkWin(board, "X")) {
      gameOverState(-10); // Jogador venceu
      return;
    } else if (emptySpots(board).length === 0) {
      gameOverState(0); // Empate
      return;
    }

    jogandoBot = true; // Impede novo clique

    setTimeout(function() {
      var botMove = bestSpot(); // Calcula melhor jogada do bot
      board[botMove] = "O";
      updateGame();

      if (checkWin(board, "O")) {
        gameOverState(10); // Bot venceu
      } else if (emptySpots(board).length === 0) {
        gameOverState(0); // Empate
      }

      jogandoBot = false; // Libera cliques novamente
    }, 1000);
  }
}

function checkWin(bd, player) {
  // Verifica se jogador preencheu alguma combinação vencedora
  const wins = [
    [0,1,2], [3,4,5], [6,7,8], // linhas
    [0,3,6], [1,4,7], [2,5,8], // colunas
    [0,4,8], [2,4,6]           // diagonais
  ];
  return wins.some(comb => comb.every(index => bd[index] === player));
}

function updateGame() {
  // Atualiza cada célula com X ou O
  for (var i = 0; i < 9; i++) {
    const cell = document.getElementById("cell" + i);
    cell.innerHTML = ""; // Limpa a célula antes de adicionar o ícone

    if (board[i] === "X" || board[i] === "O") {
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', board[i] === "X" ? 'x' : 'circle');
      cell.appendChild(icon);
    }
  }

  if (!gameOver) {
  const vez = board.filter(v => v === "X").length > board.filter(v => v === "O").length ? "O" : "X";
  statusJogador.textContent = "Vez do jogador " + vez;
  }

  lucide.createIcons(); // Ativa os ícones do Lucide
}


function emptySpots(bd) {
  // Retorna posições livres no tabuleiro
  return bd.filter(s => s !== "X" && s !== "O");
}

function bestSpot() {
  // Usa o minimax para decidir o melhor movimento do bot
  return minimax(board, "O").index;
}

function minimax(newBoard, player) {
  var availSpots = emptySpots(newBoard);

  // Condições finais: vitória ou empate
  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  var moves = [];

  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]]; // Guarda índice original
    newBoard[availSpots[i]] = player;     // Simula jogada

    var result = minimax(newBoard, player === "O" ? "X" : "O"); // Próxima jogada
    move.score = result.score; // Salva pontuação

    newBoard[availSpots[i]] = move.index; // Desfaz jogada
    moves.push(move); // Adiciona à lista
  }

  // Escolhe a melhor jogada (máximo para O, mínimo para X)
  var bestMove;
  if (player === "O") {
    var bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // (Bug aqui: timeout inválido e inútil)
  setTimeout(() => {
    console.log("Delay 1 S.");
  }, "3000"); // <-- Isso é string. Corrigir: 3000 (número)

  return moves[bestMove]; // Retorna o melhor movimento
}

function gameOverState(score) {
  // // Exibe mensagem de fim de jogo com base no placar
  // if (score === 10) {
  //   document.getElementById("end-game").innerText = "Você perdeu!";
  // } else if (score === -10) {
  //   document.getElementById("end-game").innerText = "Você venceu!";
  // } else {
  //   document.getElementById("end-game").innerText = "Empate!";
  // }
  document.getElementById("game-over").style.display = "block";
  gameOver = true;

  statusJogador.textContent = score === 0 ? "Empate!" : "Vitória de " + (score === 10 ? "O" : "X");

}

function resetGame() {
  // Reinicia tabuleiro e oculta mensagem final
  board = [0,1,2,3,4,5,6,7,8];
  currentPlayer = "X";
  gameOver = false;
  updateGame();
  statusJogador.textContent = "Vez do jogador X";

}

// Adiciona eventos de clique em cada célula
for (let i = 0; i < 9; i++) {
  document.getElementById("cell" + i).addEventListener("click", function() {
    cellClick(i);
  });
}

document.getElementById("reset-button").addEventListener("click", resetGame);
