//Variable passed by server
var yourPlayer='Not sent'


//Global world variables -- Eventually have these and the buylist passed in by index.js
var worldActions=5;
var worldHandsize=5;
var startingPoints=0;
var startingWall=5;
var recoveryPoints=0;
var recoveryWall=5; // what points get set back to after a player is attacked past 0.
var buyActionCost=1;
var numGens=3;

var buyList=['copper','merchant','grunt', 'ruin'];
var buyListEachPile=50;
var buyListAmount = {};
for (item in buyList)
{
    buyListAmount[buyList[item]]=buyListEachPile;
}




//
// Log stuff -- TODO: implement sending and receiving between players
//
//

var overallLog=[];
var shortLog=[];
var shortLogMax=20;
for (i=0;i<25;i++){
    shortLog.push('<br/>')
}

note='<br/>'
previousNote='<br/>'

function addToLog(addToLogs){
    //
    // TODO: display the log on the screen
    //
    sendLog(addToLogs);
    overallLog.push(addToLogs);

    if (shortLog.length<shortLogMax){
        shortLog.push(addToLogs);
    }
    else{
        shortLog.splice(0,1);
        shortLog.push(addToLogs);
    }

    htmlstring=""
    for (itemzzz in shortLog)
    {
        htmlstring+=shortLog[itemzzz]+"<br/>"
    }
    document.getElementById("short_log").innerHTML = htmlstring;


    if (note===previousNote){
        document.getElementById("notifications").innerHTML = '<br/>';

    }
    previousNote=note;
    //console.log('Sending logs to opponent is not implemented yet');
};

function addFromOpponent(addToLogs){ //another function so it won't send back and forth forever
    if (shortLog.length<shortLogMax){
        shortLog.push(addToLogs);
    }
    else{
        shortLog.splice(0,1);
        shortLog.push(addToLogs);
    }

    htmlstring=""
    for (item in shortLog)
    {
        htmlstring+=shortLog[item]+"<br/>"
    }
    document.getElementById("short_log").innerHTML = htmlstring;


}

function sendLog(log){
    var socket = io();
    socket.emit('send log', log);
}

function addNotification(notification){
    //
    // ToDO implement Notification
    // Have this print red text HTML below the short log
    // and make some sort of beeping noise
    // update it's display then erase it, so it disappears with next update.
    document.getElementById("notifications").innerHTML = notification;
    note=notification
    //console.log('would send the notification:'+notification+' but notifications are not implemented yet');
};

//
// Card functions
//
//

function fromHandPlay(cardToPlay)
{
    currPlayer.hand[cardToPlay].play();
    updateOverall();
};

aaa=''
bbb=''
ccc=''
ddd=''

function replaceGen(a, b, c){
    //If you give this functionality to replace the generator of another player, you will need to modify fromHandgen to send player
    i=0;
    var newCardIndex=a[0]
    var oldCard=a[1]
    var oldCardPile=a[2]

    aaa=a;
    bbb=b;
    ccc=c;


    for (item in currPlayer[oldCardPile])
    {
        console.log("item is: "+item)
        if (currPlayer[oldCardPile][item].name===oldCard&&i===0)
        {
            i=1;
            addToLog(currPlayer.name+' replaces generator '+currPlayer[oldCardPile][item].name);  // i gues addToLog uses item and that's messing this up
            console.log(currPlayer[oldCardPile]);
            currPlayer[oldCardPile].splice(item, 1);
            console.log("item is: "+item)
            console.log(currPlayer[oldCardPile]);
            currPlayer.hand[newCardIndex].generate();
            console.log(currPlayer[oldCardPile]);
        }
    }
}

