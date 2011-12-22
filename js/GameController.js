// CONTROLLER

dojo.declare("ssb.GameController", null, {
    constructor: function() {
        this.game = null;

        window.newInput = new ssb.NewInputController();
        window.scoreInput = new ssb.ScoreInputController();

        var self = this;

        dojo.query("#end_frame").connect("onclick", function(event){
            if (confirm("Are you sure you want to end the frame and \nstart the next one?")) {
                self.endFrame();
            }
        });

        dojo.query("#end_game").connect("onclick", function(event){
            if (confirm("Are you sure you want to end the game and \nannounce a winner?")) {
                self.endGame();
            }
        });
    },

    createGame: function(player_0, player_1, best_of) {
        this.game = new ssb.Game(player_0, player_1, best_of);
        this.repaintPlayers();
        this.repaintScore();

        dojo.byId("container").className = "playing";
        window.newInput.resetForm();
    },

    repaintPlayers: function() {
        // set the player names
        dojo.forEach(this.game.players, function(entry, i){
            dojo.query("#player_names .p" + i).first().innerHTML = entry.name;
        });
    },

    repaintScore: function() {
        // set the current score
        var frameScore = this.game.getScore();
        var self = this;

        dojo.forEach(this.game.players, function(entry, i){
            var baseSelector = "#player_scores .p" + i;

            dojo.query(baseSelector + " .frames").first().innerHTML = frameScore[i];
            dojo.query(baseSelector + " .current").first().innerHTML = self.game.currentFrame().getScore(i);
        });

        // set best of
        dojo.query("#player_scores .bestOf").first().innerHTML = "(" + this.game.frameCount + ")";
    },

    applyScoreInput: function(playerId, score) {
        this.game.currentFrame().addScore(playerId, score);
        this.repaintScore();
    },

    applyFoulInput: function(playerId, foul) {
        this.game.currentFrame().addFoul(playerId, foul);
        this.repaintScore();
    },

    endFrame: function() {
        if (this.game.createNextFrame()) {
            this.repaintScore();
            window.scoreInput.closeScoreInput();

            if (this.game.hasWinner()) {
                this.endGame();
            }
        } else {
            alert("The current frame does not have a winner, please continue playing until there is a winner.");
        }
    },

    endGame: function() {
        // ending current frame
        if (!this.game.currentFrame().ended) {
            this.game.currentFrame().endFrame();
        }

        this.repaintScore();

        // winner name
        var winner = this.game.getWinner();
        if (winner == undefined) {
            dojo.byId("winner_name").innerHTML = "There is no winner";
        } else {
            dojo.byId("winner_name").innerHTML = "Winner: " + winner.name;
        }

        // update score
        var scores = dojo.query("#player_score .current")
        dojo.forEach(scores, function() {
            score.innerHTML = "0";
        });

        // print frames
        var frameLines = "";
        dojo.forEach(this.game.frames, function(frame, i) {
            var listItem = '<li class="clearfix">';
            listItem += '<span>' + (i + 1) + '</span>';
            listItem += '<div class="p0'
            if (frame.getWinner() == 0) {
                listItem += ' winner';
            }
            listItem += '">';
                listItem += '<div class="score">' + frame.getScore(0) + '</div>';
                listItem += '<div class="break">(' + frame.getHighBreak(0) + ')</div>';
            listItem += "</div>";
            listItem += "<span>-</span>";
            listItem += '<div class="p1'
            if (frame.getWinner() == 1) {
                listItem += ' winner';
            }
            listItem += '">';
                listItem += '<div class="score">' + frame.getScore(1) + '</div>';
                listItem += '<div class="break">(' + frame.getHighBreak(1) + ')</div>';
            listItem += "</div>";
            listItem += "</li>";

            frameLines += listItem;
        });
        dojo.byId("winner_frames").innerHTML = frameLines;

        dojo.byId("container").className = "winner";
    }

    //resetGame: function() {
    //    reset the game to start a new one
    //}
});

// NEW INPUT CONTROLLER

