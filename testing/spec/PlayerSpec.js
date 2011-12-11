describe("ssb.Player", function() {
  var player;

  beforeEach(function() {
    player = new ssb.Player('einstein');
  });

  describe("constructor", function() {
    it("should create a player object with a name", function() {
      expect(player.name).toEqual('einstein');
    });
  });
});