function fromHandGen(cardToPlay)
{
    if (currPlayer.inactGen.length+currPlayer.actGen.length+currPlayer.usedGen.length+currPlayer.justPlayedGen.length<numGens){
    currPlayer.hand[cardToPlay].generate();
    updateOverall();
    }
    else if(currPlayer.inactGen.length+currPlayer.actGen.length>1){
        buttonlist=[];
        xxx=cardToPlay
        for (item in currPlayer.inactGen){
            buttonlist.push([currPlayer.inactGen[item].name+" - inactive",["replaceGen",[cardToPlay,currPlayer.inactGen[item].name,"inactGen"]]]);
        }
        for (item in currPlayer.actGen){
            buttonlist.push([currPlayer.actGen[item].name+" - active",["replaceGen",[cardToPlay,currPlayer.actGen[item].name,"actGen"]]]);
        }

        //each button becomes["cardname-pile",["replaceGen",[card,pile]]]
        //button list has to become interruptPrompt([["Attack",["attack",[]]],["Hunt",["hunt",[]]]])

        interruptPrompt(buttonlist)
        
    }
    else if(currPlayer.inactGen.length+currPlayer.actGen.length===1){
        if (currPlayer.inactGen.length===1){
            addToLog(currPlayer.name+' replaces generator '+currPlayer.inactGen.pop().name);
            
            currPlayer.hand[cardToPlay].generate();
            updateOverall();
        }
        else{
            addToLog(currPlayer.name+' replaces generator '+currPlayer.actGen.pop().name);
            currPlayer.hand[cardToPlay].generate();
            updateOverall();

        }
    }
    else{
        addNotification('You have reached the generator limit. New generators'
            + 'can only be placed on top of inactive or active generators,'
            + 'but not generators placed this turn');
    }

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


var card = function(name,description,price,effect){ 
    this.name=name
    name=name
    this.description=description
    this.price=price;
    this.effects=effect
                        // array of arrays -- each element of the array contains an array
                        // where the first element is a function and the second is an array
                        // that is passed as its parameters.
};

card.prototype.play=function(){ //play a card from the hand
    for (item in this.effects){
        window[this.effects[item][0]](this.effects[item][1]) //calls the effects from the card 
    }



    currPlayer.inPlay.push(this);
    currPlayer.hand.remove(this);
    addToLog(currPlayer.name+' played '+this.name+' from hand');
};



card.prototype.playGen=function(){ //play a card from the generators pile
    for (item in this.effects){
        window[this.effects[item][0]](this.effects[item][1],"gen"); //calls the effects from the card.
    }
    genEffects(this.name) //any additional effects the card has only when played as generator
    

    currPlayer.usedGen.push(this);
    currPlayer.actGen.remove(this);
    addToLog(currPlayer.name+' played '+card.name+' from generator');
    updateOverall();
};

card.prototype.generate=function(){ //todo -- if justplayed, inactive, active == maxGen, remove a card
    if (currPlayer.actions>=currPlayer.generateCost)
    {
        currPlayer.justPlayedGen.push(this);
        currPlayer.hand.remove(this);
        currPlayer.actions-=currPlayer.generateCost;
        addToLog(currPlayer.name+' played a card face down as generator');
        updateOverall();
    }
    else
    {
        addNotification("Not enough action(s) to generate "+this.name);
    }
};

card.prototype.activate=function(){

    if (currPlayer.actions>=currPlayer.activateCost)
    {
        currPlayer.actGen.push(this)
        currPlayer.inactGen.remove(this)
    
    currPlayer.actions-=currPlayer.activateCost;
    updateOverall();

    addToLog(currPlayer.name+' activated '+this.name+' as a generator')

    }
    else
    {
        addNotification("Not enough action(s) to activate "+this.name)
    }
};

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
    this.wall=startingWall;
    

    //The following will also be reset every turn
    
    this.actions=worldActions;
    this.money=0;
    this.combat=0;
    this.generateCost=1;
    this.activateCost=1;
    this.buyActionCost=buyActionCost; //
};

var draw=function(player){ // this is called in start turn and can also be called by cards

    if (player==="currPlayer"){
        player=currPlayer;
    }
    if (player.deck.length>0){
        player.hand.push(player.deck.pop());
        addToLog(player.name+ " draws a card");
    }
    else if (player.discard.length>0){
        scrapPile("discard","deck");
        shuffle(player.deck);
        addToLog(player.name+ " shuffles");
        player.hand.push(player.deck.pop());
        addToLog(player.name+ " draws a card");
    }
    else{
        addToLog(player.name+ " attempted to draw, but there were no cards to draw.");
        addNotification("There are no cards to draw");
    }
};

