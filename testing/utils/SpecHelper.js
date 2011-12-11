beforeEach(function() {
  // add extra matchers and methods here
  this.addMatchers({
    /*toBeEmptyScore: function() {
      return this.actual == [[], []];
    },
    toHaveScoreFor: function(playerId, expected) {
      var actual = this.actual[playerId];

      return actual == expected;
    }*/
    toBeClass: function(expectedClassName) {
      return this.actual.declaredClass == expectedClassName;
    }
  });
});