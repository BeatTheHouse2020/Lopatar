var config = {

};


//Game Matrix
let winMatrix = [
    [14, 1.35],     //100 BET , 1.3 Payout - GAME #1
    [14, 1.45],     //600 BET , 1.3 Payout - GAME #2
    [14, 1.55],     //100 BET , 1.3 Payout - GAME #1
    [14, 1.65],     //600 BET , 1.3 Payout - GAME #2
    [14, 1.75],     //100 BET , 1.3 Payout - GAME #1
    [14, 1.85],     //600 BET , 1.3 Payout - GAME #2
    [14, 1.95],     //100 BET , 1.3 Payout - GAME #1
    [14, 2.05],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.15],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.25],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.35],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.45],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.55],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.65],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.75],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.85],     //600 BET , 1.3 Payout - GAME #2
    [14, 2.95],     //600 BET , 1.3 Payout - GAME #2
];

//Game Matrix
let loseMatrix = [
    [70, 1.25],     //100 BET , 1.3 Payout - GAME #1
    [0, 1.25],     //600 BET , 1.3 Payout - GAME #2
    [350, 1.25],     //600 BET , 1.3 Payout - GAME #2
    [0, 1.25],    //1800 BET , 1.5 Payout - GAME #3
    [1750, 1.25],    //6000 BET , 1.5 Payout  - GAME #4
    [0, 1.25],    //1800 BET , 1.5 Payout - GAME #3
    [8750, 1.25],    //1800 BET , 1.5 Payout - GAME #3
    [0, 1.25],    //1800 BET , 1.5 Payout - GAME #3
    [43750, 1.25],    //1800 BET , 1.5 Payout - GAME #3
    [0, 1.25],    //1800 BET , 1.5 Payout - GAME #3
    [218750, 1.25],    //1800 BET , 1.5 Payout - GAME #3
    

];

var startingBalance = userInfo.balance;
var currentBet = 0;
var currentGame = 0;
var totalGames = 0;

var winStreak = true;
var loseStreak = false;


var startingBet = currentBet;

log('Script is running.... ');
log('Starting Balance: ', startingBalance);


engine.on('GAME_STARTING', onGameStarted);
engine.on('GAME_ENDED', onGameEnded);


function onGameStarted() 
{
  totalGames++;
  var currentBet = 0;
  var cashOut = 0;

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
  
  

      if (currentBet > userInfo.balance) {
          log('Game KILLED BET TO BIG');
          engine.removeListener('GAME_STARTING', onGameStarted);
          engine.removeListener('GAME_ENDED', onGameEnded);
      }
      else
      {
        if(currentBet != 0)
        {
          log('Game #', currentGame, 'PLACE BET: ', roundBit(currentBet)/100, ' Cashout: ',  cashOut, ' User Balance: ', userInfo.balance/100);
          engine.bet(roundBit(currentBet), cashOut); 
        }
        
      }
  
}

function onGameEnded() {
  var lastGame = engine.history.first()
  
  if (!lastGame.wager) {
        log('SKIP:', lastGame.bust);
      
        if(currentGame > 0)
          currentGame++;
      return;     
  }
  
  if (lastGame.cashedAt) 
  {
      log('Current Game:', currentGame, 'WON : ', (lastGame.wager/100) * (lastGame.cashedAt), ' Bust: ', lastGame.bust, ', Balance: ', userInfo.balance/100, ', Profit: ', (userInfo.balance/100) - (startingBalance/100));
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
      log('Current Game:', currentGame, 'LOST       : ', lastGame.wager/100, ' Bust: ', lastGame.bust, ', Balance: ', userInfo.balance/100, ', Profit: ', (userInfo.balance/100) - (startingBalance/100));
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
     log('Strategy Failed! exiting...');
     engine.removeListener('GAME_STARTING', onGameStarted);
     engine.removeListener('GAME_ENDED', onGameEnded);
  }
  
}


function roundBit(bet) {
  return Math.round(bet / 100) * 100;
}

