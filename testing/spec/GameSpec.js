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
        describe("when the game has no frames", function() {
            it("should create the first frame", function() {
                game.frames = []
                expect(game.createNextFrame()).toEqual(true);
                expect(game.frames.length).toEqual(1);
            });
        });

        describe("when the game does not have a winner", function() {
            it("should create another frame", function() {
                game.frames.first().scores = [
                    [5],
                    []
                ];
                expect(game.createNextFrame()).toEqual(true);
                expect(game.frames.length).toEqual(2);
            });
        });

        describe("when the game has a winner", function() {
            it("should return true but not create a frame", function() {
                game.frames.first().scores = [
                    [5],
                    []
                ];
                game.frameCount = 1;
                expect(game.createNextFrame()).toEqual(true);
                expect(game.frames.length).toEqual(1);
            });
        });
    });

    describe("currentFrame", function() {
        it("should return the last frame", function() {
            expect(game.currentFrame()).toBe(game.frames.last());
        });
    });

    describe("getScore", function() {
        describe("when one frame is played and has a winning score", function() {
            beforeEach(function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ];
            });

            describe("when frame has not ended", function() {
                it("should return an equal score", function() {
                    game.currentFrame().ended = false;
                    expect(game.getScore()).toEqual([0,0]);
                });
            });

            describe("when frame has ended", function() {
                it("should return a 1 to 0 score line", function() {
                    game.currentFrame().ended = true;
                    expect(game.getScore()).toEqual([1,0]);
                });
            });
        });

        describe("when one frame is played and has no winning score", function() {
            beforeEach(function() {
                game.currentFrame().scores = [
                    [1],
                    [1]
                ];
            });

            describe("when frame has not ended", function() {
                it("should return player 0 as winner of 1 frame and player 1 of 0", function() {
                    game.currentFrame().ended = false;
                    expect(game.getScore()).toEqual([0,0]);
                });
            });

            describe("when frame has ended", function() {
                it("should return player 0 as winner of 1 frame and player 1 of 0", function() {
                    game.currentFrame().ended = true;
                    expect(game.getScore()).toEqual([0,0]);
                });
            });
        });

        describe("when multiple frames are played", function() {
            it("should return", function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 1
                game.createNextFrame();
                game.currentFrame().scores = [
                    [],
                    [1]
                ]; //frame 2 (needs to be in this order not to trigger endGame())
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 3
                game.createNextFrame();

                expect(game.getScore()).toEqual([2,1]);
            });
        });
    });

    describe("getWinner", function() {
        describe("when one player is ahead by one frame", function() {
            beforeEach(function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ];
                game.currentFrame().ended = true;
            });

            it("should be defined", function() {
                expect(game.getWinner()).toBeDefined();
            });

            it("should return a player object", function() {
                expect(game.getWinner()).toBeClass("ssb.Player");
            });
        });

        describe("when there is a tie game", function() {
            beforeEach(function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 1
                game.createNextFrame();
                game.currentFrame().scores = [
                    [],
                    [1]
                ]; //frame 2
                game.createNextFrame();
            });

            it("should not be defined", function() {
                expect(game.getWinner()).toBeUndefined();
            });

        });
    });

    describe("hasWinner", function() {
        describe("when 1 frame is played in best out of 3", function() {
            it("should not have a winner", function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 1
                game.createNextFrame();

                expect(game.hasWinner()).toBeFalsy();
            });
        });

        describe("when 2 frames are played in best out of 3", function() {
            it("should have a winner if 2-0", function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 1
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 2
                game.createNextFrame();

                expect(game.hasWinner()).toBeTruthy();
            });

            it("should not have a winner if 1-1", function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 1
                game.createNextFrame();
                game.currentFrame().scores = [
                    [],
                    [1]
                ]; //frame 2
                game.createNextFrame();

                expect(game.hasWinner()).toBeFalsy();
            });
        });

        describe("when 3 frames are played in best out of 3", function() {
            it("should have a winner if 2-1", function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 1
                game.createNextFrame();
                game.currentFrame().scores = [
                    [],
                    [1]
                ]; //frame 2 (needs to be in this order not to trigger endGame())
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 3
                game.createNextFrame();

                expect(game.hasWinner()).toBeTruthy();
            });
        });

        describe("when 5 frames are played in best out of 7", function() {
            beforeEach(function() {
                game.frameCount = 7;
                game.currentFrame().scores = [
                    [],
                    [1]
                ]; //frame 1 (needs to be in this order not to trigger endGame())
                game.createNextFrame();
            });

            it("should have a winner if 4-1", function() {
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 2
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 3
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 4
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 5
                game.createNextFrame();

                expect(game.hasWinner()).toBeTruthy();
            });

            it("should not have a winner if 3-2", function() {
                game.currentFrame().scores = [
                    [],
                    [1]
                ]; //frame 2 (needs to be in this order not to trigger endGame())
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 3
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 4
                game.createNextFrame();
                game.currentFrame().scores = [
                    [1],
                    []
                ]; //frame 5
                game.createNextFrame();

                expect(game.hasWinner()).toBeFalsy();
            });
        });
    });
});