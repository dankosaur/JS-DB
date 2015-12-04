console.log("Hello World")
//Global world variables
worldActions=2;
worldHandsize=5;
startingPoints=5;
startingDeck=[]; //make this a pile object (that contains a list of cards, but other methods like shuffle, etc.) 



//This card object will be different than object of cards to buy.
var card = function(price,cardOwner,effect){ 
    this.price=price; //how much it costs to purchase (in case other cards refer to it?)
    this.cardOwner=cardOwner; //player object
    
    this.effects=effect
   
}

card.prototype.play=function(){
    
    this.effects()
}

var player = function(ai, name){
    this.ai=ai;
    this.name=name;
    this.achievements=[];
    this.hand=[]; //make this a pile object (that contains a list of cards, but other methods like shuffle, etc.) 
    this.deck=startingDeck;
    this.discard=[]; //make this a pile object (that contains a list of cards, but other methods like shuffle, etc.) 
    this.inPlay=[];
    this.inactGen=[];
    this.actGen=[];


    //The following will be initialized and done every turn
    this.points=startingPoints;
    this.actions=worldActions;
    this.money=0;
    this.combat=0;
}

///helper functions for cards

player.prototype.chMoney=function(a) //toDo, figure out how to put this in a separate file
{
    //console.log(a)
    console.log("This is executing")
    console.log(this)
    this.money+=a;
}

///individual cards -- shity this is hardcoded, but dunno...

player.prototype.playCopper=function()
{
    this.cardOwner.chMoney(2)
}

player1 = new player(ai='hum', name='tester'); // if I do it like this how do I get it to scope properly

currPlayer=player1;

/// This creation worked!
/*
player1.x=player1["chMoney"];
copper = new card(1,currPlayer,player1.x);
*/

copper = new card(1,currPlayer,player1["playCopper"]);

//console.log("Now global money is "+ money);
console.log("Now player 1's money is "+ player1.money);
console.log("Now currPlayer's money is "+ currPlayer.money);

copper.play()

console.log("Now player 1's money is "+ player1.money);
console.log("Now currPlayer's money is "+ currPlayer.money);
//console.log("Now global money is "+ money);



/*    
    this.cardOwner.chMoney(1);
};
*/



/*
copper = new card(1,player1);

console.log(player1);

console.log(copper);
console.log(copper.price);
console.log(copper.cardOwner);
console.log(copper.effects);

copper.play();

console.log("Now player 1's money is "+ player1.money);
*/
/*
// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x=x;
    this.y=y;
    this.speed=speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+=dt*this.speed
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x=1;
    this.y=1;
    this.xmove=0;
    this.ymove=0;
    //this.sprite = 'images/enemy-bug.png';
    //console.log(this.y)
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(){
    this.x=this.x+this.xmove
    this.y=this.y+this.ymove
    this.xmove=0
    this.ymove=0
};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(direction){
    if (direction==='up'||direction==='w'){
        this.ymove=-50
    }
    if (direction==='down'){
        this.ymove=+50
    }
    if (direction==='left'){
        this.xmove=-50
    }
    if (direction==='right'){
        this.xmove=+50
    }

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
bug = new Enemy(1,1,2);
allEnemies=[bug, new Enemy(500,1,-5)];
player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        87: 'w'

    };

    player.handleInput(allowedKeys[e.keyCode]);
});
*/