dojo.declare("ssb.NewInputController", null, {
    constructor: function() {
        var self = this;

        dojo.query("#new_game_form input[type='text']").connect("onkeyup", function(event){
            self.checkNameInput(event);
        });

        dojo.query("#new_game_form input[type='text']").connect("onchange", function(event){
            self.checkNameInput(event);
        });

        dojo.query("#best_of").connect("onkeyup", function(event){
            self.checkBestOfInput(event);
        });

        dojo.query("#best_of").connect("onchange", function(event){
            self.checkBestOfInput(event);
        });

        dojo.connect(dojo.byId("new_game_form"), "onsubmit", function(event) {
            event.preventDefault();

            if (self.validateData()) {
                var data = self.getFormData();

                window.mainController.createGame(data.player_0, data.player_1, data.best_of);
                return false;
            } else {
                return false;
            }
        });
    },

    checkNameInput: function(event) {
        var object = event.target;
        if (this.checkForContent(object)) {
            dojo.removeClass(object.parentNode, "error");
        } else {
            dojo.addClass(object.parentNode, "error");
        }
    },

    checkBestOfInput: function(event) {
        var object = event.target;
        var isValid = this.checkForValidNumber(object);
        var hasContent = this.checkForContent(object);

        if (hasContent && isValid) {
            dojo.removeClass(object.parentNode, "error");
        } else {
            dojo.addClass(object.parentNode, "error");
        }
    },

    checkForContent: function(object) {
        if (object.value.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    checkForValidNumber: function(object) {
        var value = parseInt(object.value);

        if ( isNaN(value) ) {
            object.value = "";
            return false;
        } else {
            // this checks if the number is uneven
            if (value%2) {
                return true;
            } else {
                return false;
            }
        }
    },

    validateData: function() {
        var validated = true;
        var self = this;

        // check the number for validity
        validated = self.checkForValidNumber(dojo.byId('best_of'));

        // check all the input for data.
        dojo.forEach(dojo.query("#start fieldset input"), function(object) {
            if (!self.checkForContent(object)) {
                validated = false;
            }
        });

        return validated;
    },

    resetForm: function() {
        dojo.query("#start fieldset input").attr("value", "");
        dojo.query("#start fieldset").removeClass("error");
    },

    getFormData: function() {
        return {
            player_0: dojo.byId("player_0").value,
            player_1: dojo.byId("player_1").value,
            best_of: parseInt(dojo.byId("best_of").value)
        }
    }
});

// SCORE INPUT CONTROLLER

dojo.declare("ssb.ScoreInputController", null, {
    constructor: function() {
        var self = this;
        dojo.query("#score_input input.numberPad").connect("onclick", function(event){
            self.addNumberToScoreField(event.target.value);
            self.checkScore();
        });

        dojo.query("#score_input input.remove").connect("onclick", function(event){
            self.clearScoreField();
        });

        dojo.query("#score_selector input.p0").connect("onclick", function(event){
            self.openScoreInput(0);
        });

        dojo.query("#score_selector input.p1").connect("onclick", function(event){
            self.openScoreInput(1);
        });

        dojo.query("#player_break").connect("onclick", function(event){
            var data = self.getData();

            if (self.checkForErrors(155, data)) {
                window.mainController.applyScoreInput(data.playerId, data.score);
                self.clearScoreField();
            }
        });

        dojo.query("#player_foul").connect("onclick", function(event){
            var data = self.getData();

            if (self.checkForErrors(7, data)){
                window.mainController.applyFoulInput(data.playerId, data.score);
                self.clearScoreField();
            }
        });

        dojo.query("#input_done").connect("onclick", function(event){
            self.closeScoreInput();
        });

        dojo.query("#score_input_store").connect("onkeyup", function(event){
            self.checkScore();
        });
    },

    addNumberToScoreField: function(input) {
        dojo.byId("score_input_store").value = dojo.byId("score_input_store").value + input;
    },

    checkScore: function() {
        var object = dojo.byId("score_input_store");
        var value = parseInt(object.value);

        if ( isNaN(value) || value == 0 ) {
            object.value = "";
        }
    },

    checkForErrors: function(max, data) {
        if (data.score > max) {
            alert("Input cannot be higher than " + max + ".");
            return false;
        } else if (data.score == 0) {
            alert("Input cannot be 0");
            return false;
        } else {
            return true;
        }
    },

    clearScoreField: function() {
        dojo.byId("score_input_store").value = "";
    },

    resetScoreForm: function() {
        dojo.byId("score_input_store").value = "";
        dojo.byId("player_id").value = "";
        dojo.query("#input h1").first().innerHTML = "";
    },

    getData: function() {
        return {
            score: this.getScoreData(),
            playerId: parseInt( dojo.byId("player_id").value )
        };
    },

    getScoreData: function() {
        var score = parseInt( dojo.byId("score_input_store").value );

        if ( isNaN(score) ) {
            return 0;
        } else {
            return score;
        }
    },

    openScoreInput: function(playerId) {
        this.resetScoreForm();
        // set proper class
        dojo.byId("input").className = "input";
        // set playerId
        dojo.byId("player_id").value = playerId;

        // set player name header
        var player = window.mainController.game.players[playerId];
        dojo.query("#input h1").first().innerHTML = "Input for " + player.name + ":";
    },

    closeScoreInput: function() {
        this.resetScoreForm();
        dojo.byId("input").className = "actions";
    }

});
