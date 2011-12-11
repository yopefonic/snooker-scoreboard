// FRAME

dojo.declare("ssb.Frame", null, {
  constructor: function() {
    this.scores = [[], []];
    this.fouls = [[], []];
  },

  addScore: function(playerID, score) {
    this.scores[playerID].push(score);
  },

  addFoul: function(playerID, score) {
    this.fouls[playerID].push(score);
  },

  getScore: function(playerID) {
    var foulsID;
    if (playerID == 0) {
      foulsID = 1;
    } else {
      foulsID = 0;
    }
    return (this.scores[playerID].sum() + this.fouls[foulsID].sum());
  },

  getHighBreak: function(playerID) {
    var max = this.scores[playerID].max();
    if (max == -Infinity) {
      return 0;
    } else {
      return max;
    }
  },

  getWinner: function() {
    var scoreA, scoreB;
    scoreA = this.getScore(0);
    scoreB = this.getScore(1);

    if (scoreA > scoreB) {
      return 0;
    } else if (scoreB > scoreA) {
      return 1;
    } else {
      return 2;
    }
  },

  hasWinner: function() {
    var winner = this.getWinner();
    if (winner == 2) {
      // alert("You cannot end a tie frame!");
      return false;
    } else {
      return true;
    }
  }
});

// PLAYER (just a name container)

dojo.declare("ssb.Player", null, {
  constructor: function(name){
    this.name = name;
  }
});

// GAME

dojo.declare("ssb.Game", null, {
  constructor: function(playerA, playerB, frameCount) {
    this.players = [];
    this.frames = [];
    this.frameCount = frameCount;
    this.players.push(new ssb.Player(playerA));
    this.players.push(new ssb.Player(playerB));
    this.createNextFrame();
  },

  createNextFrame: function() {
    if (this.hasWinner()) {
      this.endGame();
    } else {
      this.frames.push(new ssb.Frame());
    }
  },

  currentFrame: function() {
    return this.frames.last();
  },

  getScore: function() {
    var frameScore = [[], []];
    dojo.forEach(this.frames, function(frame, i) {
      var winner = frame.getWinner();
      if (winner < 2) {
        frameScore[winner].push(frame);
      }
    });

    return [frameScore[0].length, frameScore[1].length]
  },

  getWinner: function() {
    var frameScore = this.getScore();
    if (frameScore[0] > frameScore[1]) {
      return this.players[0];
    } else if (frameScore[1] > frameScore[0]) {
      return this.players[1];
    } else {
      return undefined;
    }
  },

  hasWinner: function() {
    var frameScore = this.getScore();
    var winningFrame = Math.ceil(this.frameCount / 2);

    return frameScore.max() >= winningFrame;
  },

  endGame: function() {
    var score = this.getScore();
    var winner = this.getWinner();
    //alert(winner.name + "won the match with: " + score[0] + " to " + score[1]);
  }
});