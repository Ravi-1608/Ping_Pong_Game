(function () {
  // Getting the elements through id's using query selector
  var ball = document.querySelector("#ball");
  var P1 = document.querySelector("#P1");
  var P2 = document.querySelector("#P2");
  var P1Score = document.querySelector("#P1Score");
  var P2Score = document.querySelector("#P2Score");

  // Defining names for rods and storing the data in local storage
  const storeName = "PingPongName";
  const storeScore = "PingPongMaxScore";
  const P1Name = "P1";
  const P2Name = "P2";

  // Defining some more useful variables
  let P1ScoreUpdate = 0;
  let P2ScoreUpdate = 0;

  let score1 = 0;
  let score2 = 0;

  let maximumScore,
    movement,
    player,
    ballSpeedXAxis = 2,
    ballSpeedYAxis = 2;

  let started = false;

  // Storing the width and height of viewport
  let windowWidthInner = window.innerWidth,
    windowHeightInner = window.innerHeight;

  // Storing data in local storage
  (function () {
    player = localStorage.getItem(storeName);
    maximumScore = localStorage.getItem(storeScore);
    if (player === "null" || maximumScore === "null") {
      alert("LET'S PLAY THE GAME!!!");
      maximumScore = 0;
      player = "P1";
    } else {
      alert(player + " has the maximum score of " + maximumScore * 100);
    }
    resetBoard(player);
  })();

  // Resetting the game
  function resetBoard(playerName) {
    P1.style.left = (window.innerWidth - P1.offsetWidth) / 2 + "px";
    P2.style.left = (window.innerWidth - P2.offsetWidth) / 2 + "px";
    ball.style.left = (windowWidthInner - ball.offsetWidth) / 2 + "px";
    P1ScoreUpdate = 0;
    P2ScoreUpdate = 0;
    P1Score.innerHTML = 0;
    P2Score.innerHTML = 0;

    // Whoever losses the game get's the ball next time
    if (playerName === P2Name) {
      ball.style.top = P1.offsetTop + P1.offsetHeight + "px";
      ballSpeedYAxis = 2;
    } else if (playerName === P1Name) {
      ball.style.top = P2.offsetTop - P2.offsetHeight + "px";
      ballSpeedYAxis = -2;
    }

    score1 = 0;
    score2 = 0;
    started = false;
  }

  // After Winning Display Score
  function storeWin(Player, score) {
    console.log("Player name is " + Player + "Score is " + score);
    if (score > maximumScore) {
      maximumScore = score;
      localStorage.setItem(storeName, Player);
      localStorage.setItem(storeScore, maximumScore);
    }
    clearInterval(movement);
    resetBoard(Player);

    alert(
      Player +
        " wins with a score of " +
        score * 100 +
        ". Max score is: " +
        maximumScore * 100
    );
  }

  // Adding Event Listener on pressing the key
  window.addEventListener("keypress", function () {
    let PlayerSpeed = 20;

    let PlayerRect = P1.getBoundingClientRect();

    if (
      event.code === "KeyD" &&
      PlayerRect.x + PlayerRect.width < window.innerWidth
    ) {
      P1.style.left = PlayerRect.x + PlayerSpeed + "px";
      P2.style.left = P1.style.left;
    } else if (event.code === "KeyA" && PlayerRect.x > 0) {
      P1.style.left = PlayerRect.x - PlayerSpeed + "px";
      P2.style.left = P1.style.left;
    }

    // When user presses the Enter key
    if (event.code === "Enter") {
      if (!started) {
        started = true;
        let ballRect = ball.getBoundingClientRect();
        let ballX = ballRect.x;
        let ballY = ballRect.y;
        let ballDia = ballRect.width;

        let P1Height = P1.offsetHeight;
        let P2Height = P2.offsetHeight;
        let P1Width = P1.offsetWidth;
        let P2Width = P2.offsetWidth;

        movement = setInterval(function () {
          // Moving the ball
          ballX += ballSpeedXAxis;
          ballY += ballSpeedYAxis;

          var P1X = P1.getBoundingClientRect().x;
          var P2X = P2.getBoundingClientRect().x;

          ball.style.left = ballX + "px";
          ball.style.top = ballY + "px";

          if (ballX + ballDia > windowWidthInner || ballX < 0) {
            ballSpeedXAxis = -ballSpeedXAxis; // Reverses the direction
          }

          // Defining the center of the ball on display
          let ballPos = ballX + ballDia / 2;

          // Checking for Rod 1
          if (ballY <= P1Height) {
            // Changing ball direction in the opposite direction
            ballSpeedYAxis = -ballSpeedYAxis;
            score1++;
            P1ScoreUpdate++;
            P1Score.innerHTML = P1ScoreUpdate * 100;

            // Checking if any of the rod losses
            if (ballPos < P1X || ballPos > P2X + P1Width) {
              storeWin(P2Name, score1);
            }
          }

          // Checking for Rod 2
          else if (ballY + ballDia >= windowHeightInner - P2Height) {
            // Changing ball direction in the opposite direction
            ballSpeedYAxis = -ballSpeedYAxis;
            score2++;
            P2ScoreUpdate++;
            P2Score.innerHTML = P2ScoreUpdate * 100;

            // Checking if any of the rod losses
            if (ballPos < P2X || ballPos > P2X + P2Width) {
              storeWin(P1Name, score2);
            }
          }
        }, 10);
      }
    }
  });
})();
