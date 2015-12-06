///
///helper functions for cards
///

var action=function(playerActionsNewAction)
{

    //Merchant code: [ ["action",["currPlayer",1,[chMoney,["currPlayer",3]]]] ]
    
    player=playerActionsNewAction[0];
    if (player==="currPlayer")
    {
        player=currPlayer
    }

    actionsRequired=playerActionsNewAction[1];
    newActionToDo=playerActionsNewAction[2];
    if (player.actions>=actionsRequired)
    {
        player.actions-=actionsRequired;
        console.log(newActionToDo)
        console.log(newActionToDo[0])

        if (player==="currPlayer")
        {
        player=currPlayer
        }

        console.log(newActionToDo[1])
        window[newActionToDo[0]](newActionToDo[1]);
    }
    else
    {
        console.log("Not enough actions, action effects will not occur")
    }
}

var chMoney=function(playerAndAmount) //toDo, figure out how to put this in a separate file
{
    //console.log(playerAndAmount)
    //console.log(playerAndAmount[0])
    //console.log(playerAndAmount[1])
    player=playerAndAmount[0]
    if (player==="currPlayer")
    {
        player=currPlayer
    }
    amount=playerAndAmount[1]
    player.money+=amount; //because is called by player or a card's 'cardowner'

    console.log('playerAndAmount')
    //console.log(gent)

    //if(gent){
    //    console.log("played as generator")
    //}
}

var chCombat=function(playerAndAmount) //toDo, figure out how to put this in a separate file
{
    //console.log(playerAndAmount)
    //console.log(playerAndAmount[0])
    //console.log(playerAndAmount[1])
    
    player=playerAndAmount[0]
    if (player==="currPlayer")
    {
        player=currPlayer
    }

    amount=playerAndAmount[1]
    player.combat+=amount; //because is called by player or a card's 'cardowner'
}

function genEffects(cardName){
    if (cardName=='copper') // remove this later --- proof of principle
    {
        console.log('played copper as a generator')
    }
}