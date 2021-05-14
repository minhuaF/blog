/**
 * 中介者模式
 * 一个对象应该尽可能少地了解另外的对象；
 * 在中介者模式中，对象之间几乎不知道批次的存在，只能通过中介者对象来相互影响对方
 * 缺点：新增中介者对象，中介者对象一般很巨大，比较难维护
 */

function Player(name) {
  this.name = name;
  this.enemy = null;
};

Player.prototype.win = function(){
  console.log(this.name + 'won')
}

Player.prototype.lose = function(){
  console.log(this.name + 'lost')
}

Player.prototype.die = function(){
  this.lose();
  this.enemy.win();
}

var player1 = new Player('player1');
var player2 = new Player('player2');

player1.enemy = player2;
player2.enemy = player1;

player1.die()