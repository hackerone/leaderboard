// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

function randomizeScore () {
      var players = Players.find();
      players.forEach(function(p){
        Players.update({_id : p._id},{name : p.name, score: Math.floor(Random.fraction()*10)*5 });
      });
}
function addScientist () {
  var sName = $('input#scientistName').val();
  var sScore = $('input#scientistScore').val();
  if(sName.length){
    $('input#scientistName').val('');
    $('input#scientistScore').val('');
    Players.insert({name : sName, score : sScore }); 
  }
  return false;
}

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    var sortBy = {score : -1, name : 1};
    if(Session.get('sortBy') == 'name'){
      sortBy = {name : 1, score : -1};
    }
    return Players.find({}, {sort: sortBy});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.remove' : function(){
      Players.remove( Session.get("selected_player") ) ;
    },
    'click input.add' : addScientist,
    'submit form.addForm' : addScientist,
    'click input.sortName' : function(){
      Session.set('sortBy', 'name');
    },
    'click input.sortScore' : function(){
      Session.set('sortBy', 'score');
    },
    'click .randomizeScore' : randomizeScore
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
     for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
      }
  });
}
