function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
  var i = arr.length; //the element that is currently. being shuffled. in the loop it starts at length - 1
  var j; //the number that will be used for the random element to be switched with i
  var temp; //temporary box used for shuffling

  while (--i > 0) { //dont shuffle the 0th index. decrement the index for each loop
    j = Math.floor(Math.random() * (i + 1)); //generate a random number between 0 and i inclusive.
    temp = arr[j];   //swap arr[j] with arr[i];
    arr[j] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

function Game(playersGuess, pastGuesses, winningNumber) {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(n) {
  if (n < 1 || n > 100 || typeof n !== "number") {
    throw "That is an invalid guess.";
  } else {
  this.playersGuess = n;
  return this.checkGuess();
}
}

Game.prototype.checkGuess = function() {

  if (this.playersGuess === this.winningNumber) {
    $("#winLose").text("You win!");
    $('#hint, #submit, #player-input').prop("disabled",true);
    return  "You just got lucky... \n Press reset to play again.";
  } else  {
    if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
      $("#winLose").text("Really?");
      return "You have already guessed that number.";
    }
    else {
      this.pastGuesses.push(this.playersGuess);
      //this adds each guess to the list in the DOM
      $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
      if(this.pastGuesses.length === 5) {
        $("#winLose").text("You lose! Bummer.");
        $('#hint, #submit, #player-input').prop("disabled",true);
        return "Sashay away... \n Press reset to play again.";
      }
      else {
        var diff = this.difference();
        if(diff < 10)  {$("#winLose").text("Almost!"); return "You're burning up!";}
        else if(diff < 25) {$("#winLose").text("Nah."); return "You're lukewarm.";}
        else if(diff < 50) {$("#winLose").text("Do better."); return "You're a bit chilly.";}
        else {$("#winLose").text("Nope."); return "You're ice cold!";}
      }
    }
  }
}

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  var hintArr = [];
  hintArr.push(this.winningNumber, generateWinningNumber(), generateWinningNumber());
  shuffle(hintArr);
  return "The winning number is either " + hintArr[0] + ", " + hintArr[1] + ", or " + hintArr[2] + ".";
}

//JQuery Stuff

function guessIt(game) {
  var guess = $("#player-input").val();
  $("#player-input").val("");
  var output = game.playersGuessSubmission(parseInt(guess, 10));
  $("#thermometer").text(output);
}



$(document).ready(function() {
  var game = newGame();

  $("#submit").on("click", function() {
    guessIt(game);
  });

  $("#player-input").keypress(function(e) {
    if (e.which == 13) {
      guessIt(game);
    }
  });

  $("#hint").on("click", function() {
    $("#displayHint").text(game.provideHint());
  });

  $("#reset").on("click", function() {
    newGame();
    $('#hint, #submit, #player-input').prop("disabled", false);
    $("#displayHint").text("Guess a number between 1 and 100.");
    $("#thermometer").text("Gonna lose this time too.");
    $("#winLose").text("Again? Ok.");
    $(".guess").text("");
  });
});
