var buy_copper=function(lookup)
{
    this.description='+$1'
    this.cost=1
    if (lookup)
    {
        return [this.description, this.cost]
    }
    
        addCard('copper',this.description,this.cost,[ ["chMoney",["currPlayer",1]]],currPlayer.discard);
    //add the cost stuff in addCard
    
    
}

var buy_merchant=function(lookup)
{
    this.description='1 act:+$3'
    this.cost=3
    if (lookup)
    {
        return [this.description, this.cost]
    }
    else
    {
        addCard('merchant',this.description,this.cost,[ ["action",["currPlayer",1,["chMoney",["currPlayer",3]]]] ],currPlayer.discard); //pass the inner action as a string because it's dynamically calling it
    }

    //addCard('merchant','1 action: adds $3',3,[ ["action",[currPlayer,1,["chMoney",[currPlayer,3]]]] ],currPlayer.hand)
}

var buy_grunt=function(lookup)
{
    this.description='+2⚔'
    this.cost=2
    if (lookup)
    {
        return [this.description, this.cost]
    }
    else
    {
        addCard('grunt',this.description,this.cost,[ ["chCombat",["currPlayer",2]]],currPlayer.discard);
    }

    //addCard('merchant','1 action: adds $3',3,[ ["action",[currPlayer,1,["chMoney",[currPlayer,3]]]] ],currPlayer.hand)
}

var buy_ruin=function(lookup)
{
    this.description='No effect'
    this.cost=0
    if (lookup)
    {
        return [this.description, this.cost]
    }
    else
    {
        addCard('ruin',this.description,this.cost,[ ["chCombat",["currPlayer",0]]],currPlayer.discard);
    }

    //addCard('merchant','1 action: adds $3',3,[ ["action",[currPlayer,1,["chMoney",[currPlayer,3]]]] ],currPlayer.hand)
}