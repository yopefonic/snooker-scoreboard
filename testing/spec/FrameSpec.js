describe("ssb.Frame", function() {
  var frame;

  beforeEach(function() {
    frame = new ssb.Frame();
  });

  describe("constructor", function() {
    it("should start with an empty set of scores", function() {
      expect(frame.scores).toEqual([[],[]]);
    });

    it("should start with an empty set of fouls", function() {
      expect(frame.fouls).toEqual([[],[]]);
    });
  });

  describe("addScore", function() {
    describe("when adding a score to player 0", function() {
      it("should add the score to the player without affecting the other", function() {
        frame.addScore(0, 8);
        expect(frame.scores).toEqual([[8],[]]);
      });
    });

    describe("when adding a score to player 1", function() {
      it("should add the score to the player without affecting the other", function() {
        frame.addScore(1, 8);
        expect(frame.scores).toEqual([[],[8]]);
      });
    });

    describe("when adding a score to player 0 and 1", function() {
      it("should add the score to the player without affecting the other", function() {
        frame.addScore(0, 5);
        frame.addScore(1, 8);
        expect(frame.scores).toEqual([[5],[8]]);
      });
    });
  });

  describe("addFoul", function() {
    describe("when adding a foul to player 0", function() {
      it("should add the foul to the player without affecting the other", function() {
        frame.addFoul(0, 8);
        expect(frame.fouls).toEqual([[8],[]]);
      });
    });

    describe("when adding a foul to player 1", function() {
      it("should add the foul to the player without affecting the other", function() {
        frame.addFoul(1, 8);
        expect(frame.fouls).toEqual([[],[8]]);
      });
    });

    describe("when adding a foul to player 0 and 1", function() {
      it("should add the foul to the player without affecting the other", function() {
        frame.addFoul(0, 5);
        frame.addFoul(1, 8);
        expect(frame.fouls).toEqual([[5],[8]]);
      });
    });
  });

  describe("getScore", function() {
    describe("when there is just one score", function() {
      beforeEach(function() {
        frame.scores = [[1], [8]];
      });

      it("should give player 0 a score of 1", function() {
        expect(frame.getScore(0)).toEqual(1);
      });

      it("should give player 1 a score of 8", function() {
        expect(frame.getScore(1)).toEqual(8);
      });
    });

    describe("when there are multiple scores", function() {
      beforeEach(function() {
        frame.scores = [[1,8], [8,9]];
      });

      it("should give player 0 a score of 9", function() {
        expect(frame.getScore(0)).toEqual(9);
      });

      it("should give player 1 a score of 17", function() {
        expect(frame.getScore(1)).toEqual(17);
      });
    });

    describe("when there is one foul", function() {
      beforeEach(function() {
        frame.fouls = [[4], [7]];
      });

      it("should give player 0 a score of 7", function() {
        expect(frame.getScore(0)).toEqual(7);
      });

      it("should give player 1 a score of 4", function() {
        expect(frame.getScore(1)).toEqual(4);
      });
    });

    describe("when there are multiple fouls", function() {
      beforeEach(function() {
        frame.fouls = [[4,7], [5,7]];
      });

      it("should give player 0 a score of 12", function() {
        expect(frame.getScore(0)).toEqual(12);
      });

      it("should give player 1 a score of 11", function() {
        expect(frame.getScore(1)).toEqual(11);
      });
    });

    describe("when there are fouls and scores", function() {
      beforeEach(function() {
        frame.fouls = [[4,7], [5,7]];
        frame.scores = [[1,8], [8,9]];
      });

      it("should give player 0 a score of 21", function() {
        expect(frame.getScore(0)).toEqual(21);
      });

      it("should give player 1 a score of 28", function() {
        expect(frame.getScore(1)).toEqual(28);
      });
    });
  });

  describe("getHighBreak", function() {
    describe("when there is no score", function() {
      it("should give back a score of 0 for no score", function() {
        expect(frame.getHighBreak(1)).toEqual(0);
      });
    });

    describe("when there is one score", function() {
      it("should give back just the one possible score", function() {
        frame.scores = [[],[3]];
        expect(frame.getHighBreak(1)).toEqual(3);
      });
    });

    describe("when there are multiple scores", function() {
      it("should give back the highest in the range", function() {
        frame.scores = [[3,8],[]];
        expect(frame.getHighBreak(0)).toEqual(8);
      });
    });
  });

  describe("getWinner", function() {
    describe("when player 0 has the highest score", function() {
      it("should return player 0 as the winner", function() {
        frame.scores = [[2],[1]];
        expect(frame.getWinner()).toEqual(0);
      });
    });

    describe("when player 1 has the highest score", function() {
      it("should return player 1 as the winner", function() {
        frame.scores = [[1],[2]];
        expect(frame.getWinner()).toEqual(1);
      });
    });

    describe("when both players have the same score", function() {
      it("should return number 2 as a sign of equal", function() {
        frame.scores = [[2],[2]];
        expect(frame.getWinner()).toEqual(2);
      });
    });
  });

  describe("hasWinner", function() {
    describe("when any player has a higher score", function() {
      it("should return false for player 1 winner", function() {
        frame.scores = [[1],[2]];
        expect(frame.hasWinner()).toBeTruthy();
      });

      it("should return false for player 0 winner", function() {
        frame.scores = [[2],[1]];
        expect(frame.hasWinner()).toBeTruthy();
      });
    });

    describe("when players have the same score", function() {
      it("should return false", function() {
        frame.scores = [[2],[2]];
        expect(frame.hasWinner()).toBeFalsy();
      });
    });
  });
});