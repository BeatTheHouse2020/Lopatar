//script copied from monitoring lopatar on bustabit.
//if you win, you increase cashout by .1
//if you lose then you follow the betting strategy in the lose Matrix trying to recover at 1.25. Skip between a loss until you recover.

//Game Matrix
let winMatrix = [
    [14, 1.35],     //14 BET , 1.35 Payout - GAME #1
    [14, 1.45],     //14 BET , 1.45 Payout - GAME #2
    [14, 1.55],     //14 BET , 1.55 Payout - GAME #3
    [14, 1.65],     //14 BET , 1.65 Payout - GAME #4
    [14, 1.75],     //14 BET , 1.75 Payout - GAME #5
    [14, 1.85],     //14 BET , 1.85 Payout - GAME #6
    [14, 1.95],     //14 BET , 1.95 Payout - GAME #7
    [14, 2.05],     //14 BET , 2.05 Payout - GAME #8
    [14, 2.15],     //14 BET , 2.15 Payout - GAME #9
    [14, 2.25],     //14 BET , 2.25 Payout - GAME #10
    [14, 2.35],     //14 BET , 2.35 Payout - GAME #11
    [14, 2.45],     //14 BET , 2.45 Payout - GAME #12
    [14, 2.55],     //14 BET , 2.55 Payout - GAME #13
    [14, 2.65],     //14 BET , 2.65 Payout - GAME #14
    [14, 2.75],     //14 BET , 2.75 Payout - GAME #15
    [14, 2.85],     //14 BET , 2.85 Payout - GAME #16
    [14, 2.95],     //14 BET , 2.95 Payout - GAME #17
];

//Game Matrix
let loseMatrix = [
    [70, 1.25],     //70 BET , 1.25 Payout - GAME #1
    [0, 1.25],     //SKIP GAME,  IF WE LOST GAME #2
    [350, 1.25],     //350 BET, 1.25 Payout - GAME #3
    [0, 1.25],    //SKIP GAME, IF WE LOST - GAME #4
    [1750, 1.25],    //1750 BET , 1.25 Payout  - GAME #5
    [0, 1.25],    //SKIP GAME IF WE LOST - GAME #6
    [8750, 1.25],    //8750 BET , 1.25 Payout - GAME #7
    [0, 1.25],    //SKIP GAME IF WE LOST  - GAME #8
    [43750, 1.25],    //43750 BET , 1.25 Payout - GAME #9

];

var startingBalance = engine.getBalance()/100;
var currentBet = 0;
var currentGame = 0;
var totalGames = 0;
var cashOut = 0;
var winStreak = true;
var loseStreak = false;

var startingBet = currentBet;


console.log('lopatar script is running for ethercrash.... ');
console.log('Starting Balance: ', startingBalance);


engine.on('game_starting', function(info) {

  totalGames++;
  var currentBet = 0;
  
  var balance = engine.getBalance()/100;

  if(winStreak)
  {
    currentBet = winMatrix[currentGame][0]*100;
    cashOut = winMatrix[currentGame][1];
  }
  else
  {
    currentBet = loseMatrix[currentGame][0]*100;
    cashOut = loseMatrix[currentGame][1];
  }   

 
  if (currentBet/100 > balance) 
  {
    console.log('Game KILLED BET TO BIG');
    engine.stop(); 
          
  }
  else
  {
    if(currentBet != 0)
    {
        engine.placeBet(roundBit(currentBet), cashOut*100);
        console.log('Game #', currentGame, 'PLACE BET: ', roundBit(currentBet)/100, ' Cashout: ',  cashOut, ' User Balance: ', balance);
    }
  }
 

});

engine.on('game_crash', function(data) {

  var balance = engine.getBalance()/100;    
  var wagered = engine.lastGamePlayed();
  var bust = data.game_crash/100;
  var won = engine.lastGamePlay() == "WON";
  
  if (!wagered) 
  {
      console.log('SKIP:', bust);
      
      if(currentGame > 0)
          currentGame++;

      return;    
  }

  var profit =  (balance - startingBalance).toFixed(2);

  if (won) 
  {
      var winAmount = ((currentBet*cashOut) - currentBet) / 100;
      
      console.log('Current Game:', currentGame, 'WON : ', winAmount, ' Bust: ', bust, ', Balance: ', balance, ', Starting Balance: ', startingBalance, ' Profit: ', profit);

      if(loseStreak)
      {
        winStreak = true;
        loseStreak = false;
        currentGame=0;
      }
      else
        currentGame++;
      
  } 
  else 
  {
      console.log('Current Game:', currentGame, 'LOST       : ', currentBet, ' Bust: ', bust, ', Balance: ', balance, ', Starting Balance: ', startingBalance, ' Profit: ', balance - startingBalance);
      if(winStreak)
      {
        loseStreak = true;
        winStreak = false;
        currentGame=0;
      }
      else
        currentGame++;
  }  

  var killScript = false;
  if(winStreak)
  {
     if(currentGame >= winMatrix.length)
      killScript = true;
  } 
  else
  {
     if(currentGame >= loseMatrix.length)
      killScript = true;
  }

   if(killScript)
   {
    console.log('Strategy Failed. Exiting');
    engine.stop(); 
   }
  
});

function roundBit(bet) {
  return Math.round(bet / 100) * 100;
}

