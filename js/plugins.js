// best of: 1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35

// extending array with sum and max methods

Array.prototype.sum = function(){
	for(var i=0,sum=0;i<this.length;sum+=this[i++]);
	return sum;
}
Array.prototype.max = function(){
	return Math.max.apply({},this)
}

// FRAME

dojo.declare("ssb.Frame", null, {
  constructor: function(){},
  scores: [[], []],
  fouls: [[], []],

  addScore: function(playerID, score){
    this.scores[playerID].push(score);
  },

  addFoul: function(playerID, score){
    this.fouls[playerID].push(score);
  },

  getScore: function(playerID){
    var foulsID;
    if (playerID == 0) {
      foulsID = 1;
    } else {
      foulsID = 0;
    }
    return (this.scores[playerID].sum() + this.fouls[foulsID].sum());
  },

  getHighBreak: function(playerID){
    return this.scores[playerID].max();
  },

  getWinner: function(){
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

  hasWinner: function(){
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
  players: [],
  frames: [],
  constructor: function(){
    this.frameCount = 3;
    this.players.push(new ssb.Player("Arnold"));
    this.players.push(new ssb.Player("Bert"));
    this.createNextFrame();
  },

  createNextFrame: function(){
    if (this.frames.length < this.frameCount) {
      this.frames.push(new ssb.Frame())
    } else {
      this.endGame();
    }
  },

  currentFrame: function(){
    return this.frames[this.frames.length-1]
  },

  getFrameScore: function(){
    var frameScore = [[], []];
    dojo.forEach(this.frames, function(frame, i) {
      var winner = frame.getWinner();
      if (winner < 2) {
        frameScore[winner].push(frame);
      }
    });

    return [frameScore[0].length, frameScore[1].length]
  },

  getWinner: function(){
    var frameScore = this.getFrameScore();
    if (frameScore[0] > frameScore[1]) {
      return this.players[0];
    } else if (frameScore[1] > frameScore[0]) {
      return this.players[1];
    } else {
      alert("the game is equal");
    }
  },

  endGame: function(){
    var frameScore = this.getFrameScore();
    var winner = this.getWinner();
    alert(winner.name + "won the match with: " + frameScore[0] + " to " + frameScore[1]);
  }
});