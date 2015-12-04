

console.log("Hello World")
//Global world variables
var worldActions=3;
var worldHandsize=5;
var startingPoints=5;
var buyActionCost=1;




//make this a pile object (that contains a list of cards, but other methods like shuffle, etc.) 

//import sugar.js


//This card object will be different than object of cards to buy.
var card = function(name,description,price,effect){ 
    this.name=name
    this.description=description
    this.price=price; //how much it costs to purchase (in case other cards refer to it?)
    //this.cardOwner=cardOwner; //player object
    console.log("Trying to create a card with the effect: "+ effect)
    this.effects=effect
    

}

card.prototype.play=function(){

    for (item in this.effects){


        window[this.effects[item][0]](this.effects[item][1]) //calls the effects from the card.
    }

    currPlayer.inPlay.push(this)
    currPlayer.hand.remove(this)

}

card.prototype.playGen=function(){

    for (item in this.effects){


        window[this.effects[item][0]](this.effects[item][1]) //calls the effects from the card.
    }

    currPlayer.usedGen.push(this)
    currPlayer.actGen.remove(this)
    updateOverall();


}


card.prototype.generate=function(){ //todo -- if justplayed, inactive, active == maxGen, remove a card

    if (currPlayer.actions>=currPlayer.generateCost)
    {
        currPlayer.justPlayedGen.push(this)
        currPlayer.hand.remove(this)
    
    currPlayer.actions-=currPlayer.generateCost;
    updateOverall();
    }
    else
    {
        console.log("Not enough action(s) to generate "+this.name)
    }
}

card.prototype.activate=function(){

    if (currPlayer.actions>=currPlayer.activateCost)
    {
        currPlayer.actGen.push(this)
        currPlayer.inactGen.remove(this)
    
    currPlayer.actions-=currPlayer.activateCost;
    updateOverall();

    }
    else
    {
        console.log("Not enough action(s) to activate "+this.name)
    }
}

var player = function(ai, name){
    this.ai=ai;
    this.name=name;
    this.achievements=[];
    this.hand=[];  
    this.deck=[];
    this.discard=[];  
    this.inPlay=[];
    this.justPlayedGen=[]; 
    this.inactGen=[];
    this.actGen=[];
    this.usedGen=[];
    this.points=startingPoints;

    //The following will be initialized and done every turn
    
    this.actions=worldActions;
    this.money=0;
    this.combat=0;
    this.generateCost=1;
    this.activateCost=1;
    this.buyActionCost=buyActionCost; //
}

////
//// This stuff strictly for testing scoket.io
////
////


var player3 = {
    ai:'hum',
    name:'ben',
    achievements:[],
    hand:[], 
    deck:[],
    discard:[],  
    inPlay:[],
    justPlayedGen:[], 
    inactGen:[],
    actGen:[],
    usedGen:[],
    points:startingPoints,

    //The following will be initialized and done every turn
    
    actions:worldActions,
    money:0,
    combat:0,
    generateCost:1,
    activateCost:1,
    buyActionCost:buyActionCost //
}

copper2 = new card('copper','+$1',1,[ ["chMoney",[currPlayer,1]]])

player3.hand.push(copper2)


///
/// 
///
///
///


 



var draw=function(player) //toDo, figure out how to put this in a separate file
{
    if (player==="currPlayer")
    {
        player=currPlayer
    }
    if (player.deck.length>0)
    {
        player.hand.push(player.deck.pop())
    }

    else if (player.discard.length>0)
    {
        scrapPile("discard","deck")
        shuffle(player.deck)
        player.hand.push(player.deck.pop())
    }

    else
    {
        console.log("There are no cards to draw")
    }
}

var actionDraw=function(player)
{
    if (player.actions>0)
    {
        player.actions--;
        draw(player)
        updateOverall()
    }

    else
    {
        console.log("You don't have the action to draw an additional card")
    }
}

