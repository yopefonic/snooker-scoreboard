// FRAME

dojo.declare("ssb.Frame", null, {
    constructor: function() {
        this.scores = [
            [],
            []
        ];
        this.fouls = [
            [],
            []
        ];
        this.ended = false;
    },

    addScore: function(playerID, score) {
        if (!this.ended) {
            this.scores[playerID].push(score);
        }
    },

    addFoul: function(playerID, foul) {
        if (!this.ended) {
            this.fouls[playerID].push(foul);
        }
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
            return false;
        } else {
            return true;
        }
    },

    endFrame: function() {
        if (this.hasWinner()){
            this.ended = true;
            return true;
        } else {
            return false;
        }
    }
});

// PLAYER (just a name container)

dojo.declare("ssb.Player", null, {
    constructor: function(name) {
        this.name = name;
    }
});

// GAME

dojo.declare("ssb.Game", null, {
    constructor: function(player_0, player_1, frameCount) {
        this.players = [];
        this.frames = [];
        this.frameCount = frameCount;
        this.players.push(new ssb.Player(player_0));
        this.players.push(new ssb.Player(player_1));
        this.createNextFrame();
    },

    createNextFrame: function() {
        if (this.frames.length > 0) {
            if (this.currentFrame().endFrame()) {
                if (!this.hasWinner()) {
                    this.frames.push(new ssb.Frame());
                }
                return true;
            } else {
                return false;
            }
        } else {
            this.frames.push(new ssb.Frame());
            return true;
        }
    },

    currentFrame: function() {
        return this.frames.last();
    },

    getScore: function() {
        var frameScore = [
            [],
            []
        ];
        dojo.forEach(this.frames, function(frame, i) {
            var winner = frame.getWinner();
            if (winner < 2 && frame.ended) {
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

    getHighBreak: function(playerId) {
        var highBreaks = [0];
        dojo.forEach(this.frames, function(frame, i){
            highBreaks.push(frame.getHighBreak(playerId));
        });

        return highBreaks.max();
    }
});