var actionDraw=function(player){
    if (player.actions>0){ // TODO: Limit action draws to 1 per turn?
        player.actions--;
        draw(player);
        updateOverall();
        addToLog(player.name+ " spends an action to draw a card");

    }

    else{
        addNotification("You don't have the action to draw an additional card.");
    }
}

var shuffle=function(array){
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



var addCard=function(name,description,cost,effects,playerPile,free,costModifier){
    costModifier=0
    actionModifier=0
    if (free){
        costModifier=cost
        actionModifier=currPlayer.buyActionCost
        }

    if (currPlayer.actions>=currPlayer.buyActionCost-actionModifier){
        if (buyListAmount[name]>0){
            if (currPlayer.money>=cost-costModifier){
                currCard = new card(name,description,cost,effects);
                playerPile.push(currCard);
                buyListAmount[name]--
                currPlayer.money-=(cost-costModifier)
                currPlayer.actions-=currPlayer.buyActionCost-actionModifier
                addToLog(currPlayer.name+" acquires "+currCard.name)
            }
            else{
                addNotification('Not enough $ to purchase '+name);
            }
        }
        else{
        addToLog('Cannot add '+name+' to ' + playerPile+ " that card's deck is exhausted"); // think this is good to add to log and to give players as a notification
        addNotification('Cannot add '+name+'to ' + playerPile+ " that card's deck is exhausted"); //
        }
    }
    else{
        addNotification('Not enough actions to buy!');
    }
    updateOverall();
};

var addCardAfterTransfer=function(name,description,cost,effects,playerPile){
                currCard = new card(name,description,cost,effects);
                playerPile.push(currCard);
};

///
/// Turn order stuff
///
///


var startGame=function(){
    for (item in players){
        currPlayer=players[item];

        //build deck
        for (i=1;i<=4;i++)
        {
            addCard('copper','adds 1$',1,[ ["chMoney",["currPlayer",1]]],currPlayer.deck,'free');
        }

        
        drawFullHand();
    }
    currPlayer = players[0]
    //generateBuyButtons();

};


var drawFullHand = function(){
    
    for (i=1;i<=worldHandsize;i++)
    {
        draw(currPlayer);
    }
    
}

var scrapPile = function(pile1, pile2){
    lenghth=currPlayer[pile1]
    for (item in currPlayer[pile1])
    {
        currPlayer[pile2].push(currPlayer[pile1][item]) // pop from the back?
    }
    currPlayer[pile1]=[]
}

var combat=function(){
    if (currPlayer.combat<=0)
    {
        endTurn();
        kkk=currPlayer
        socket.emit('end turn', player1);
        lll=currPlayer
        startTurn();
    }
    else
    {
        
        interruptPrompt([["Attack",["attack",[]]],["Hunt",["hunt",[]]]]); //TODO: 
                                 // e.g. interruptPrompt([["button1",["function1",[params]],["Hunt","hunt"]])
    }

}

var attack=function(){
        enemy=returnEnemy(); //TODO: add walls in addition to points
        enemy.wall-=currPlayer.combat;
        if (enemy.wall<0){
            enemy.points+=enemy.wall;
            enemy.wall=0;
        }
        addToLog(currPlayer.name+' attacked '+enemy.name+' for '+currPlayer.combat+ ' damage, bringing '+ enemy.name+' to '+enemy.wall+' wall and '+enemy.points+' points');
        if (enemy.points < 0){
           addCard('ruin',this.description,this.cost,[ ["chCombat",[currPlayer,0]]],enemy.discard,"free"); // add a ruin to players that drop below 0
           enemy.points=recoveryPoints;
           enemy.wall=recoveryWall;
           addToLog(enemy.name+' recovers back to '+enemy.points+' points');
        }
    currPlayer.combat=0;
    combat();
}

function returnEnemy(){
    for (item in players) {
        if (currPlayer!=players[item]){
            return players[item]   
        }

    }
}

var hunt=function(){
    currPlayer.points+=currPlayer.combat
    addToLog(currPlayer.name+' hunted for '+currPlayer.combat+' bringing them to'+currPlayer.points+'points')
    currPlayer.combat=0;
    combat();
}


var startTurn=function(){
    if(currPlayer===player1){
        currPlayer=player2
    }
    else{
        currPlayer=player1
    }
    if (currPlayer.playerOrd===yourPlayer){
        disableButtons=0
    }
    else{
        disableButtons=3
    }

    currPlayer.actions=worldActions;
    if(yourPlayer===currPlayer.playerOrd){
        addToLog("<b>"+currPlayer.name+" begins their turn.</b>")
        addNotification("It's now your turn!")
    }
    else{
        console.log("It's your opponent's turn.")
    }

    updateOverall();
}

var endTurn=function()
{
    addToLog(currPlayer.name+' ends their turn.')
    //generateCombatButtons("remove");
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
    //generateHandButtons("fake"); //TODO: need to change this and make a system that makes sense for only displaying
                                 // each users buttons at the appropriate times
                                 // need to keep this after updateOverall
    
    //startTurn();
}

var showWorldState = function(){ /// function used by button for debugging
    toDisplay=["deck","hand","discard","inPlay", "justPlayedGen", "inactGen", "actGen", "usedGen"] //piles you want logged
    for (item in toDisplay){
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

var yourPlayerPlayer
var previousNotifications=""
function updateOverall(fromOpponent) //this should be used to update all of the GUI for both players
{
    if (yourPlayerPlayer){
        generateGenerateButtons();
        generateHandButtons();
        generateBuyButtons();
        updateState();
        if(!fromOpponent){ //to stop it from sending back and forth
            sendOverall();
        }
    }

    //updateLog();

    //***
    //updateNotifications();

};

function sendOverall()
{
    var socket = io();
    overall=[player1, player2, buyListAmount]; // TODO: add achievements to this once they are implemented
    socket.emit('send overall', overall);
    console.log('attempting to send overall');
    console.log('overall[0]: '+overall[0]);
    console.log(overall[0]);
    //console.log(overall[0].hand)
}

function notYourTurn()
{
    addNotification("Not Your Turn");
}


////
//// Start the Game already
////

var player1 = new player(ai='hum', name='tester1'); // TODO: eventually player names will eventually get passed by the game managing system
var player2 = new player(ai='hum', name='tester2'); //
player1.playerOrd='player1' //not sure why adding them through the function wasn't working... weird
player2.playerOrd='player2'
var players = [player1,player2];
var currPlayer = players[0];



var disableButtons=0;
startGame(); 
//startTurn();
showWorldState();




///
/// Buttons
///
///



function updateState()
{
    for (item in players){
        if (yourPlayer===players[item].playerOrd){
            htmlstring="<b>"+players[item].name+"</b><br/>"   
            htmlstring+="$: "+players[item].money+"<br/>"
            htmlstring+="⚔: "+players[item].combat+"<br/>"
            htmlstring+="Wall:"+players[item].wall+"<br/>"
            htmlstring+="Points:"+players[item].points+"<br/>"
            htmlstring+="Acts: "+players[item].actions+"<br/>"
            htmlstring+="<br/>"
            htmlstring+="Discard: "+players[item].discard.length+"<br/>"
            htmlstring+="Deck: "+players[item].deck.length+"<br/>"
            htmlstring+="Hand: "+players[item].hand.length+"<br/>"
            //htmlstring+="<button onclick=actionDraw(playerList[item])>1 act: Draw</button><br/>"
            document.getElementById("your_state").innerHTML = htmlstring;
        }
        else{
            htmlstring="<b>"+players[item].name+"</b><br/>"  
            htmlstring+="$: "+players[item].money+"<br/>"
            htmlstring+="⚔: "+players[item].combat+"<br/>"
            htmlstring+="Wall:"+players[item].wall+"<br/>"
            htmlstring+="Points:"+players[item].points+"<br/>"
            htmlstring+="Acts: "+players[item].actions+"<br/>"
            htmlstring+="<br/>"
            htmlstring+="Discard: "+players[item].discard.length+"<br/>"
            htmlstring+="Deck: "+players[item].deck.length+"<br/>"
            htmlstring+="Hand: "+players[item].hand.length+"<br/>"
            document.getElementById("enemy_state").innerHTML = htmlstring;
        }
    }
    
};



function interruptPrompt(choices){//and send in an array of arrays where the
                                 // inner array is button name and function
                                 // e.g. interruptPrompt([["Attack",["attack",[params]]],["Hunt",["hunt",[params]]])
    
    disableButtons=1;
    updateOverall();
    htmlstring=""; //need to keep this after the updateOverall or it will also display the last string.

    for (item in choices){
        buttonName=choices[item][0]
        funk=choices[item][1][0];
        params=choices[item][1][1];
        //console.log(choices[item][1])
        paramstoString=""
        for (item in params){
            paramstoString+="'"+params[item]+"'"
            if (item<params.length-1){
               paramstoString+="," 
            }
        }

        if (params.length>0){
        htmlstring+="<button onclick=resumeFromInterrupt("+funk+",["+paramstoString+"])>"+buttonName+"</button>"
        }
        else{
        htmlstring+="<button onclick=resumeFromInterrupt("+funk+")>"+buttonName+"</button>"
        }
    }
    document.getElementById("decisions").innerHTML = htmlstring;
}

function resumeFromInterrupt(funk, params){
    htmlstring=""
    document.getElementById("decisions").innerHTML = htmlstring;
    zzz=funk
    funk(params); // TODO: very confused about why this is function -- thought I was passing string
    if(yourPlayer===currPlayer.playerOrd){
        disableButtons=0;
    }
    updateOverall();
    //socket.emit('end turn', player1);
    //startTurn();
}


function generateBuyButtons(){
    htmlstring="Buy cards by paying 1 action and the card's price:<br/>";

    insertString=""
    if (disableButtons){
        insertString="disabled"
    }

    for (item in buyListAmount){
        temp=window["buy_"+item]('lookup'); //stupid way of getting price and description
       
        description=temp[0];
        cost=temp[1];

        htmlstring+="<button onclick=buy_"+item+"() "+insertString+">"+item+" - "+description+"<br/> price: "+cost+"<br/>"+buyListAmount[item]+"/"+buyListEachPile+"</button>"
    }
    document.getElementById("buy_cards").innerHTML = htmlstring;
}

function generateGenerateButtons(){
    htmlstring="Generators:";

    insertString=""
    if (disableButtons){
        insertString="disabled"
    }

    for (item in yourPlayerPlayer.justPlayedGen){
        htmlstring+="<button onclick=notYourTurn() disabled>?</button>"
    }
    for (item in yourPlayerPlayer.inactGen){
        htmlstring+="<button onclick=fromGenAct("+item+") "+insertString+">?</button>"
    }
    for (item in yourPlayerPlayer.actGen){
        htmlstring+="<button onclick=fromGenPlay("+item+") "+insertString+">"+yourPlayerPlayer.actGen[item].name+"</button>"
    }
    for (item in yourPlayerPlayer.usedGen){
        htmlstring+="<button onclick=playGen(yourPlayerPlayer.actGen[item]) disabled>"+yourPlayerPlayer.usedGen[item].name+"</button>"
    }
    document.getElementById("generators").innerHTML = htmlstring;
}

function generateHandButtons(fake){
    htmlstring="Hand:<br/><table><tr><td>play:</td>";

    insertString=""
    if (disableButtons){
        insertString="disabled"
    }

    for (item in yourPlayerPlayer.hand)
    {
        htmlstring+="<td><button onclick=fromHandPlay("+item+") "+insertString+">"+yourPlayerPlayer.hand[item].name+"</button></td>"
    }
    htmlstring+="</tr><tr><td>generate:</td>";
    for (item in yourPlayerPlayer.hand)
    {
        htmlstring+="<td><button onclick=fromHandGen("+item+") "+insertString+">gen</button></td>"
    }
    htmlstring+="</tr></table>";
    document.getElementById("hand").innerHTML = htmlstring;
};













