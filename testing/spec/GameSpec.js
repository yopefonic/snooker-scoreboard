  /*
  xit("", function() {});

  describe("", function() {

  });
  */

describe("sbb.Game", function() {
  var game;

  beforeEach(function() {
    game = new ssb.Game('tesla', 'edison', 3);
  });

  describe("constructor", function() {
    it("should set the frameCount", function() {
      expect(game.frameCount).toEqual(3);
    });

    it("should create 2 players", function() {
      expect(game.players.length).toEqual(2);
    });

    it("should create sbb.Player objects", function() {
      expect(game.players.first()).toBeClass("ssb.Player");
      expect(game.players.last()).toBeClass("ssb.Player");
    });

    it("should set the correct player names", function() {
      expect(game.players.first().name).toEqual("tesla");
      expect(game.players.last().name).toEqual("edison");
    });

    it("should create one frame", function() {
      expect(game.frames.length).toEqual(1);
    });

    it("should create sbb.Frame objects", function() {
      expect(game.frames.first()).toBeClass("ssb.Frame");
    });
  });

  describe("createNextFrame", function() {
    describe("when the game does not have a winner", function() {
      it("should create another frame", function() {
        game.createNextFrame();
        expect(game.frames.length).toEqual(2);
      });
    });

    describe("when the game has a winner", function() {
      it("should call the end of the game", function() {
        spyOn(game, 'endGame');

        game.frames.first().scores = [[5],[]];
        game.frameCount = 1;

        game.createNextFrame();

        expect(game.endGame).toHaveBeenCalled();
      });
    });
  });

  describe("currentFrame", function() {
    it("should return the last frame", function() {
      expect(game.currentFrame()).toBe(game.frames.last());
    });
  });

  describe("getScore", function() {
    describe("when one frame is played and won by player 1", function() {
      it("should return player 0 as winner of 1 frame and player 1 of 0", function() {
        game.currentFrame().scores = [[1],[]];
        expect(game.getScore()).toEqual([1,0]);
      });
    });

    describe("when two frames are played but one is no decided yet", function() {
      it("should return", function() {
        game.currentFrame().scores = [[1],[]];
        game.createNextFrame();
        expect(game.getScore()).toEqual([1,0]);
      });
    });

    describe("when multiple frames are played", function() {
      it("should return", function() {
        game.currentFrame().scores = [[1],[]]; //frame 1
        game.createNextFrame();
        game.currentFrame().scores = [[],[1]]; //frame 2 (needs to be in this order not to trigger endGame())
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 3

        expect(game.getScore()).toEqual([2,1]);
      });
    });
  });

  describe("getWinner", function() {
    describe("when one player is ahead by one frame", function(){
      beforeEach(function() {
        game.currentFrame().scores = [[1],[]];
      });

      it("should be defined", function() {
        expect(game.getWinner()).toBeDefined();
      });

      it("should return a player object", function() {
        expect(game.getWinner()).toBeClass("ssb.Player");
      });
    });

    describe("when there is a tie game", function(){
      beforeEach(function() {
        game.currentFrame().scores = [[1],[]]; //frame 1
        game.createNextFrame();
        game.currentFrame().scores = [[],[1]]; //frame 2
      });

      it("should not be defined", function() {
        expect(game.getWinner()).toBeUndefined();
      });

    });
  });

  describe("hasWinner", function() {
    describe("when 1 frame is played in best out of 3", function() {
      it("should not have a winner", function() {
        game.currentFrame().scores = [[1],[]]; //frame 1

        expect(game.hasWinner()).toBeFalsy();
      });
    });

    describe("when 2 frames are played in best out of 3", function() {
      it("should have a winner if 2-0", function() {
        game.currentFrame().scores = [[1],[]]; //frame 1
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 2

        expect(game.hasWinner()).toBeTruthy();
      });

      it("should not have a winner if 1-1", function() {
        game.currentFrame().scores = [[1],[]]; //frame 1
        game.createNextFrame();
        game.currentFrame().scores = [[],[1]]; //frame 2

        expect(game.hasWinner()).toBeFalsy();
      });
    });

    describe("when 3 frames are played in best out of 3", function() {
      it("should have a winner if 2-1", function() {
        game.currentFrame().scores = [[1],[]]; //frame 1
        game.createNextFrame();
        game.currentFrame().scores = [[],[1]]; //frame 2 (needs to be in this order not to trigger endGame())
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 3

        expect(game.hasWinner()).toBeTruthy();
      });
    });

    describe("when 5 frames are played in best out of 7", function() {
      beforeEach(function() {
        game.frameCount = 7;
        game.currentFrame().scores = [[],[1]]; //frame 1 (needs to be in this order not to trigger endGame())
        game.createNextFrame();
      });

      it("should have a winner if 4-1", function() {
        game.currentFrame().scores = [[1],[]]; //frame 2
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 3
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 4
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 5

        expect(game.hasWinner()).toBeTruthy();
      });

      it("should not have a winner if 3-2", function() {
        game.currentFrame().scores = [[],[1]]; //frame 2 (needs to be in this order not to trigger endGame())
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 3
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 4
        game.createNextFrame();
        game.currentFrame().scores = [[1],[]]; //frame 5

        expect(game.hasWinner()).toBeFalsy();
      });
    });
  });

  describe("endGame", function() {
    //TODO: to be determined. probably a callback method to the controller object
  });
});