var shuffle=function(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex)
  {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


///
///functions for creating cards, these will be linked to from the player's buttons - buttons will also check
/// that the player has enough money to execute purchase
///



var addCard=function(name,description,cost,effects,playerPile,free,costModifier)
{
    //this.name=name
    //this.description=description
    //this.cost=cost
    console.log(name)
    costModifier=0
    actionModifier=0
    if (free)
        {
        costModifier=cost
        actionModifier=currPlayer.buyActionCost
        }

    if (currPlayer.actions>=currPlayer.buyActionCost-actionModifier)
    {
        if (buyListAmount[name]>0)
        {
            if (currPlayer.money>=cost-costModifier)
            {
                currCard = new card(name,description,cost,effects);
                playerPile.push(currCard);
                buyListAmount[name]--
                currPlayer.money-=(cost-costModifier)
                currPlayer.actions-=currPlayer.buyActionCost-actionModifier
            }
            else
            {
                console.log('Not enough $ to purchase '+name);
            }
        }
        else
        {
        console.log('Could not add a '+name+' to ' + playerPile+ " that card's deck is exhausted");
        }
    }
    else
    {
        console.log('Not enough actions to buy!');
    }
    updateOverall();
}







var startGame=function()
{
    for (item in players)
    {
        currPlayer=players[item];

        //build deck
        for (i=1;i<=4;i++)
        {
            addCard('copper','adds 1$',1,[ ["chMoney",["currPlayer",1]]],currPlayer.deck,'free');
        }

        
        drawFullHand();
        currPlayer.enemyList=[]
        for (item in players)
        {
            if (currPlayer!=players[item])
            {
                currPlayer.enemyList.push(players[item])
            }
        }

    }



    


};

var drawFullHand = function()
{
    
    for (i=1;i<=worldHandsize;i++)
    {
        draw(currPlayer);
    }
    
}

var scrapPile = function(pile1, pile2)
{
    lenghth=currPlayer[pile1]
    for (item in currPlayer[pile1])
    {
        currPlayer[pile2].push(currPlayer[pile1][item]) // pop from the back?
    }
    currPlayer[pile1]=[]
}

var combat=function()
{
    if (currPlayer.combat<=0)
    {
        endTurn();
    }
    else
    {
        generateCombatButtons();
    }

}

var attack=function()
{
    console.log("????"+currPlayer.enemyList);
    for (xyz in currPlayer.enemyList) // changed from item to xyz -- watch out about this in future with nested for loops -- different scoping than python
    {
        console.log("????"+currPlayer.enemyList[xyz].points);
        currPlayer.enemyList[xyz].points-=currPlayer.combat
        if (currPlayer.enemyList[xyz].points <= 0)
        {
            console.log("????"+currPlayer.enemyList[xyz].points);
            
            addCard('ruin',this.description,this.cost,[ ["chCombat",[currPlayer,0]]],currPlayer.enemyList[xyz].discard,"free"); // add a ruin to players that drop below 0
            //console.log("????"+currPlayer.name);
            //console.log("????"+currPlayer.enemyList);
            currPlayer.enemyList[xyz].points=startingPoints;
            
            
        }
    }
    endTurn();
}

var hunt=function()
{
    
    currPlayer.points+=currPlayer.combat
   
    endTurn();
}


var startTurn=function()
{
    //console.log('generating handButtons')
    //generateHandButtons();
    currPlayer.actions=worldActions;
    updateOverall();
}

var endTurn=function()
{
    generateCombatButtons("remove");
    currPlayer.actions=0;
    currPlayer.money=0;
    currPlayer.combat=0;
    currPlayer.generateCost=1;
    currPlayer.activateCost=1;
    scrapPile("hand", "discard");
    scrapPile("inPlay", "discard");
    scrapPile("justPlayedGen", "inactGen");
    scrapPile("usedGen", "actGen");
    drawFullHand();
    updateOverall();
    generateHandButtons("fake"); // need to keep this after updateOverall
    //console.log(canYouSeeThis)

    if (players.length>1)
    {
        index=0
        for (item in players)
        {
            if (currPlayer==players[item])
            {
                index=item;
            }

        }
        if (index<players.length-1)
        {
            index++;
            currPlayer=players[index++];
            console.log(index++);
            console.log(players[index++]);
            console.log('incrementing index by 1');

        }
        else
        {
            currPlayer=players[0]
            console.log('end of index so resseting')
        }
    }

}

var showWorldState = function()
{
    toDisplay=["deck","hand","discard","inPlay", "justPlayedGen", "inactGen", "actGen", "usedGen"] //piles you want logged

    for (item in toDisplay)
    {
        
            cardList=[];

            for (item2 in currPlayer[toDisplay[item]])
            {
                cardList.push(" "+currPlayer[toDisplay[item]][item2].name);
            }
            console.log(currPlayer.name+"'s "+toDisplay[item]+" is"+cardList);
    }
    console.log(currPlayer.name+"'s money is "+ currPlayer.money);
    console.log(currPlayer.name+"'s combat is "+ currPlayer.combat);
    console.log(currPlayer.name+"'s actions are "+ currPlayer.actions);
}

var player1 = new player(ai='hum', name='tester1');
var player2 = new player(ai='hum', name='tester2');
var players = [player1,player2];
var currPlayer = players[0];

var buyList=['copper','merchant','grunt', 'ruin'];
var buyListEachPile=20;
var buyListAmount = {};

for (item in buyList)
{
    buyListAmount[buyList[item]]=buyListEachPile;
}



generateBuyButtons();

function generateCombatButtons(remove)
{
    if (!remove) // if a remove string isn't passed make the buttons
    {
    htmlstring="<button onclick=attack()>Attack</button><button onclick=hunt()>Hunt</button>"
    document.getElementById(currPlayer.name+"_combat").innerHTML = htmlstring;
    }
    else // else remove the buttons
    {
        document.getElementById(currPlayer.name+"_combat").innerHTML = "";
    }
}


function generateBuyButtons()
{
    htmlstring="Buy cards by paying 1 action and the card's price:<br/>";
    for (item in buyListAmount)
    {
        temp=window["buy_"+item]('lookup');
       
        description=temp[0];
        cost=temp[1];
        //console.log(temp)
        //console.log(window["buy_"+item].getDescription())
        //console.log(buy_copper.getDescription())
        htmlstring+="<button onclick=buy_"+item+"()>"+item+" - "+description+"<br/> price: "+cost+"<br/>"+buyListAmount[item]+"/"+buyListEachPile+"</button>"
    }

    console.log(document)
    console.log(document.getElementById(currPlayer.name+"_buyButtons"))
    document.getElementById(currPlayer.name+"_buyButtons").innerHTML = htmlstring;
}

function generateGenerateButtons()
{
    htmlstring="Generators:";
    for (item in currPlayer.justPlayedGen)
    {
        htmlstring+="<button onclick=notYourTurn() disabled>?</button>"
    }

    for (item in currPlayer.inactGen)
    {
        //htmlstring+="<button onclick=activate(currPlayer.inactGen[item])>?</button>"
        htmlstring+="<button onclick=fromGenAct("+item+")>?</button>"
    }

    for (item in currPlayer.actGen)
    {
        htmlstring+="<button onclick=fromGenPlay("+item+")>"+currPlayer.actGen[item].name+"</button>"
    }

    for (item in currPlayer.usedGen)
    {
        htmlstring+="<button onclick=playGen(currPlayer.actGen[item]) disabled>"+currPlayer.usedGen[item].name+"</button>"
    }



    document.getElementById(currPlayer.name+"_generatorButtons").innerHTML = htmlstring;
}

function generateHandButtons(fake)
{
    htmlstring="Hand:<br/><table><tr><td>play:</td>";
    for (item in currPlayer.hand)
    {
        if (!fake)
        {
            htmlstring+="<td><button onclick=fromHandPlay("+item+")>"+currPlayer.hand[item].name+"</button></td>"
        }
        else
        {
            htmlstring+="<td><button onclick=notYourTurn() disabled>"+currPlayer.hand[item].name+"</button></td>"
        }
    }
    htmlstring+="</tr><tr><td>generate:</td>";
    for (item in currPlayer.hand)
    {
        if (!fake)
        {
            htmlstring+="<td><button onclick=fromHandGen("+item+")>gen</button></td>"
        }
        else
        {
            htmlstring+="<td><button onclick=notYourTurn() disabled>gen</button></td>"
        }
    }
    htmlstring+="</tr></table>";

    console.log("htmlstring")
    console.log(document)
    console.log(document.getElementById("handButtons"))
    document.getElementById(currPlayer.name+"_handButtons").innerHTML = htmlstring;
};

function notYourTurn()
{
    console.log("Not Your Turn")
}

function fromHandPlay(cardToPlay)
{
    currPlayer.hand[cardToPlay].play();
    updateOverall();
};

function fromHandGen(cardToPlay)
{
    currPlayer.hand[cardToPlay].generate();
    updateOverall();
};

function fromGenPlay(cardToPlay)
{
    currPlayer.actGen[cardToPlay].playGen();
    updateOverall();
};

function fromGenAct(cardToPlay)
{
    currPlayer.inactGen[cardToPlay].activate();
    updateOverall();
};


function updateState()
{
    htmlstring="$: "+currPlayer.money+"<br/>"
    htmlstring+="⚔: "+currPlayer.combat+"<br/>"
    htmlstring+="Points:"+currPlayer.points+"<br/>"
    htmlstring+="Acts: "+currPlayer.actions+"<br/>"
    htmlstring+="<br/>"
    htmlstring+="Discard: "+currPlayer.discard.length+"<br/>"
    htmlstring+="Deck: "+currPlayer.deck.length+"<br/>"
    htmlstring+="<button onclick=actionDraw(currPlayer)>1 act: Draw</button><br/>"
    htmlstring+=currPlayer.actions

    document.getElementById(currPlayer.name+"_currentState").innerHTML = htmlstring;
};

function updateOverall()
{

    generateGenerateButtons();
    generateHandButtons();
    generateBuyButtons();
    updateState();
};
//toBuy=[[addCopper,1,10]]


///Testing stack, make sure old commands all work as I make modifications







startGame(); 
startTurn();
showWorldState();
/*
for (i=1;i<=worldHandsize-1;i++)
        {
            console.log("Attempting to play: ",currPlayer.hand[0])
            currPlayer.hand[0].play();
        }
showWorldState();
endTurn();
showWorldState();
startTurn();
showWorldState();
currPlayer.hand[0].generate();
currPlayer.hand[0].generate();
currPlayer.hand[0].generate();
currPlayer.hand[0].generate();
currPlayer.hand[0].generate();
endTurn();
showWorldState();
startTurn();
currPlayer.inactGen[0].activate();
showWorldState();
currPlayer.actGen[0].playGen();
showWorldState();
endTurn();

startTurn();
showWorldState();
//addMerchant(player1.hand);
addCard('merchant','1 action: adds $3',3,[ ["action",[currPlayer,1,["chMoney",[currPlayer,3]]]] ],currPlayer.hand,'free')

//currPlayer.hand[0].play();
//currPlayer.hand[0].play();

actionDraw(currPlayer);
actionDraw(currPlayer);
actionDraw(currPlayer);
currPlayer.actGen[0].playGen();
showWorldState();
*/