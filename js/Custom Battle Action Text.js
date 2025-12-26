//=============================================================================
// TDS Custom Battle Action Text
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {} ; Imported.TDS_CustomBattleActionText = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {} ; _TDS_.CustomBattleActionText = _TDS_.CustomBattleActionText || {};
//=============================================================================
 /*:
 * @plugindesc
 * This plugins allows you to set customized messages for actions.
 *
 * @author TDS
 */
//=============================================================================


//=============================================================================
// ** Window_BattleLog
//-----------------------------------------------------------------------------
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
//=============================================================================
// Alias Listing
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_displayAction         = Window_BattleLog.prototype.displayAction;
_TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults  = Window_BattleLog.prototype.displayActionResults;
//=============================================================================
// * Make Custom Action Text
//=============================================================================
Window_BattleLog.prototype.makeCustomActionText = function(subject, target, item) {
  var user          = subject;
  var result        = target.result();
  var hit           = result.isHit();
  var success       = result.success;
  var critical      = result.critical;
  var missed        = result.missed;
  var evaded        = result.evaded;
  var hpDam         = result.hpDamage;
  var mpDam         = result.mpDamage;
  var tpDam         = result.tpDamage;
  var addedStates   = result.addedStates;
  var removedStates = result.removedStates;
  var strongHit     = result.elementStrong;
  var weakHit       = result.elementWeak;
  var text = '';
  var type = item.meta.BattleLogType.toUpperCase();
  var switches = $gameSwitches;
  var unitLowestIndex = target.friendsUnit().getLowestIndexMember();


  function parseNoEffectEmotion(tname, em) {
    if(em.toLowerCase().contains("afraid")) {
      if(tname === $gameActors.actor(1).name()) {return "OMORI nemůže mít větší STRACH!\r\n"}
      return target.name() + " nemůže mít větší STRACH!\r\n";
    }
    let finalString = `${tname} can't get ${em}`;
    if(finalString.length >= 40) {
      let voinIndex = 0;
      for(let i = 40; i >= 0; i--) {
        if(finalString[i] === " ") {
          voinIndex = i;
          break;
        }
      }
      finalString = [finalString.slice(0, voinIndex).trim(), "\r\n", finalString.slice(voinIndex).trimLeft()].join('')
    }
    return finalString;
  }

  function parseNoStateChange(tname,stat,hl) {
    let noStateChangeText = `${stat} ${tname} nemůže být\r\n${hl}`; // TARGET NAME - STAT - HIGHER/LOWER
    return noStateChangeText
  }

  // Type case
//OMORI//
if (hpDam != 0) {
  var hpDamageText = target.name() + ' ztrácí ' + hpDam + ' ŽIVOTŮ!';
  if (strongHit) {
    hpDamageText = '...Byl to útok za kroku!\r\n' + hpDamageText;
  } else if (weakHit) {
    hpDamageText = '...Ale bylo to marné.\r\n' + hpDamageText;
  }
} else if (result.isHit() === true) {
  var hpDamageText = user.name() + " útočí, avšak bez výsledku.";
} else {
  var hpDamageText = user.name() + " útočí, avšak poškození se !";
}

if (critical) {
    hpDamageText = 'TREFA PŘÍMO DO SRDCE!\r\n' + hpDamageText;
}

if (mpDam > 0) {
  var mpDamageText = target.name() + ' ztrácí ' + mpDam + ' ŠŤÁVY...';
  hpDamageText = hpDamageText + "\r\n" + mpDamageText;
} else {
  var mpDamageText = '';
}

  switch (type) {
  case 'BLANK': // ATTACK
    text = '...';
    break;

  case 'ATTACK': // ATTACK
    text = user.name() + ' útočí na ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'MULTIHIT':
    text = user.name() + "útočí za kroku!\r\n";
    break;

  case 'OBSERVE': // OBSERVE
    text = user.name() + ' soustředí zrak a pozoruje.\r\n';
    text += target.name() + '!';
    break;

  case 'OBSERVE TARGET': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = target.name() + ' pozoruje \r\n';
    text += user.name() + '!';
    break;

  case 'OBSERVE ALL': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = user.name() + ' soustředí zrak a pozoruje.\r\n';
    text += target.name() + '!';
    text = target.name() + ' má oči všude!';
    break;

  case 'SAD POEM':  // SAD POEM
    text = user.name() + ' čte smutné verše.\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(12)) {text += target.name() + ' se cítí MIZERNĚ...';}
      else if(target.isStateAffected(11)) {text += target.name() + ' je v DEPRESÍCH..';}
      else if(target.isStateAffected(10)) {text += target.name() + ' se cítí SMUTNĚ.';}
    }
    else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
    break;

  case 'STAB': // STAB
    text = user.name() + ' bodá ' + target.name() + '.\r\n';
    text += hpDamageText;
    break;

  case 'TRICK':  // TRICK
    text = user.name() + ' lže ' + target.name() + '.\r\n';
    if(target.isEmotionAffected("happy")) {
      if(!target._noStateMessage) {text += target.name() + '\ ztrácí RYCHLOST!\r\n';}
      else {text += parseNoStateChange(target.name(), "RYCHLOST", "nižší!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'SHUN': // SHUN
    text = user.name() + ' pohrdá ' + target.name() + '.\r\n';
    if(target.isEmotionAffected("sad")) {
      if(!target._noStateMessage) {text += target.name() + '\ ztrácí na OBRANĚ.\r\n';}
      else {text += parseNoStateChange(target.name(), "OBRANA", "nižší!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'MOCK': // MOCK
    text = user.name() + ' uráží ' + target.name() + '.\r\n';
    text += hpDamageText;
    break;

  case 'HACKAWAY':  // Hack Away
    text = user.name() + ' kolem sebe divoce seká!';
    break;

  case 'PICK POCKET': //Pick Pocket
    text = user.name() + ' se pokouší něco ukrást!\r\n';
    text += 'from ' + target.name();
    break;

  case 'BREAD SLICE': //Bread Slice
    text = user.name() + ' krájí ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'HIDE': // Hide
    text = user.name() + ' mizí v pozadí... ';
    break;

  case 'QUICK ATTACK': // Quick Attack
    text = user.name() + ' se vrhá na ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT HAPPY': //Exploit Happy
    text = user.name() + ' zneužívá ' + target.name() + '\ RADOST!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT SAD': // Exploit Sad
    text = user.name() + ' zneužívá ' + target.name() + '\'s\r\n';
    text += 'sadness!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT ANGRY': // Exploit Angry
    text = user.name() + ' zneužívá ' + target.name() + '\'s\r\n';
    text += 'anger!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT EMOTION': // Exploit Emotion
    text = user.name() + " zneužívá " + target.name() + " EMOCE";
    if(text.length >= 34) {
      text = user.name() + ' zneužívá ' + target.name() + '\'s\r\n';
      text += 'EMOCE!\r\n';
    }
    else {text += "\r\n"}
    text += hpDamageText;
    break;

  case 'FINAL STRIKE': // Final Strike
    text = user.name() + ' používá svůj ultimátní útok!';
    break;

  case 'TRUTH': // PAINFUL TRUTH
    text = user.name() + ' něco zašeptá OMORIMU';
    text += target.name() + '.\r\n';
    text += hpDamageText + "\r\n";
    if(!target._noEffectMessage) {
      text += target.name() + " prožívá SMUTEK.\r\n";
    }
    else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!\r\n")}
    if(user.isStateAffected(12)) {text += user.name() + " se cítí MIZERNĚ...";}
    else if(user.isStateAffected(11)) {text += user.name() + " je v DEPRESÍCH..";}
    else if(user.isStateAffected(10)) {text += user.name() + " se cítí SMUTNĚ.";}
    break;

  case 'ATTACK AGAIN':  // ATTACK AGAIN 2
    text = user.name() + ' útočí znovu!\r\n';
    text += hpDamageText;
    break;

  case 'TRIP':  // TRIP
    text = user.name() + ' strká do ' + target.name() + '!\r\n';
    if(!target._noStateMessage) {text += target.name() + '\ ztrácí RYCHLOST!\r\n';}
    else {text += parseNoStateChange(target.name(), "RYCHLOST", "nižší!\r\n")}
    text += hpDamageText;
    break;

    case 'TRIP 2':  // TRIP 2
      text = user.name() + ' strká do ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + '\ ztrácí RYCHLOST!\r\n';}
      else {text += parseNoStateChange(target.name(), "RYCHLOST", "nižší!\r\n")}
      if(!target._noEffectMessage) {text += target.name() + ' se cítí SMUTNĚ.\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!\r\n")}
      text += hpDamageText;
      break;

  case 'STARE': // STARE
    text = user.name() + ' zírá na ' + target.name() + '.\r\n';
    text += target.name() + ' se cítí nepříjemně.';
    break;

  case 'RELEASE ENERGY':  // RELEASE ENERGY
    text = user.name() + ' a jeho kamarádi spojují síly\r\n';
    text += 'a používají svůj ultimátní útok!';
    break;

  case 'VERTIGO': // OMORI VERTIGO
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' throws the foes off balance!\r\n';
      text += 'All foes\' ATTACK fell!\r\n';
    }
    text += hpDamageText;
    break;

  case 'CRIPPLE': // OMORI CRIPPLE
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' cripples the foes!\r\n';
      text += "All foes' SPEED fell.\r\n";
    }
    text += hpDamageText;
    break;

  case 'SUFFOCATE': // OMORI SUFFOCATE
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' dusí protivníky!\r\n';
      text += 'Všichni protivníci jsou bez dechu.\r\n';
      text += "Všichni protivníci ztrácí na OBRANĚ.\r\n";
    }
    text += hpDamageText;
    break;

  //AUBREY//
  case 'PEP TALK':  // PEP TALK
    text = user.name() + ' povzbuzuje ' + target.name() + '!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += target.name() + ' prožívá MÁNII!!!';}
      else if(target.isStateAffected(7)) {text += target.name() + ' prožívá NADŠENÍ!!';}
      else if(target.isStateAffected(6)) {text += target.name() + ' má RADOST!';}
    }
    else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
    break;

  case 'TEAM SPIRIT':  // TEAM SPIRIT
    text = user.name() + ' povzbuzuje ' + target.name() + '!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += target.name() + ' prožívá MÁNII!!!\r\n';}
      else if(target.isStateAffected(7)) {text += target.name() + ' prožívá NADŠENÍ!!\r\n';}
      else if(target.isStateAffected(6)) {text += target.name() + ' má RADOST!\r\n';}
    }
    else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!\r\n")}

    if(!user._noEffectMessage) {
      if(user.isStateAffected(8)) {text += user.name() + ' prožívá MÁNII!!!';}
      else if(user.isStateAffected(7)) {text += user.name() + ' prožívá NADŠENÍ!!';}
      else if(user.isStateAffected(6)) {text += user.name() + ' má RADOST!';}
    }
    else {text += parseNoEffectEmotion(user.name(), "ŠŤASTNĚJŠÍ!\r\n")}
    break;

  case 'HEADBUTT':  // HEADBUTT
    text = user.name() + ' hlavou naráží do ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'HOMERUN': // Homerun
    text = user.name() + ' odpinkává ' + target.name() + '\r\n';
    text += 'ven z hřiště!\r\n';
    text += hpDamageText;
    break;

  case 'THROW': // Wind-up Throw
    text = user.name() + ' vrhá svou zbraň!';
    break;

  case 'POWER HIT': //Power Hit
    text = user.name() + ' jednu vřáží ' + target.name() + '!\r\n';
    if(!target._noStateMessage) {text += target.name() + '\ ztrácí na OBRANĚ.\r\n';}
    else {text += parseNoStateChange(target.name(), "OBRANA", "nižší!\r\n")}
    text += hpDamageText;
    break;

  case 'LAST RESORT': // Last Resort
    text = user.name() + ' údeří do ' + target.name() + '\r\n';
    text += 'ze všech sil!\r\n';
    text += hpDamageText;
    break;

  case 'COUNTER ATTACK': // Counter Attack
    text = user.name() + ' chystá svou pálku!';
    break;

  case 'COUNTER HEADBUTT': // Counter Headbutt
    text = user.name() + ' chystá svou hlavu!';
    break;

  case 'COUNTER ANGRY': //Counter Angry
    text = user.name() + ' nabírá odvahu!';
    break;

  case 'LOOK OMORI 1':  // Look at Omori 2
    text = 'OMORI si nevšiml ' + user.name() + ', a tak\r\n';
    text += user.name() + ' útočí znovu!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 2': // Look at Omori 2
    text = 'OMORI si pořád ještě nevšiml ' + user.name() + ', a tak\r\n';
    text += user.name() + ' útočí silněji!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 3': // Look at Omori 3
    text = 'OMORI si konečně všímá ' + user.name() + '!\r\n';
    text += user.name() + ' se radostí ohání pálkou!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK KEL 1':  // Look at Kel 1
    text = 'KEL čumí na AUBRY!\r\n';
    text += target.name() + " se VZTEKÁ!";
    break;

  case 'LOOK KEL 2': // Look at Kel 2
   text = 'KEL čumí na AUBRY!\r\n';
   text += 'KELOVI a AUBRY se zvýšil ÚTOK!\r\n';
   var AUBREY = $gameActors.actor(2);
   var KEL = $gameActors.actor(3);
   if(AUBREY.isStateAffected(14) && KEL.isStateAffected(14)) {text += 'KEL and AUBRY se VZTEKAJÍ!';}
   else if(AUBREY.isStateAffected(14) && KEL.isStateAffected(15)) {
    text += 'KEL ZUŘÍ!!\r\n';
    text += 'AUBRY se VZTEKÁ!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(14)) {
    text += 'KEL se VZTEKÁ!\r\n';
    text += 'AUBRY ZUŘÍ!!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(15)) {text += 'KEL a AUBRY ZUŘÍ!!';}
   else {text += 'KEL a AUBRY se VZTEKAJÍ!';}
   break;

  case 'LOOK HERO':  // LOOK AT HERO 1
    text = 'HERO pobízí AUBRY, aby se soustředila!\r\n';
    if(target.isStateAffected(6)) {text += target.name() + " má RADOST!\r\n"}
    else if(target.isStateAffected(7)) {text += target.name() + " prožívá NADŠENÍ!!\r\n"}
    text += user.name() + '\ stoupá OBRANA!!';
    break;

  case 'LOOK HERO 2': // LOOK AT HERO 2
    text = 'HERO povzbuzuje AUBRY!\r\n';
    text += 'AUBRY stoupá OBRANA!!\r\n';
    if(target.isStateAffected(6)) {text += target.name() + " má RADOST!\r\n"}
    else if(target.isStateAffected(7)) {text += target.name() + " prožívá NADŠENÍ!!\r\n"}
    if(!!$gameTemp._statsState[0]) {
      var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
      if(absHp > 0) {text += `AUBRY získává ${absHp} ŽIVOTŮ!\r\n`;}
    }
    if(!!$gameTemp._statsState[1]) {
      var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
      if(absMp > 0) {text += `AUBRY získává ${absMp} ŠŤÁVY...`;}
    }
    $gameTemp._statsState = undefined;
    break;

  case 'TWIRL': // ATTACK
    text = user.name() + ' útočí na ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  //KEL//
    case 'ANNOY':  // ANNOY
      text = user.name() + ' otravuje ' + target.name() + '!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(14)) {text += target.name() + ' se VZTEKÁ!';}
        else if(target.isStateAffected(15)) {text += target.name() + ' ZUŘÍ!!';}
        else if(target.isStateAffected(16)) {text += target.name() + ' BĚSNÍ!!!';}
      }
      else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
      break;

    case 'REBOUND':  // REBOUND
      text = user.name() + '\ŮV míč se odráží všude kolem!';
      break;

    case 'FLEX':  // FLEX
      text = user.name() + ' zatíná svaly a přenáší hory!\r\n';
      text += user.name() + "OVI se zvýšil POČET ÚDERŮ!\r\n"
      break;

    case 'JUICE ME': // JUICE ME
      text = user.name() + ' přihrává KOKOS ' + target.name() + '!\r\n'
      var absMp = Math.abs(mpDam);
      if(absMp > 0) {
        text += `${target.name()} získává ${absMp} ŠŤÁVY...\r\n`
      }
      text += hpDamageText;
      break;

    case 'RALLY': // RALLY
      text = user.name() + ' všechny vzpuřuje!\r\n';
      if(user.isStateAffected(7)) {text += user.name() + " prožívá NADŠENÍ!!\r\n"}
      else if(user.isStateAffected(6)) {text += user.name() + " má RADOST!\r\n"}
      text += "Všichni získávají ENERGII!\r\n"
      for(let actor of $gameParty.members()) {
        if(actor.name() === $gameActors.actor(3).name()) {continue;}
        var result = actor.result();
        if(result.mpDamage >= 0) {continue;}
        var absMp = Math.abs(result.mpDamage);
        text += `${actor.name()} získává ${absMp} ŠŤÁVY...\r\n`
      }
      break;

    case 'SNOWBALL': // SNOWBALL
      text = user.name() + ' hází sněhovou kouli na \r\n';
      text += target.name() + '!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " prožívá SMUTEK.\r\n"}
      else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!\r\n")}
      text += hpDamageText;
      break;

    case 'TICKLE': // TICKLE
      text = user.name() + ' lechtá ' + target.name() + '!\r\n'
      text += `${target.name()} je mimo!`
      break;

    case 'RICOCHET': // RICOCHET
     text = user.name() + ' dělá strhující tríček s míčem!\r\n';
     text += hpDamageText;
     break;

    case 'CURVEBALL': // CURVEBALL
     text = user.name() + ' hází křivák...\r\n';
     text += target.name() + ' to má spočítané.\r\n';
     switch($gameTemp._randomState) {
       case 6:
         if(!target._noEffectMessage) {text += target.name() + " má RADOST!\r\n"}
         else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!\r\n")}
         break;
      case 14:
        if(!target._noEffectMessage) {text += target.name() + " se VZTEKÁ!\r\n"}
        else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!\r\n")}
        break;
      case 10:
        if(!target._noEffectMessage) {text += target.name() + " prožívá SMUTEK.\r\n"}
        else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!\r\n")}
        break;

     }
     text += hpDamageText;
     break;

    case 'MEGAPHONE': // MEGAPHONE
      if(target.index() <= unitLowestIndex) {text = user.name() + ' pobíhá kolem a všechny otravuje!\r\n';}
      if(target.isStateAffected(16)) {text += target.name() + ' BĚSNÍ!!!\r\n'}
      else if(target.isStateAffected(15)) {text += target.name() + ' ZUŘÍ!!\r\n'}
      else if(target.isStateAffected(14)) {text += target.name() + ' se VZTEKÁ!\r\n'}
      break;

    case 'DODGE ATTACK': // DODGE ATTACK
      text = user.name() + ' se chystá uhnout útoku!';
      break;

    case 'DODGE ANNOY': // DODGE ANNOY
      text = user.name() + ' se vysmívá protivníkům!';
      break;

    case 'DODGE TAUNT': // DODGE TAUNT
      text = user.name() + ' se vysmívá protivníkům!\r\n';
      text += "Všem protivníkům na tento tah klesl POČET ÚDERŮ!"
      break;

    case 'PASS OMORI':  // KEL PASS OMORI
      text = 'OMORI nedával pozor a míč ho trefil!\r\n';
      text += 'OMORI ztrácí 1 ŽIVOT!';
      break;

    case 'PASS OMORI 2': //KEL PASS OMORI 2
      text = 'OMORI chytá KELŮV míč!\r\n';
      text += 'OMORI hází míč na \r\n';
      text += target.name() + '!\r\n';
      var OMORI = $gameActors.actor(1);
      if(OMORI.isStateAffected(6)) {text += "OMORI má RADOST!\r\n"}
      else if(OMORI.isStateAffected(7)) {text += "OMORI prožívá NADŠENÍ!!\r\n"}
      text += hpDamageText;
      break;

    case 'PASS AUBREY':  // KEL PASS AUBREY
      text = 'AUBRY odpaluje míč ven z hřiště!\r\n';
      text += hpDamageText;
      break;

    case 'PASS HERO':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {text = user.name() + ' ohromuje protivníky!\r\n';}
      text += hpDamageText;
      break;

    case 'PASS HERO 2':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' ohromuje protivníky ve stylu!\r\n';
        text += "Všem protivníkům klesl ÚTOK!\r\n";
      }
      text += hpDamageText;
      break;

    //HERO//
    case 'MASSAGE':  // MASSAGE
      text = user.name() + ' dává masáž ' + target.name() + '!\r\n';
      if(!!target.isAnyEmotionAffected(true)) {
        text += target.name() + ' se uklidňuje...';
      }
      else {text += "Avšak bez výsledku..."}
      break;

    case 'COOK':  // COOK
      text = user.name() + ' uvaří sušenku jen pro ' + target.name() + '!';
      break;

    case 'FAST FOOD': //FAST FOOD
      text = user.name() + ' rychle nachystá svačinu ' + target.name() + '.';
      break;

    case 'JUICE': // JUICE
      text = user.name() + ' udělá občerstvení ' + target.name() + '.';
      break;

    case 'SMILE':  // SMILE
      text = user.name() + ' se usmívá na ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' ztrácí na ÚTOKU.';}
      else {text += parseNoStateChange(target.name(), "ÚTOK", "nižší!\r\n")}
      break;

    case 'DAZZLE':
      text = user.name() + ' se usmívá na ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + 'ztrácí na ÚTOKU.\r\n';}
      else {text += parseNoStateChange(target.name(), "ÚTOK", "nižší!\r\n")}
      if(!target._noEffectMessage) {
        text += target.name() + ' má RADOST!';
      }
      else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
      break;
    case 'TENDERIZE': // TENDERIZE
      text = user.name() + ' silně masážuje\r\n';
      text += target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + '\ ztrácí na OBRANĚ!\r\n';}
      else {text += parseNoStateChange(target.name(), "OBRANA", "nižší!\r\n")}
      text += hpDamageText;
      break;

    case 'SNACK TIME':  // SNACK TIME
      text = user.name() + ' všem udělal sušenky!';
      break;

    case 'TEA TIME': // TEA TIME
      text = user.name() + ' všem nachystal čajový dýchánek.\r\n';
      text += target.name() + ' se cítí čerstvě!\r\n';
      if(result.hpDamage < 0) {
        var absHp = Math.abs(result.hpDamage);
        text += `${target.name()} získává ${absHp} ŽIVOTŮ!\r\n`
      }
      if(result.mpDamage < 0) {
        var absMp = Math.abs(result.mpDamage);
        text += `${target.name()} získává ${absMp} ŠŤÁVY...\r\n`
      }
      break;

    case 'SPICY FOOD': // SPICY FOOD
      text = user.name() + ' všem nachystal pálivé jídlo!\r\n';
      text += hpDamageText;
      break;

    case 'SINGLE TAUNT': // SINGLE TAUNT
      text = user.name() + ' upoutává ' + target.name() + '\ \r\n';
      text += 'pozornost.';
      break;

    case 'TAUNT':  // TAUNT
      text = user.name() + ' upoutává protivníkovu pozornost.';
      break;

    case 'SUPER TAUNT': // SUPER TAUNT
      text = user.name() + ' upoutává protivníkovu pozornost.\r\n';
      text += user.name() + ' se chystá bránit útoku.';
      break;

    case 'ENCHANT':  // ENCHANT
      text = user.name() + ' upoutává protivníkovu pozornost\r\n';
      text += 's úsměvem.\r\n';
      if(!target._noEffectMessage) {text += target.name() + " feels HAPPY!";}
      else {text += parseNoEffectEmotion(target.name(), "HAPPIER!")}
      break;

    case 'MENDING': //MENDING
      text = user.name() + ' obsluhuje ' + target.name() + '.\r\n';
      text += user.name() + ' nyní dělá ' + target.name() + '\ osobního kuchaře!';
      break;

    case 'SHARE FOOD': //SHARE FOOD
      if(target.name() !== user.name()) {
        text = user.name() + ' se podělil s ' + target.name() + '!'
      }
      break;

    case 'CALL OMORI':  // CALL OMORI
      text = user.name() + ' dává znamení OMORIMU!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(1).hp);
        if(absHp > 0) {text += `OMORI získává ${absHp} ŽIVOTŮ!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(1).mp);
        if(absMp > 0) {text += `OMORI získává ${absMp} ŠŤÁVY...`;}
      }
      $gameTemp._statsState = undefined;
      break;

    case 'CALL KEL':  // CALL KEL
      text = user.name() + ' dráždí KELA!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(3).hp);
        if(absHp > 0) {text += `KEL získává ${absHp} ŽIVOTŮ!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(3).mp);
        if(absMp > 0) {text += `KEL získává ${absMp} ŠŤÁVY...`;}
      }
      break;

    case 'CALL AUBREY':  // CALL AUBREY
      text = user.name() + ' povzbuzuje AUBRY!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
        if(absHp > 0) {text += `AUBRY získává ${absHp} ŽIVOTŮ!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
        if(absMp > 0) {text += `AUBREY získává ${absMp} ŠŤÁVY...`;}
      }
      break;

    //PLAYER//
    case 'CALM DOWN':  // PLAYER CALM DOWN
      if(item.id !== 1445) {text = user.name() + ' se zklidnil.\r\n';} // Process if Calm Down it's not broken;
      if(Math.abs(hpDam) > 0) {text += user.name() + ' získává ' + Math.abs(hpDam) + ' ŽIVOTŮ!';}
      break;

    case 'FOCUS':  // PLAYER FOCUS
      text = user.name() + ' se pokouší soustředit.';
      break;

    case 'PERSIST':  // PLAYER PERSIST
      text = user.name() + ' se to pokouší VYDRŽET.';
      break;

    case 'OVERCOME':  // PLAYER OVERCOME
      text = user.name() + ' to PŘEMÁHÁ.';
      break;

  //UNIVERSAL//
    case 'FIRST AID':  // FIRST AID
      text = user.name() + ' ošetřuje ' + target.name() + '!\r\n';
      text += target.name() + ' získává ' + Math.abs(target._result.hpDamage) + ' ŽIVOTŮ!';
      break;

    case 'PROTECT':  // PROTECT
      text = user.name() + ' se postavil před ' + target.name() + 'HO!';
      break;

    case 'GAURD': // GAURD
      text = user.name() + ' se chystá bránit útoku.';
      break;

  //FOREST BUNNY//
    case 'BUNNY ATTACK': // FOREST BUNNY ATTACK
      text = user.name() + ' okusuje ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING': // BUNNY DO NOTHING
      text = user.name() + ' poskakuje kolem!';
      break;

    case 'BE CUTE':  // BE CUTE
      text = user.name() + ' mrká na ' + target.name() + '!\r\n';
      text += target.name() + '\ ztrácí na ÚTOKU...';
      break;

    case 'SAD EYES': //SAD EYES
      text = user.name() + ' se smutně kouká na ' + target.name() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' má SMUTEK.';}
      else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
      break;

  //FOREST BUNNY?//
    case 'BUNNY ATTACK2': // BUNNY? ATTACK
      text = user.name() + ' okusuje ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING2':  // BUNNY? DO NOTHING
      text = user.name() + ' poskakuje kolem?';
      break;

    case 'BUNNY CUTE2':  // BE CUTE?
      text = user.name() + ' mrká na ' + target.name() + '?\r\n';
      text += target.name() + '\ ztrácí na ÚTOKU?';
      break;

    case 'SAD EYES2': // SAD EYES?
      text = user.name() + ' se smutně kouká na ' + target.name() + '...\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' má SMUTEK?';}
      else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
      break;

    //SPROUT MOLE//
    case 'SPROUT ATTACK':  // SPROUT MOLE ATTACK
      text = user.name() + ' naráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING':  // SPROUT NOTHING
      text = user.name() + ' se koulí.';
      break;

    case 'RUN AROUND':  // RUN AROUND
      text = user.name() + ' pobíhá kolem!';
      break;

    case 'HAPPY RUN AROUND': //HAPPY RUN AROUND
      text = user.name() + ' nadšeně pobíhá kolem!';
       break;

    //MOON BUNNY//
    case 'MOON ATTACK':  // MOON BUNNY ATTACK
      text = user.name() + ' vráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MOON NOTHING':  // MOON BUNNY NOTHING
      text = user.name() + ' je ve smíru.';
      break;

    case 'BUNNY BEAM':  // BUNNY BEAM
      text = user.name() + ' střílí laser!\r\n';
      text += hpDamageText;
      break;

    //DUST BUNNY//
    case 'DUST NOTHING':  // DUST NOTHING
      text = user.name() + ' se pokouší\r\n';
      text += 'nerozsypat.';
      break;

    case 'DUST SCATTER':  // DUST SCATTER
      text = user.name() + ' exploduje!';
      break;

    //U.F.O//
    case 'UFO ATTACK':  // UFO ATTACK
      text = user.name() + ' vráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'UFO NOTHING':  // UFO NOTHING
      text = user.name() + ' ztrácí zájem.';
      break;

    case 'STRANGE BEAM':  // STRANGE BEAM
      text = user.name() + ' vyzařuje podivné světlo!\r\n';
      text += target.name() + " nabývá náhodnou EMOCI!"
      break;

    case 'ORANGE BEAM':  // ORANGE BEAM
      text = user.name() + ' střílí oranžový laser!\r\n';
      text += hpDamageText;
      break;

    //VENUS FLYTRAP//
    case 'FLYTRAP ATTACK':  // FLYTRAP ATTACK
      text = user.name() + ' údeří do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FLYTRAP NOTHING':  // FLYTRAP NOTHING
      text = user.name() + ' kouše do ničeho.';
      break;

    case 'FLYTRAP CRUNCH':  // FLYTRAP
      text = user.name() + ' rafá ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //WORMHOLE//
    case 'WORM ATTACK':  // WORM ATTACK
      text = user.name() + ' dává facku ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'WORM NOTHING':  // WORM NOTHING
      text = user.name() + ' se vrtí...';
      break;

    case 'OPEN WORMHOLE':  // OPEN WORMHOLE
      text = user.name() + ' otevírá červí díru!';
      break;

    //MIXTAPE//
    case 'MIXTAPE ATTACK':  // MIXTAPE ATTACK
      text = user.name() + ' dává facku ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MIXTAPE NOTHING':  // MIXTAPE NOTHING
      text = user.name() + ' se namotává.';
      break;

    case 'TANGLE':  // TANGLE
      text = target.name() + ' se zamotala v ' + user.name() + '!\r\n';
      text += target.name() + '\ ztrácí RYCHLOST...';
      break;

    //DIAL-UP//
    case 'DIAL ATTACK':  // DIAL ATTACK
      text = user.name() + ' je pomalé.\r\n';
      var pronumn = target.name() === $gameActors.actor(2).name() ? "ni" : "něj";
      text += `${target.name()} si vztekem ${pronumn}ublíží!\r\n`;
      text += hpDamageText;
      break;

    case 'DIAL NOTHING':  // DIAL NOTHING
      text = user.name() + ' se načítá...';
      break;

    case 'DIAL SLOW':  // DIAL SLOW
      text = user.name() + ' se zpoooomaluje.\r\n';
      text += 'Všem klesla RYCHLOST...';
      break;

    //DOOMBOX//
    case 'DOOM ATTACK':  // DOOM ATTACK
      text = user.name() + ' skáče po ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOOM NOTHING':  // DOOM NOTHING
      text = user.name() + ' ladí rádio.';
      break;

    case 'BLAST MUSIC':  // BLAST MUSIC
      text = user.name() + ' hraje pecky!';
      break;

    //SHARKPLANE//
    case 'SHARK ATTACK':  // SHARK PLANE
      text = user.name() + ' bourá do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK NOTHING':  // SHARK NOTHING
      text = user.name() + ' se škrábe na zubech.';
      break;

    case 'OVERCLOCK ENGINE':  // OVERCLOCK ENGINE
      text = user.name() + ' letí na plný kotel!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + '\ nabírá RYCHLOST!';
      }
      else {text += parseNoStateChange(user.name(), "SPEED", "higher!")}
      break;

    case 'SHARK CRUNCH':  // SHARK
        text = user.name() + ' kouše do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

    //SNOW BUNNY//
    case 'SNOW BUNNY ATTACK':  // SNOW ATTACK
      text = user.name() + ' kope sníh na ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW NOTHING':  // SNOW NOTHING
      text = user.name() + ' udržuje chladnou hlavu.';
      break;

    case 'SMALL SNOWSTORM':  // SMALL SNOWSTORM
      text = user.name() + ' na všechny kope sníh\r\n';
      text += 'a rozpoutává nejmenší sněhovou bouři na světě!';
      break;

    //SNOW ANGEL//
    case 'SNOW ANGEL ATTACK': //SNOW ANGEL ATTACK
      text = user.name() + ' sahá na ' + target.name() + '\r\n';
      text += 'svýma studenýma rukama.\r\n';
      text += hpDamageText;
      break;

    case 'UPLIFTING HYMN': //UPLIFTING HYMN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' zpívá krásnou píseň...\r\n';
        text += 'Všichni mají RADOST!';
      }
      target._noEffectMessage = undefined;
      break;

    case 'PIERCE HEART': //PIERCE HEART
      text = user.name() + ' píchá ' + target.name() + ' do srdce.\r\n';
      text += hpDamageText;
      break;

    //SNOW PILE//
    case 'SNOW PILE ATTACK': //SNOW PILE ATTACK
      text = user.name() + ' háže sníh na ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW PILE NOTHING': //SNOW PILE NOTHING
      text = user.name() + ' se cítí chladně.';
      break;

    case 'SNOW PILE ENGULF': //SNOW PILE ENGULF
      text = user.name() + ' obklopuje ' + target.name() + ' sněhem!\r\n';
      text += user.name() + ' ztrácí RYCHLOST.\r\n';
      text += user.name() + ' ztrácí na OBRANĚ.';
      break;

    case 'SNOW PILE MORE SNOW': //SNOW PILE MORE SNOW
      text = user.name() + ' se zahrabává do sněhu!\r\n';
      text += user.name() + ' získává na ÚTOKU!\r\n';
      text += user.name() + ' získává na OBRANĚ!';
      break;

    //CUPCAKE BUNNY//
    case 'CCB ATTACK': //CUP CAKE BUNNY ATTACK
      text = user.name() + ' naráží do ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CCB NOTHING': //CUP CAKE BUNNY NOTHING
      text = user.name() + ' hopsá do formy.';
      break;

    case 'CCB SPRINKLES': //CUP CAKE BUNNY SPRINKLES
      text = user.name() + ' po ' + target.name() + '\r\n';
      text += 'háže třpytky.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' má RADOST!\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!\r\n")}
      text += target.name() + " získává na všech VLASTNOSTECH!"
      break;

    //MILKSHAKE BUNNY//
    case 'MSB ATTACK': //MILKSHAKE BUNNY ATTACK
      text = user.name() + ' vylívá mléčný koktejl na ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'MSB NOTHING': //MILKSHAKE BUNNY NOTHING
      text = user.name() + ' se točí v kroužku.';
      break;

    case 'MSB SHAKE': //MILKSHAKE BUNNY SHAKE
      text = user.name() + ' sebou začne zuřivě třepat!\r\n';
      text += 'Koktejl se rozletěl všude!';
      break;

    //PANCAKE BUNNY//
    case 'PAN ATTACK': //PANCAKE BUNNY ATTACK
      text = user.name() + ' okusuje ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PAN NOTHING': //PANCAKE BUNNY NOTHING
      text = user.name() + ' se obrací!\r\n';
      text += 'To je ale talent!';
      break;

    //STRAWBERRY SHORT SNAKE//
    case 'SSS ATTACK': //STRAWBERRY SHORT SNAKE ATTACK
      text = user.name() + ' se tesákama zabořuje do ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SSS NOTHING': //STRAWBERRY SHORT SNAKE NOTHING
      text = user.name() + ' syčí.';
      break;

    case 'SSS SLITHER': //STRAWBERRY SHORT SNAKE SLITHER
      text = user.name() + ' se nadšeně plazí!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' má RADOST!';}
      else {text += parseNoEffectEmotion(user.name(), "ŠŤASTNĚJŠÍ!")}
      break;

    //PORCUPIE//
    case 'PORCUPIE ATTACK': //PORCUPIE ATTACK
      text = user.name() + ' bodá ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PORCUPIE NOTHING': //PORCUPIE NOTHING
      text = user.name() + ' ňufe.';
      break;

    case 'PORCUPIE PIERCE': //PORCUPIE PIERCE
      text = user.name() + ' napichuje ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //BUN BUNNY//
    case 'BUN ATTACK': //BUN ATTACK
      text = user.name() + ' zakročuje proti ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUN NOTHING': //BUN NOTHING
      text = user.name() + ' lelkuje.';
      break;

    case 'BUN HIDE': //BUN HIDE
      text = user.name() + ' se zabořuje do housky.';
      break;

    //TOASTY//
    case 'TOASTY ATTACK': //TOASTY ATTACK
      text = user.name() + ' vráží vší silou do ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'TOASTY NOTHING': //TOASTY NOTHING
      text = user.name() + ' se šťourá v nose.';
      break;

    case 'TOASTY RILE': //TOASTY RILE
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' pronáší kontroverní projev!\r\n';
        text += 'Všichni se VZTEKAJÍ!';
      }
      target._noEffectMessage = undefined;
      break;

    //SOURDOUGH//
    case 'SOUR ATTACK': //SOURDOUGH ATTACK
      text = user.name() + ' šlape na ' + target.name() + ' palec!\r\n';
      text += hpDamageText;
      break;

    case 'SOUR NOTHING': //SOURDOUGH NOTHING
      text = user.name() + ' kope do hlíny.';
      break;

    case 'SOUR BAD WORD': //SOURDOUGH BAD WORD
      text = 'Ale ne! ' + user.name() + ' mluví sprostě!\r\n';
      text += hpDamageText;
      break;

    //SESAME//
    case 'SESAME ATTACK': //SESAME ATTACK
      text = user.name() + ' háže semínkama po ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SESAME NOTHING': //SESAME Nothing
      text = user.name() + ' se škrábe na hlavě.';
      break;

    case 'SESAME ROLL': //SESAME BREAD ROLL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' všechny převaluje!\r\n';
      }
      text += hpDamageText;
      break;

    //CREEPY PASTA//
    case 'CREEPY ATTACK': //CREEPY ATTACK
      text = user.name() + ' nutí ' + target.name() + ' se cítit\r\n';
      text += 'nepříjemně.\r\n';
      text += hpDamageText;
      break;

    case 'CREEPY NOTHING': //CREEPY NOTHING
      text = user.name() + ' nic nedělá... a to děsivě!';
      break;

    case 'CREEPY SCARE': //CREEPY SCARE
      text = user.name() + ' všem ukazuje jejich nehorší\r\n';
      text += 'noční můry!';
      break;

    //COPY PASTA//
    case 'COPY ATTACK': //COPY ATTACK
      text = user.name() + ' vráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DUPLICATE': //DUPLICATE
      text = user.name() + ' se kopíruje! ';
      break;

    //HUSH PUPPY//
    case 'HUSH ATTACK': //HUSH ATTACK
      text = user.name() + ' naráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HUSH NOTHING': //HUSH NOTHING
      text = user.name() + ' se pokouší šťěkat...\r\n';
      text += 'Avšak nic se nestalo...';
      break;

    case 'MUFFLED SCREAMS': //MUFFLED SCREAMS
      text = user.name() + ' začíná ječet!\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI") {
        text += target.name() + ' má STRACH.';
      }
      else {text += parseNoEffectEmotion(target.name(), "STRACH")}
      break;

    //GINGER DEAD MAN//
    case 'GINGER DEAD ATTACK': //GINGER DEAD MAN ATTACK
      text = user.name() + ' bodá ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GINGER DEAD NOTHING': //GINGER DEAD MAN DO NOTHING
      text = user.name() + ' přichází o hlavu...\r\n';
      text += user.name() + ' si znovu nasazuje hlavu.';
      break;

    case 'GINGER DEAD THROW HEAD': //GINGER DEAD MAN THROW HEAD
      text = user.name() + ' háže svou hlavou po\r\n';
      text +=  target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //LIVING BREAD//
    case 'LIVING BREAD ATTACK': //LIVING BREAD ATTACK
      text = user.name() + ' se otírá o ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD NOTHING': //LIVING BREAD ATTACK
      text = user.name() + ' se pomalu přibližuje\r\n';
      text += target.name() + '!';
      break;

    case 'LIVING BREAD BITE': //LIVING BREAD BITE
      text = user.name() + ' kouše do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD BAD SMELL': //LIVING BREAD BAD SMELL
      text = user.name() + ' smrdí!\r\n';
      text += target.name() + ' ztrácí na OBRANĚ!';
      break;

    //Bug Bunny//
    case 'BUG BUN ATTACK': //Bug Bun Attack
     text = user.name() + ' se otírá o ' + target.name() + '!\r\n';
     text += hpDamageText;
     break;

    case 'BUG BUN NOTHING': //Bug Bun Nothing
      text = user.name() + ' se pokouší postavit na hlavu. ';
      break;

    case 'SUDDEN JUMP': //SUDDEN JUMP
      text = user.name() + ' z ničeho nic skáče po ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SCUTTLE': //Bug Bun Scuttle
      text = user.name() + ' radostně poskakuje.\r\n';
      text += 'To je ale roztomilé!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' má RADOST!';}
      else {text += parseNoEffectEmotion(user.name(), "ŠŤASTNĚJŠÍ!")}
      break;

    //RARE BEAR//
    case 'BEAR ATTACK': //BEAR ATTACK
      text = user.name() + ' škrábe ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BEAR HUG': //BEAR HUG
      text = user.name() + ' objímá ' + target.name() + '!\r\n';
      text += target.name() + ' ztrácí RYCHLOST!\r\n';
      text += hpDamageText;
      break;

    case 'ROAR': //ROAR
      text = user.name() + ' děsivě řve!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' feels ANGRY!';}
      else {text += parseNoEffectEmotion(user.name(), "ANGRIER!")}
      break;

    //POTTED PALM//
    case 'PALM ATTACK': //PALM ATTACK
      text = user.name() + ' vráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PALM NOTHING': //PALM NOTHING
      text = user.name() + ' odpočívá ve svém květináči. ';
      break;

    case 'PALM TRIP': //PALM TRIP
      text = target.name() + ' zakopává o ' + user.name() + ' kořeny.\r\n';
      text += hpDamageText + '.\r\n';
      text += target.name() + ' ztrácí RYCHLOST.';
      break;

    case 'PALM EXPLOSION': //PALM EXPLOSION
      text = user.name() + ' exploduje!';
      break;

    //SPIDER CAT//
    case  'SPIDER ATTACK': //SPIDER ATTACK
      text = user.name() + ' kouše do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPIDER NOTHING': //SPIDER NOTHING
      text = user.name() + ' vykašlává klubíčko pavučiny.';
      break;

    case 'SPIN WEB': //SPIN WEB
       text = user.name() + ' střílí pavučinu po ' + target.name() + '!\r\n';
       text += target.name() + ' ztrácí RYCHLOST.';
       break;

    //SPROUT MOLE?//
    case 'SPROUT ATTACK 2':  // SPROUT MOLE? ATTACK
      text = user.name() + ' naráží do ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING 2':  // SPROUT MOLE? NOTHING
      text = user.name() + ' se koulí?';
      break;

    case 'SPROUT RUN AROUND 2':  // SPROUT MOLE? RUN AROUND
      text = user.name() + ' pobíhá kolem?';
      break;

    //HAROLD//
    case 'HAROLD ATTACK': //HAROLD ATTACK
      text = user.name() + ' mečem seká ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HAROLD NOTHING': // HAROLD NOTHING
      text = user.name() + ' si upravuje přilbu.';
      break;

    case 'HAROLD PROTECT': // HAROLD PROTECT
      text = user.name() + ' se brání.';
      break;

    case 'HAROLD WINK': //HAROLD WINK
      text = user.name() + ' mrká na ' + target.name() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' má RADOST!';}
      else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
      break;

    //MARSHA//
    case 'MARSHA ATTACK': //MARSHA ATTACK
      text = user.name() + ' sekerou seká ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA NOTHING': //MARSHA NOTHING
      text = user.name() + ' padá na zem. ';
      break;

    case 'MARSHA SPIN': //MARSHA NOTHING
      text = user.name() + ' se točí nadzvukovou rychlostí!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA CHOP': //MARSHA CHOP
      text = user.name() + ' zaráží svou sekeru do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //THERESE//
    case 'THERESE ATTACK': //THERESE ATTACK
      text = user.name() + ' střílí šíp na ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE NOTHING': //THERESE NOTHING
      text = user.name() + 'OVI padá šíp na zem.';
      break;

    case 'THERESE SNIPE': //THERESE SNIPE
      text = user.name() + ' trefuje ' + target.name() + ' do slabiny!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE INSULT': //THERESE INSULT
      text = user.name() + ' nadává ' + target.name() + ' do pokakance!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se VZTEKÁ!\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!\r\n")}
      text += hpDamageText;
      break;

    case 'DOUBLE SHOT': //THERESE DOUBLE SHOT
      text = user.name() + ' střílí dva šípy naráz!';
      break;

    //LUSCIOUS//
    case 'LUSCIOUS ATTACK': //LUSCIOUS ATTACK
      text = user.name() + ' se pokouší o kouzlo...\r\n';
      text += user.name() + ' udělal něco kouzelné!\r\n';
      text += hpDamageText;
      break;

    case 'LUSCIOUS NOTHING': //LUSCIOUS NOTHING
      text = user.name() + ' se pokouší o kouzlo...\r\n';
      text += 'Avšak nic se nestalo...';
      break;

    case 'FIRE MAGIC': //FIRE MAGIC
      text = user.name() + ' se pokouší o kouzlo...\r\n';
      text += user.name() + ' podpaluje celou tvou partu!\r\n';
      text += hpDamageText;
      break;

    case 'MISFIRE MAGIC': //MISFIRE MAGIC
      text = user.name() + ' se pokouší o kouzlo...\r\n';
      text += user.name() + ' podpálil celý pokoj!!!\r\n';
      text += hpDamageText;
      break;

    //HORSE HEAD//
    case 'HORSE HEAD ATTACK': //HORSE HEAD ATTACK
      text = user.name() + ' kouše ' + target.name() + ' do ruky.\r\n';
      text += hpDamageText;
      break;

    case 'HORSE HEAD NOTHING': //HORSE HEAD NOTHING
      text = user.name() + ' krká.';
      break;

    case 'HORSE HEAD LICK': //HORSE HEAD LICK
     text = user.name() + ' olizuje ' + target.name() + ' vlasy\r\n';
     text += hpDamageText + '\r\n';
     if(!target._noEffectMessage) {text += target.name() + ' se VZTEKÁ!';}
     else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
     break;

    case 'HORSE HEAD WHINNY': //HORSE HEAD WHINNY
      text = user.name() + ' radostně ijá!';
      break;

    //HORSE BUTT//
    case 'HORSE BUTT ATTACK': //HORSE BUTT ATTACK
      text = user.name() + ' šlape po ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT NOTHING': //HORSE BUTT NOTHING
      text = user.name() + ' si uprdl.';
      break;

    case 'HORSE BUTT KICK': //HORSE BUTT KICK
      text = user.name() + ' kope do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT PRANCE': //HORSE BUTT PRANCE
      text = user.name() + ' uskakuje.';
      break;

    //FISH BUNNY//
    case 'FISH BUNNY ATTACK': //FISH BUNNY ATTACK
      text = user.name() + ' naplavává do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FISH BUNNY NOTHING': //FISH BUNNY NOTHING
      text = user.name() + ' plave v kolečku. ';
      break;

    case 'SCHOOLING': //SCHOOLING
      text = user.name() + ' volá o pomoc! ';
      break;

    //MAFIA ALLIGATOR//
    case 'MAFIA ATTACK': //MAFIA ATTACK
      text = user.name() + ' dělá chvat na ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA NOTHING': //MAFIA NOTHING
      text = user.name() + ' křupe klouby.';
      break;

    case 'MAFIA ROUGH UP': //MAFIA ROUGH UP
      text = user.name() + ' pacifikuje ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA BACK UP': //MAFIA ALLIGATOR BACKUP
      text = user.name() + ' přivolává posily!';
      break;

    //MUSSEL//
    case 'MUSSEL ATTACK': //MUSSEL ATTACK
      text = user.name() + ' mlátí do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MUSSEL FLEX': //MUSSEL FLEX
     text = user.name() + ' zatíná svaly a přenáší hory!\r\n';
     text += user.name() + " nabírá na ÚTOKU!\r\n"
     break;

    case 'MUSSEL HIDE': //MUSSEL HIDE
     text = user.name() + ' se schovává do své schránky.';
     break;

    //REVERSE MERMAID//
    case 'REVERSE ATTACK': //REVERSE ATTACK
     text = target.name() + ' naráží do ' + user.name() + '!\r\n';
     text += hpDamageText;
     break;

    case 'REVERSE NOTHING': //REVERSE NOTHING
     text = user.name() + ' dělá otočku dozadu!\r\n';
     text += 'TY BRĎO!';
     break;

    case 'REVERSE RUN AROUND': //REVERSE RUN AROUND
      text = 'Všichni utíkají před ' + user.name() + ',\r\n';
      text += 'ale namísto toho do ní narazí...\r\n';
      text += hpDamageText;
      break;

    //SHARK FIN//
    case 'SHARK FIN ATTACK': //SHARK FIN ATTACK
      text = user.name() + ' vráží plnou silou do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK FIN NOTHING': //SHARK FIN NOTHING
      text = user.name() + ' plave v kolečku.';
      break;

    case 'SHARK FIN BITE': //SHARK FIN BITE
      text = user.name() + ' kouše ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK WORK UP': //SHARK FIN WORK UP
      text = user.name() + ' plave na hladinu!\r\n';
      text += user.name() + ' nabírá RYCHLOST!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' se VZTEKÁ!';
      }
      else {text += parseNoEffectEmotion(user.name(), "VZTEKLEJŠÍ!")}
      break;

    //ANGLER FISH//
    case 'ANGLER ATTACK': //ANGLER FISH ATTACK
      text = user.name() + ' kouše ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'ANGLER NOTHING': //ANGLER FISH NOTHING
      text = user.name() + 'MU kručí v břiše.';
      break;

    case 'ANGLER LIGHT OFF': //ANGLER FISH LIGHT OFF
      text = user.name() + ' vypíná své světlo.\r\n';
      text += user.name() + ' mizí ve tmě.';
      break;

    case 'ANGLER BRIGHT LIGHT': //ANGLER FISH BRIGHT LIGHT
      text = 'Všem před očima problikávají\r\n';
      text += 'jejich životy!';
      break;

    case 'ANGLER CRUNCH': //ANGLER FISH CRUNCH
      text = user.name() + ' napichuje ' + target.name() + ' na své zuby!\r\n';
      text += hpDamageText;
      break;

    //SLIME BUNNY//
    case 'SLIME BUN ATTACK': //SLIME BUNNY ATTACK
      text = user.name() + ' se lepí na ' + target.name() +'.\r\n';
      text += hpDamageText;
      break;

    case 'SLIME BUN NOTHING': //SLIME BUN NOTHING
      text = user.name() + ' se na všechny usmívá.\r\n';
      break;

    case 'SLIME BUN STICKY': //SLIME BUN STICKY
      text = user.name() + ' se cítí osaměle a pláče.\r\n';
      if(!target._noStateMessage) {text += target.name() + ' ztrácí RYCHLOST!\r\n';}
      else {text += parseNoStateChange(target.name(), "RYCHLOST", "nižší!\r\n")}
      text += target.name() + " má SMUTEK.";
      break;

    //WATERMELON MIMIC//
    case 'WATERMELON RUBBER BAND': //WATERMELON MIMIC RUBBER BAND
      text = user.name() + ' střílí GUMIČKU!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON JACKS': //WATERMELON MIMIC JACKS
      text = user.name() + ' po všech hází ŠROUBKY!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON DYNAMITE': //WATERMELON MIMIC DYNAMITE
      text = user.name() + ' po tobě vrhá DYNAMIT!\r\n';
      text += 'OH NO!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON WATERMELON SLICE': //WATERMELON MIMIC WATERMELON SLICE
      text = user.name() + ' po tobě vrhá MELOUNOVOU ŠŤÁVU!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON GRAPES': //WATERMELON MIMIC GRAPES
      text = user.name() + ' po tobě vrhá HROZNOVOU SODOVKU!\r\n';
      text += hpDamageText;
      break;

    case 'WATEMELON FRENCH FRIES': //WATERMELON MIMIC FRENCH FRIES
      text = user.name() + ' po tobě vrhá HRANOLKY!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON CONFETTI': //WATERMELON MIMIC CONFETTI
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' po tobě vrhá KONFETY!\r\n';
        text += "Všichni mají RADOST!"
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON RAIN CLOUD': //WATERMELON MIMIC RAIN CLOUD
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' přivolává MRAK!\r\n';
        text += "Všichni mají SMUTEK."
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON AIR HORN': //WATERMELON MIMIC AIR HORN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' houká OBŘÍM KLAKSONEM!\r\n';
        text += "Všichni se VZTEKAJÍ!"
      }
      target._noEffectMessage = undefined;
      break;

    //SQUIZZARD//
    case 'SQUIZZARD ATTACK': //SQUIZZARD ATTACK
      text = user.name() + ' začarovává ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SQUIZZARD NOTHING': //SQUIZZARD NOTHING
      text = user.name() + ' si mumlá nesmysly.';
      break;

    case 'SQUID WARD': //SQUID WARD
      text = user.name() + ' dělá výheň.\r\n';
      text += target.name() + ' nabírá na OBRANĚ.';
      break;

    case  'SQUID MAGIC': //SQUID MAGIC
      text = user.name() +  ' dělá olihní kouzla!\r\n';
      text += 'Všichni se cítí nějak divně...';
      break;

    //WORM-BOT//
    case 'BOT ATTACK': //MECHA WORM ATTACK
      text = user.name() + ' vráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT NOTHING': //MECHA WORM NOTHING
      text = user.name() + ' hlastiě kouše!';
      break;

    case 'BOT LASER': //MECHA WORM CRUNCH
      text = user.name() + ' střílí laserem po ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT FEED': //MECHA WORM FEED
      text = user.name() + ' jí ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;


    //SNOT BUBBLE//
    case 'SNOT INFLATE': //SNOT INFLATE
      text = user.name() + ' se nafoukává!\r\n';
      text += target.name() + ' nabírá na ÚTOKU!';
      break;

    case 'SNOT POP': //SNOT POP
      text = user.name() + ' exploduje!\r\n';
      text += 'Všude lítají sople!!\r\n';
      text += hpDamageText;
      break;

    //LAB RAT//
    case  'LAB ATTACK': //LAB RAT ATTACK
      text = user.name() + ' střílí malinký laser!\r\n';
      text += hpDamageText;
      break;

    case  'LAB NOTHING': //LAB RAT NOTHING
      text = user.name() + ' vypustí trošku páry.';
      break;

    case  'LAB HAPPY GAS': //LAB RAT HAPPY GAS
      text = user.name() + ' vypouští plyn RADOSTI!\r\n';
      text += 'Všichni mají RADOST!';
      target._noEffectMessage = undefined;
      break;

    case  'LAB SCURRY': //LAB RAT SCURRY
      text = user.name() + ' chvátá!\r\n';
      break;

    //MECHA MOLE//
    case 'MECHA MOLE ATTACK': //MECHA MOLE ATTACK
      text = user.name() + ' střílí laserem po ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MECHA MOLE NOTHING': //MECHA MOLE NOTHING
      text = user.name() + 'OVI září oči.';
      break;

    case 'MECHA MOLE EXPLODE': //MECHA MOLE EXPLODE
      text = user.name() + ' polyká jedinou slzu.\r\n';
      text += user.name() + ' překrásně exploduje!';
      break;

    case 'MECHA MOLE STRANGE LASER': //MECHA MOLE STRANGE LASER
      text = user.name() + ' z očí vyzařuje divnou\r\n';
      text += 'zář. ' + target.name() + ' má zvláštní pocit.';
      break;

    case 'MECHA MOLE JET PACK': //MECHA MOLE JET PACK
      text = 'Na ' + user.name() + 'zádech se objevily trysky!\r\n';
      text += user.name() + ' všem ulítá!';
      break;

    //CHIMERA CHICKEN//
    case 'CHICKEN RUN AWAY': //CHIMERA CHICKEN RUN AWAY
      text = user.name() + ' utíká.';
      break;

    case 'CHICKEN NOTHING': //CHICKEN DO NOTHING
      text = user.name() + ' kokodá. ';
      break;

    //SALLI//
    case 'SALLI ATTACK': //SALLI ATTACK
      text = user.name() + ' naráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SALLI NOTHING': //SALLI NOTHING
      text = user.name() + ' dělá malou otočku!';
      break;

    case 'SALLI SPEED UP': //SALLI SPEED UP
      text = user.name() + ' zběsile běhá pokojem!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' nabírá RYCHLOST!';
      }
      else {text += parseNoStateChange(user.name(), "RYCHLOST", "vyšší!")}
      break;

    case 'SALLI DODGE ANNOY': //SALLI STARE
      text = user.name() + ' se silně soustředí! ';
      break;

    //CINDI//
    case 'CINDI ATTACK': //CINDI ATTACK
      text = user.name() + ' mlátí do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI NOTHING': //CINDI NOTHING
      text = user.name() + ' se točí v kroužku.';
      break;

    case 'CINDI SLAM': //CINDI SLAM
      text = user.name() + ' vráží svou ruku do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI COUNTER ATTACK': //CINDI COUNTER ATTACK
      text = user.name() + ' se chystá!';
      break;

    //DOROTHI//
    case 'DOROTHI ATTACK': //DOROTHI ATTACK
      text = user.name() + ' šlape po ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI NOTHING': //DOROTHI NOTHING
      text = user.name() + ' křičí do temna.';
      break;

    case 'DOROTHI KICK': //DOROTHI KICK
      text = user.name() + ' kope do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI HAPPY': //DOROTHI HAPPY
      text = user.name() + ' poskakuje!';
      break;

    //NANCI//
    case 'NANCI ATTACK': //NANCI ATTACK
      text = user.name() + ' se zabodává drápama do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'NANCI NOTHING': //NANCI NOTHING
      text = user.name() + ' se kolíbá tam a zpátky.';
      break;

    case 'NANCI ANGRY': //NANCI ANGRY
      text = user.name() + ' začíná ztrácet trpělivost!';
      break;

    //MERCI//
    case 'MERCI ATTACK': //MERCI ATTACK
      text = user.name() + ' se dotýká ' + target.name() + ' hrudníku.\r\n';
      text += target.name() + ' cítí, jak se mu roztrhávají orgány!\r\n';
      text += hpDamageText;
      break;

    case 'MERCI NOTHING': //MERCI NOTHING
      text = user.name() + ' se znepokojivě usmívá.';
      break;

    case 'MERCI MELODY': //MERCI LAUGH
      text = user.name() + ' zpívá.\r\n';
      text += target.name() + ' poznává melodii.\r\n';
      if(target.isStateAffected(6)) {text += target.name() + " má RADOST!\r\n"}
      else if(target.isStateAffected(7)) {text += target.name() + " prožívá NADŠENÍ!!\r\n"}
      else if(target.isStateAffected(8)) {text += target.name() + " prožívá MÁNII!!!\r\n"}
      break;

    case 'MERCI SCREAM': //MERCI SCREAM
      text = user.name() + ' ze sebe vydává děsivý skřek!\r\n';
      text += hpDamageText;
      break;


    //LILI//
    case 'LILI ATTACK': //LILI ATTACK
      text = user.name() + ' hledí ' + target.name() + ' do duše!\r\n';
      text += hpDamageText;
      break;

    case 'LILI NOTHING': //LILI NOTHING
      text = user.name() + ' mrká.';
      break;

    case 'LILI MULTIPLY': //LILI MULTIPLY
      text = user.name() + ' upadává oko!\r\n';
      text += 'Z oka vyrostla další ' + user.name() + '!';
      break;

    case 'LILI CRY': //LILI CRY
      text = 'Slzy tečou z' + user.name() + 'NÝCH očí.\r\n';
      text += target.name() + " má SMUTEK."
      break;

    case 'LILI SAD EYES': //LILI SAD EYES
      text = target.name() + ' si všímá smutku v ' + user.name() + ' očích.\r\n';
      text += target.name() + ' již nechce útočit na ' + user.name(); + '.\r\n'
      break;

    //HOUSEFLY//
    case 'HOUSEFLY ATTACK': //HOUSEFLY ATTACK
      text = user.name() + ' přistála na ' + target.name() + ' obličeji.\r\n';
      text += target.name() + ' se plácl do obličeje!\r\n';
      text += hpDamageText;
      break;

    case 'HOUSEFLY NOTHING': //HOUSEFLY NOTHING
      text = user.name() + ' bzučí!';
      break;

    case 'HOUSEFLY ANNOY': //HOUSEFLY ANNOY
      text = user.name() + ' bzučí ' + target.name() + ' do ucha!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se VZTEKÁ!';}
      else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
      break;

    //RECYCLIST//
    case 'FLING TRASH': //FLING TRASH
      text = user.name() + ' háže po ' + target.name() + ' ODPAD!\r\n';
      text += hpDamageText;
      break;

    case 'GATHER TRASH': //GATHER TRASH
      text = user.name() + ' na zemi našel ODPAD\r\n';
      text += 'a zabalil ho do pytle!\r\n';
      text += hpDamageText;
      break;

    case 'RECYCLIST CALL FOR FRIENDS': //RECYCLIST CALL FOR FRIENDS
      text = user.name() + ' svolal další RECYKLOSEKTAŘE!!';
      break;

    //STRAY DOG//
    case 'STRAY DOG ATTACK': //STRAY DOG ATTACK
      text = user.name() + ' kouše!\r\n';
      text += hpDamageText;
      break;

    case 'STRAY DOG HOWL': //STRAY DOG HOWL
      text = user.name() + ' ukrutně vyje!';
      break;

    //CROW//
    case 'CROW ATTACK': //CROW ATTACK
      text = user.name() + ' klove ' + target.name() + ' do očí.\r\n';
      text += hpDamageText;
      break;

    case 'CROW GRIN': //CROW GRIN
      text = user.name() + ' má úsměv od ucha k uchu.';
      break;

    case 'CROW STEAL': //CROW STEAL
      text = user.name() + ' něco krade!';
      break;

    // BEE //
    case 'BEE ATTACK': //BEE Attack
      text = user.name() + ' bodá ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'BEE NOTHING': //BEE NOTHING
      text = user.name() + ' kvapivě polétává!';
      break;

    // GHOST BUNNY //
    case 'GHOST BUNNY ATTACK': //GHOST BUNNY ATTACK
      text = user.name() + ' prochází skrz ' + target.name() + '!\r\n';
      text += target.name() + ' se cítí unaveně.\r\n';
      text += mpDamageText;
      break;

    case 'GHOST BUNNY NOTHING': //GHOST BUNNY DO NOTHING
      text = user.name() + ' se vznáší na místě.';
      break;

    //TOAST GHOST//
    case 'TOAST GHOST ATTACK': //TOAST GHOST ATTACK
      text = user.name() + ' prochází skrz ' + target.name() + '!\r\n';
      text += target.name() + ' se cítí unaveně.\r\n';
      text += hpDamageText;
      break;

    case 'TOAST GHOST NOTHING': //TOAST GHOST NOTHING
      text = user.name() + ' dělá strašidelné zvuky.';
      break;

    //SPROUT BUNNY//
    case 'SPROUT BUNNY ATTACK': //SPROUT BUNNY ATTACK
      text = user.name() + ' dává facku ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT BUNNY NOTHING': //SPROUT BUNNY NOTHING
      text = user.name() + ' okusuje trávu.';
      break;

    case 'SPROUT BUNNY FEED': //SPROUT BUNNY FEED
      text = user.name() + ' krmí ' + target.name() + '.\r\n';
      text += `${user.name()} získává ${Math.abs(hpDam)} ŽIVOTŮ!`
      break;

    //CELERY//
    case 'CELERY ATTACK': //CELERY ATTACK
      text = user.name() + ' naráží do ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CELERY NOTHING': //CELERY NOTHING
      text = user.name() + ' se převrhl.';
      break;

    //CILANTRO//
    case 'CILANTRO ATTACK': //CILANTRO ATTACK
      text = user.name() + ' bouchá do ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CILANTRO NOTHING': //CILANTRO DO NOTHING
      text = user.name() + ' přejímá o svém životě.';
      break;

    case 'GARNISH': //CILANTRO GARNISH
      text = user.name() + ' se objetuje, aby\r\n';
      text += 'pomohl ' + target.name() + '.';
      break;

    //GINGER//
    case 'GINGER ATTACK': //GINGER ATTACK
      text = user.name() + ' se lomí a útočí na ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'GINGER NOTHING': //GINGER NOTHING
      text = user.name() + ' našel vnitřní klid.';
      break;

    case 'GINGER SOOTHE': //GINGER SOOTHE
      text = user.name() + ' uklidňuje ' + target.name() + '.\r\n';
      break;

    //YE OLD MOLE//
    case 'YE OLD ROLL OVER': //MEGA SPROUT MOLE ROLL OVER
      text = user.name() + ' všechny zalehl!';
      text += hpDamageText;
      break;

    //KITE KID//
    case 'KITE KID ATTACK':  // KITE KID ATTACK
      text = user.name() + ' hází ŠROUBKY po ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE KID BRAG':  // KITE KID BRAG
      text = user.name() + ' se chlubí svým DRAKEM!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' má RADOST!';
      }
      else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
      break;

    case 'REPAIR':  // REPAIR
      text = user.name() + ' páskou přelepuje svého DRAKA!\r\n';
      text += 'KLUKŮV DRAK je jako nový!';
      break;

    //KID'S KITE//
    case 'KIDS KITE ATTACK': // KIDS KITE ATTACK
      text = user.name() + ' letí střemhlav na ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE NOTHING': // KITE NOTHING
      text = user.name() + ' si hrdě bije do hrudi!';
      break;

    case 'FLY 1':  // FLY 1
      text = user.name() + ' vylétává opravdu vysoko!';
      break;

    case 'FLY 2':  // FLY 2
      text = user.name() + ' rychle klesá!!';
      break;

    //PLUTO//
    case 'PLUTO NOTHING':  // PLUTO NOTHING
      text = user.name() + ' pózuje!\r\n';
      break;

    case 'PLUTO HEADBUTT':  // PLUTO HEADBUTT
      text = user.name() + ' za běhu vrazí do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PLUTO BRAG':  // PLUTO BRAG
      text = user.name() + ' se chlubí svými svaly!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' má RADOST!';
      }
      else {text += parseNoEffectEmotion(user.name(), "ŠŤASTNĚJŠÍ!")}
      break;

    case 'PLUTO EXPAND':  // PLUTO EXPAND
      text = user.name() + ' se posiluje!!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' nabírá na ÚTOKU a OBRANĚ!!\r\n';
        text += user.name() + ' ztrácí RYCHLOST.';
      }
      else {
        text += parseNoStateChange(user.name(), "ÚTOK", "vyšší!\r\n")
        text += parseNoStateChange(user.name(), "OBRANA", "vyšší!\r\n")
        text += parseNoStateChange(user.name(), "RYCHLOST", "nižší!")
      }
      break;

    case 'EXPAND NOTHING':  // PLUTO NOTHING
      text = user.name() + 'VY svaly\r\n';
      text += 'tě zastrašily.';
      break;

    //RIGHT ARM//
    case 'R ARM ATTACK':  // R ARM ATTACK
      text = user.name() + ' seká ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GRAB':  // GRAB
      text = user.name() + ' chytl ' + target.name() + '!\r\n';
      text += target.name() + ' ztrácí RYCHLOST.\r\n';
      text += hpDamageText;
      break;

    //LEFT ARM//
    case 'L ARM ATTACK':  // L ARM ATTACK
      text = user.name() + ' bije do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'POKE':  // POKE
      text = user.name() + ' šťouchá do ' + target.name() + '!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' se VZTEKÁ!\r\n';
      }
      else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!\r\n")}
      text += hpDamageText;
      break;

    //DOWNLOAD WINDOW//
    case 'DL DO NOTHING':  // DL DO NOTHING
      text = user.name() + ' je na 99%.';
      break;

    case 'DL DO NOTHING 2':  // DL DO NOTHING 2
      text = user.name() + ' je pořád na 99%...';
      break;

    case 'DOWNLOAD ATTACK':  // DOWNLOAD ATTACK
      text = user.name() + ' padá a hoří!';
      break;

    //SPACE EX-BOYFRIEND//
    case 'SXBF ATTACK':  // SXBF ATTACK
      text = user.name() + ' kope do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SXBF NOTHING':  // SXBF NOTHING
      text = user.name() + ' pohrdavě\r\n';
      text += 'hledí do dáli.';
      break;

    case 'ANGRY SONG':  // ANGRY SONG
      text = user.name() + ' neúprosně ječí!';
      break;

    case 'ANGSTY SONG':  // ANGSTY SONG
      text = user.name() + ' smutně zpívá...\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' má SMUTEK.';}
      else if(target.isStateAffected(11)) {text += target.name() + ' je v DEPRESÍCH..';}
      else if(target.isStateAffected(12)) {text += target.name() + ' se cítí MIZERNĚ...';}
      break;

    case 'BIG LASER':  // BIG LASER
      text = user.name() + ' střílí laser!\r\n';
      text += hpDamageText;
      break;

    case 'BULLET HELL':  // BULLET HELL
      text = user.name() + ' zoufale\r\n';
      text += 'střílí všude kolem!';
      break;

    case 'SXBF DESPERATE':  // SXBF NOTHING
      text = user.name() + '\r\n';
      text += 'zatíná zuby!';
      break;

    //THE EARTH//
    case 'EARTH ATTACK':  // EARTH ATTACK
      text = user.name() + ' útočí na ' + target.name() + '!\r\n';
      text += hpDamageText
      break;

    case 'EARTH NOTHING':  // EARTH NOTHING
      text = user.name() + ' se pomalu otáčí.';
      break;

    case 'EARTH CRUEL':  // EARTH CRUEL
      text = user.name() + ' je zlá na ' + target.name() + '!\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' má SMUTEK.';}
      else if(target.isStateAffected(11)) {text += target.name() + ' je v DEPRESÍCH..';}
      else if(target.isStateAffected(12)) {text += target.name() + ' se cítí MIZERNĚ...';}
      break;

    case 'CRUEL EPILOGUE':  // EARTH CRUEL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " je zlá na všechny...\r\n";
        text += "Všichni mají SMUTEK."
      }
      break;

    case 'PROTECT THE EARTH':  // PROTECT THE EARTH
      text = user.name() + ' útočí ze všech sil!';
      break;

    //SPACE BOYFRIEND//
    case 'SBF ATTACK': //SPACE BOYFRIEND ATTACK
      text = user.name() + ' ukvapeně kope ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SBF LASER': //SPACE BOYFRIEND LASER
      text = user.name() + ' střílí laser!\r\n';
      text += hpDamageText;
      break;

    case 'SBF CALM DOWN': //SPACE BOYFRIEND CALM DOWN
      text = user.name() + ' si čistí hlavu\r\n';
      text += 'a zbavuje se všech EMOCÍ.';
      break;

    case 'SBF ANGRY SONG': //SPACE BOYFRIEND ANGRY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' řve ze vší své zlosti!\r\n';
        text += "Všichni se VZTEKAJÍ!\r\n";
      }
      text += hpDamageText;
      break;

    case 'SBF ANGSTY SONG': //SPACE BOYFRIEND ANGSTY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' zpívá ze všeho\r\n';
        text += 'svého smutku!\r\n';
        text += "Všichni mají SMUTEK.\r\n";
      }
      text += mpDamageText;
      break;

    case 'SBF JOYFUL SONG': //SPACE BOYFRIEND JOYFUL SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' zpívá ze vší\r\n';
        text += "své radosti!\r\n"
        text += "Všichni mají RADOST!\r\n";
      }
      text += hpDamageText;
      break;

    //NEFARIOUS CHIP//
    case 'EVIL CHIP ATTACK': //NEFARIOUS CHIP ATTACK
      text = user.name() + ' naráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'EVIL CHIP NOTHING': //NEFARIOUS CHIP NOTHING
      text = user.name() + ' si drhne svůj\r\n';
      text += 'zlý knír!';
      break;


    case 'EVIL LAUGH': //NEFARIOUS LAUGH
      text = user.name() + ' se směje, jako\r\n';
      text += 'správný záporák!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " má RADOST!"}
      else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
      break;

    case 'EVIL COOKIES': //NEFARIOUS COOKIES
      text = user.name() + ' po všech háze OVESNÉ SUŠENKY!\r\n';
      text += 'Čiré zlo!';
      break;

    //BISCUIT AND DOUGHIE//
    case 'BD ATTACK': //BISCUIT AND DOUGHIE ATTACK
      text = user.name() + ' spojí síly!\r\n';
      text += hpDamageText;
      break;

    case 'BD NOTHING': //BISCUIT AND DOUGHIE NOTHING
      text = user.name() + ' něco zapomněla\r\n';
      text += 'v troubě!';
      break;

    case 'BD BAKE BREAD': //BISCUIT AND DOUGHIE BAKE BREAD
      text = user.name() + ' z trouby\r\n';
      text += 'vytahují CHLEBA!';
      break;

    case 'BD COOK': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' upekla sušenku!\r\n';
      text += `${target.name()} získávají ${Math.abs(hpDam)}\r\nŽIVOTŮ!`
      break;

    case 'BD CHEER UP': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' se ze všech sil snaží\r\n';
      text += 'nebýt SMUTNÁ.';
      break;

    //KING CRAWLER//
    case 'KC ATTACK': //KING CRAWLER ATTACK
      text = user.name() + ' vráží do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC NOTHING': //KING CRAWLER NOTHING
      text = user.name() + ' ze sebe vydává ukrutný\r\n';
      text += 'skřek!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + " se VZTEKÁ!";
      }
      else {text += parseNoEffectEmotion(target.name(), "ANGRIER!")}
      break;

    case 'KC CONSUME': //KING CRAWLER CONSUME
      text = user.name() + ' snědl a\r\n';
      text += "ZTRACENÉHO KLÍČKOKRTKA!\r\n"
      text += `${target.name()} získává ${Math.abs(hpDam)} ŽIVOTŮ!\r\n`;
      break;

    case 'KC RECOVER': //KING CRAWLER CONSUME
      text = `${target.name()} získává ${Math.abs(hpDam)} ŽIVOTŮ!\r\n`;
      if(!target._noEffectMessage) {text += target.name() + " má RADOST!"}
      else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
      break;

    case 'KC CRUNCH': //KING CRAWLER CRUNCH
      text = user.name() + ' kouše do ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC RAM': //KING CRAWLER RAM
      text = user.name() + ' se prodírá tvou partou!\r\n';
      text += hpDamageText;
      break;

    //KING CARNIVORE//

    case "SWEET GAS":
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " vypouští plyn!\r\n";
        text += "Voní sladce!\r\n";
        text += "Všichni mají RADOST!";
      }
      target._noEffectMessage = undefined;
      break;

    //SPROUTMOLE LADDER//
    case 'SML NOTHING': //SPROUT MOLE LADDER NOTHING
      text = user.name() + ' se tyčí. ';
      break;

    case 'SML SUMMON MOLE': //SPROUT MOLE LADDER SUMMON SPROUT MOLE
      text = 'KLÍČKOKRTEK leze po ' + user.name() + 'U!';
      break;

    case 'SML REPAIR': //SPROUT MOLE LADDER REPAIR
      text = user.name() + ' je opraven.';
      break;

    //UGLY PLANT CREATURE//
    case 'UPC ATTACK': //UGLY PLANT CREATURE ATTACK
      text = user.name() + ' se omotává\r\n';
      text += target.name() + ' liánami!\r\n';
      text += hpDamageText;
      break;

    case 'UPC NOTHING': //UGLY PLANT CRATURE NOTHING
      text = user.name() + ' ječí!';
      break;

    //ROOTS//
    case 'ROOTS NOTHING': //ROOTS NOTHING
      text = user.name() + ' se vrtí.';
      break;

    case 'ROOTS HEAL': //ROOTS HEAL
      text = user.name() + ' chystá \r\n';
      text += target.name() + 'čerstvé živiny.';
      break;

    //BANDITO MOLE//
    case 'BANDITO ATTACK': //BANDITO ATTACK
      text = user.name() + ' řeže ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BANDITO STEAL': //BANDITO STEAL
      text = user.name() + ' tvé partě mazaně něco\r\n';
      text += 'ukradl!'
      break;

    case 'B.E.D.': //B.E.D.
      text = user.name() + ' vytahuje P.O.S.T.E.L.!\r\n';
      text += hpDamageText;
      break;

    //SIR MAXIMUS//
    case 'MAX ATTACK': //SIR MAXIMUS ATTACK
      text = user.name() + ' se ohání mečem!\r\n';
      text += hpDamageText;
      break;

    case 'MAX NOTHING': //SIR MAXIMUS NOTHING
      text = user.name() + ' se škrábe po zádech...\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' má SMUTEK.'
      }
      else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
      break;

    case 'MAX STRIKE': //SIR MAXIMUS SWIFT STRIKE
      text = user.name() + ' údeří dvakrát!';
      break;

    case 'MAX ULTIMATE ATTACK': //SIR MAXIMUS ULTIMATE ATTACK
      text = '"A NYNÍ - MŮJ ULTIMÁTNÍ ÚTOK!"';
      text += hpDamageText;
      break;

    case 'MAX SPIN': //SIR MAXIMUS SPIN
        break;

    //SIR MAXIMUS II//
    case 'MAX 2 NOTHING': //SIR MAXIMUS II NOTHING
      text = user.name() + ' si vzpomněl na\r\n';
      text += 'poslední slova jeho otce.\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' má SMUTEK.'
      }
      else {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
      break;

    //SIR MAXIMUS III//
    case 'MAX 3 NOTHING': //SIR MAXIMUS III NOTHING
      text = user.name() + ' si vzpomněl na\r\n';
      text += 'poslední slova svého děda.\r\n';
      text += target.name() + ' má SMUTEK.'
      break;

    //SWEETHEART//
    case 'SH ATTACK': //SWEET HEART ATTACK
      text = user.name() + ' dává facku ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SH INSULT': //SWEET HEART INSULT
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " všem nadává!\r\n"
        text += "Všichni se VZTEKAJÍ!\r\n";
      }
      text += hpDamageText;
      target._noEffectMessage = undefined;
      break;

    case 'SH SNACK': //SWEET HEART SNACK
      text = user.name() + ' posílá sluhu pro\r\n';
      text += 'SVÁČU.\r\n';
      text += hpDamageText;
      break;

    case 'SH SWING MACE': //SWEET HEART SWING MACE
      text = user.name() + ' se zuřivě ohání žezlem!\r\n';
      text += hpDamageText;
      break;

    case 'SH BRAG': //SWEET HEART BRAG
      text = user.name() + ' se chlubí\r\n';
      text += 'jedním ze svých několika talentů!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(8)) {text += target.name() + ' prožívá MÁNII!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' prožívá NADŠENÍ!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' má RADOST!';}
      }
      else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}

      break;

      //MR. JAWSUM //
      case 'DESK SUMMON MINION': //MR. JAWSUM DESK SUMMON MINION
        text = user.name() + ' zvedá sluchátko a\r\n';
        text += 'přivolává KROKOĎÁKA!';
        break;

      case 'JAWSUM ATTACK ORDER': //MR. JAWSUM DESK ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' rozkazuje KROKOĎÁKŮM útočit!\r\n';
          text += "Všichni se VZTEKAJÍ!";
        }
        break;

      case 'DESK NOTHING': //MR. JAWSUM DESK DO NOTHING
        text = user.name() + ' počítá MUŠLE.';
        break;

      //PLUTO EXPANDED//
      case 'EXPANDED ATTACK': //PLUTO EXPANDED ATTACK
        text = user.name() + ' háže Měsíc na\r\n';
        text += target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED SUBMISSION HOLD': //PLUTO EXPANDED SUBMISSION HOLD
        text = user.name() + ' sráží ' + target.name() + '\r\n';
        text += 'do stabilní polohy!\r\n';
        text += target.name() + ' ztrácí RYCHLOST.\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED HEADBUTT': //PLUTO EXPANDED HEADBUTT
        text = user.name() + ' hlavou naráží\r\n';
        text += 'do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED FLEX COUNTER': //PLUTO EXPANDED FLEX COUNTER
        text = user.name() + ' zatíná svaly a\r\n'
        text += 'chystá se!';
        break;

      case 'EXPANDED EXPAND FURTHER': //PLUTO EXPANDED EXPAND FURTHER
        text = user.name() + ' se nadále rozšiřuje!\r\n';
        if(!target._noStateMessage) {
          text += target.name() + ' ztrácí na ÚTOKU!\r\n';
          text += target.name() + ' ztrácí na OBRANĚ!\r\n';
          text += target.name() + ' ztrácí RYCHLOST.';
        }
        else {
          text += parseNoStateChange(user.name(), "ÚTOK", "vyšší!\r\n")
          text += parseNoStateChange(user.name(), "OBRANA", "vyšší!\r\n")
          text += parseNoStateChange(user.name(), "RYCHLOST", "nižší!")
        }
        break;

      case 'EXPANDED EARTH SLAM': //PLUTO EXPANDED EARTH SLAM
        text = user.name() + ' zvedá Zemi a\r\n';
        text += 'vrhá ji po tvé partě!';
        break;

      case 'EXPANDED ADMIRATION': //PLUTO EXPANDED ADMIRATION
        text = user.name() + ' obdivuje KEL\ŮV pokrok!\r\n';
        if(target.isStateAffected(8)) {text += target.name() + ' prožívá MÁNII!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' prožívá NADŠENÍ!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' má RADOST!';}
        break;

      //ABBI TENTACLE//
      case 'TENTACLE ATTACK': //ABBI TENTACLE ATTACK
        text = user.name() + ' vráží do ' + target.name() + 'HO!\r\n';
        text += hpDamageText;
        break;

      case 'TENTACLE TICKLE': //ABBI TENTACLE TICKLE
        text = user.name() + " oslabuje " + target.name() + "!\r\n";
        var pronumn = target.name() === $gameActors.actor(2).name() ? " " : " ";
        text += `${target.name()} ztrácí${pronumn} pozornost!`
        break;

      case 'TENTACLE GRAB': //ABBI TENTACLE GRAB
        text = user.name() + ' se omotává kolem ' + target.name() + 'HO!\r\n';
        if(result.isHit()) {
          if(target.name() !== "OMORI" && !target._noEffectMessage) {text += target.name() + " má STRACH.\r\n";}
          else {text += parseNoEffectEmotion(target.name(), "STRACH")}
        }
        text += hpDamageText;
        break;

      case 'TENTACLE GOOP': //ABBI TENTACLE GOOP
        text = target.name() + ' je obložen tmavou tekutinou!\r\n';
        text += target.name() + ' slábne...\r\n';
        text += target.name() + ' ztrácí na ÚTOKU.\r\n';
        text += target.name() + ' ztrácí na OBRANĚ.\r\n';
        text += target.name() + ' ztrácí RYCHLOST.';
        break;

      //ABBI//
      case 'ABBI ATTACK': //ABBI ATTACK
        text = user.name() + ' útočí na ' + target.name() + 'HO!\r\n';
        text += hpDamageText;
        break;

      case 'ABBI REVIVE TENTACLE': //ABBI REVIVE TENTACLE
        text = user.name() + ' soustředí své ŽIVOTY.';
        break;

      case 'ABBI VANISH': //ABBI VANISH
        text = user.name() + ' mizí do říše stínů...';
        break;

      case 'ABBI ATTACK ORDER': //ABBI ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' natahuje svá chapadla.\r\n';
          text += "Všem se zvedl ÚTOK!!\r\n"
          text += "Všichni se VZTEKAJÍ!"
        }
        break;

      case 'ABBI COUNTER TENTACLE': //ABBI COUNTER TENTACLES
        text = user.name() + ' se prodírá stíny...';
        break;

      //ROBO HEART//
      case 'ROBO HEART ATTACK': //ROBO HEART ATTACK
        text = user.name() + ' po tobě střílí raketové ruce!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART NOTHING': //ROBO HEART NOTHING
        text = user.name() + ' se načítá...';
        break;

      case 'ROBO HEART LASER': //ROBO HEART LASER
        text = user.name() + ' otevírá pusu\r\n';
        text += 'a střílí z ní laser!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART EXPLOSION': //ROBO HEART EXPLOSION
        text = user.name() + ' polyká jedinou robotí slzu.\r\n';
        text += user.name() + ' exploduje!';
        break;

      case 'ROBO HEART SNACK': //ROBO HEART SNACK
        text = user.name() + ' otevírá pusu.\r\n';
        text += 'Je v ní výživná SVÁČA!\r\n';
        text += hpDamageText;
        break;

      //MUTANT HEART//
      case 'MUTANT HEART ATTACK': //MUTANT HEART ATTACK
        text = user.name() + ' zpívá písničku pro ' + target.name() + '!\r\n';
        text += 'Nebyla nic moc...\r\n';
        text += hpDamageText;
        break;

      case 'MUTANT HEART NOTHING': //MUTANT HEART NOTHING
        text = user.name() + ' pózuje!';
        break;

      case 'MUTANT HEART HEAL': //MUTANT HEART HEAL
        text = user.name() + ' si spravuje šaty!';
        text += hpDamageText;
        break;

      case 'MUTANT HEART WINK': //MUTANT HEART WINK
        text = user.name() + ' mrká na ' + target.name() + '!\r\n';
        text += 'Celkem roztomilé...\r\n';
        if(!target._noEffectMessage){text += target.name() + ' má RADOST!';}
        else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
        break;

      case 'MUTANT HEART INSULT': //MUTANT HEART INSULT
        text = user.name() + ' omylem řekla něco\r\n';
        text += 'nehezkého.\r\n';
        if(!target._noEffectMessage){text += target.name() + ' se VZTEKÁ!';}
        else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
        break;

      case 'MUTANT HEART KILL': //MUTANT HEART KILL
        text = 'MUTANTÍČKO dává facku ' + user.name() +'!\r\n';
        text += hpDamageText;
        break;

        //PERFECT HEART//
        case 'PERFECT STEAL HEART': //PERFECT HEART STEAL HEART
          text = user.name() + ' beree ' + target.name() + '\'s\r\n';
          text += 'ŽIVOTY.\r\n';
          text += hpDamageText + "\r\n";
          if(user.result().hpDamage < 0) {text += `${user.name()} získává ${Math.abs(user.result().hpDamage)} ŽIVOTŮ!\r\n`}
          break;

        case 'PERFECT STEAL BREATH': //PERFECT HEART STEAL BREATH
          text = user.name() + ' bere ' + target.name() + '\ \r\n';
          text += 'dech.\r\n';
          text += mpDamageText + "\r\n";
          if(user.result().mpDamage < 0) {text += `${user.name()} získává ${Math.abs(user.result().mpDamage)} ŠŤÁVY...\r\n`}
          break;

        case 'PERFECT EXPLOIT EMOTION': //PERFECT HEART EXPLOIT EMOTION
          text = user.name() + ' zneužívá ' + target.name() + '\ \r\n';
          text += 'EMOCE!\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT SPARE': //PERFECT SPARE
          text = user.name() + ' se rozhodlo nechat\r\n';
          text += target.name() + ' naživu.\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT ANGELIC VOICE': //UPLIFTING HYMN
          if(target.index() <= unitLowestIndex) {
            text = user.name() + ' zpívá procítěnou písničku...\r\n';
            if(!user._noEffectMessage) {text += user.name() + " má SMUTEK.\r\n"}
            else {text += parseNoEffectEmotion(user.name(), "SMUTNĚJŠÍ!\r\n")}
            text += 'Everyone feels HAPPY!';
          }
          break;

        case "PERFECT ANGELIC WRATH":
          if(target.index() <= unitLowestIndex) {text = user.name() + " pouští svůj hněv z řetězu.\r\n";}
          if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' prožívá MÁNII!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' prožívá NADŠENÍ!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' má RADOST!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' se cítí MIZERNĚ...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' má DEPRESE..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' má SMUTEK.\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' ZUŘÍ!!!\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' BĚSNÍ!!\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' se VZTEKÁ!\r\n';}
          }
          else {
            if(target.isEmotionAffected("happy")) {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!\r\n")}
            else if(target.isEmotionAffected("sad")) {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!\r\n")}
            else if(target.isEmotionAffected("angry")) {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!\r\n")}
          }
          text += hpDamageText;
          break;

        //SLIME GIRLS//
        case 'SLIME GIRLS COMBO ATTACK': //SLIME GIRLS COMBO ATTACK
          text = 'The ' + user.name() + ' útočí všechny naráz!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS DO NOTHING': //SLIME GIRLS DO NOTHING
          text = 'MEDÚZA po tobě vrhá láhev...\r\n';
          text += 'Avšak nic se nestalo...';
          break;

        case 'SLIME GIRLS STRANGE GAS': //SLIME GIRLS STRANGE GAS
            if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' prožívá MÁNII!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' prožívá NADŠENÍ!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' má RADOST!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' se cítí MIZERNĚ...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' má DEPRESE..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' má SMUTEK.\r\n';}
              else if(target.isStateAffected(16)) {text += target.name() + ' ZUŘÍ!!!\r\n';}
              else if(target.isStateAffected(15)) {text += target.name() + ' BĚSNÍ!!\r\n';}
              else if(target.isStateAffected(14)) {text += target.name() + ' se VZTEKÁ!\r\n';}
          }
          else {
            if(target.isEmotionAffected("happy")) {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!\r\n")}
            else if(target.isEmotionAffected("sad")) {text += parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!\r\n")}
            else if(target.isEmotionAffected("angry")) {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!\r\n")}
          }
          break;

        case 'SLIME GIRLS DYNAMITE': //SLIME GIRLS DYNAMITE
          //text = 'MEDUSA threw a bottle...\r\n';
          //text += 'And it explodes!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS STING RAY': //SLIME GIRLS STING RAY
          text = 'MOLLY střílí své žihadla!\r\n';
          text += target.name() + ' to schytává!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS SWAP': //SLIME GIRLS SWAP
          text = 'MEDÚZA dělá tu věc!\r\n';
          text += 'Vyměnily se ti ŽIVOTY a ŠŤÁVA!';
          break;

        case 'SLIME GIRLS CHAIN SAW': //SLIME GIRLS CHAIN SAW
          text = 'MARINA vytahuje motorovou pilu!\r\n';
          text += hpDamageText;
          break;

      //HUMPHREY SWARM//
      case 'H SWARM ATTACK': //HUMPHREY SWARM ATTACK
        text = 'BENDA obklopuje a útočí na ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY LARGE//
      case 'H LARGE ATTACK': //HUMPHREY LARGE ATTACK
        text = 'BENDA vráží do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY FACE//
      case 'H FACE CHOMP': //HUMPHREY FACE CHOMP
        text = 'BENDA se zakusuje do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'H FACE DO NOTHING': //HUMPHREY FACE DO NOTHING
        text = 'BENDA se dívá na ' + target.name() + '!\r\n';
        text += 'BENDA neúprosně slintá.';
        break;

      case 'H FACE HEAL': //HUMPHREY FACE HEAL
        text = 'BENDA polkl protivníka!\r\n';
        text += `BENDA získává ${Math.abs(hpDam)} ŽIVOTŮ!`
        break;

      //HUMPHREY UVULA//
      case 'UVULA DO NOTHING 1': //HUMPHREY UVULA DO NOTHING
        text = user.name() + ' se usmívá na ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 2': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' mrká na ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 3': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' plive na ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 4': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' hledí na ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 5': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' mrká na ' + target.name() + '.\r\n';
      break;

      //FEAR OF FALLING//
      case 'DARK NOTHING': //SOMETHING IN THE DARK NOTHING
        text = user.name() + ' se vysmívá ' + target.name() + 'MU\r\n';
        text += 'při tom, co padá.';
        break;

      case 'DARK ATTACK': //SOMETHING IN THE DARK ATTACK
        text = user.name() + ' strká do ' + target.name() + 'HO.\r\n';
        text += hpDamageText;
        break;

      //FEAR OF BUGS//
      case 'BUGS ATTACK': //FEAR OF BUGS ATTACK
        text = user.name() + ' kouše do ' + target.name() + 'HO!\r\n';
        text += hpDamageText;
        break;

      case 'BUGS NOTHING': //FEAR OF BUGS NOTHING
        text = user.name() + ' si s tebou snaží promluvit...';
        break;

      case 'SUMMON BABY SPIDER': //SUMMON BABY SPIDER
        text = 'Vylíhlo se vejce.\r\n';
        text += 'Objevil se PAVOUČEK.';
        break;

      case 'BUGS SPIDER WEBS': //FEAR OF BUGS SPIDER WEBS
        text = user.name() + ' zamotal ' + target.name() + 'HO\r\n';
        text += 'do lepivé pavučiny.\r\n';
        text += target.name() + ' ztrácí RYCHLOST!\r\n';
        break;

      //BABY SPIDER//
      case 'BABY SPIDER ATTACK': //BABY SPIDER ATTACK
        text = user.name() + ' kouše do ' + target.name() + 'HO!\r\n';
        text += hpDamageText;
        break;

      case 'BABY SPIDER NOTHING': //BABY SPIDER NOTHING
        text = user.name() + ' ze sebe vydává divné zvuky.';
        break;

      //FEAR OF DROWNING//
      case 'DROWNING ATTACK': //FEAR OF DROWNING ATTACK
        text = 'Voda ' + target.name() + 'HO hází všemi\r\n';
        text += 'různými směry.\r\n';
        text += hpDamageText;
        break;

      case 'DROWNING NOTHING': //FEAR OF DROWNING NOTHING
        text = user.name() + ' poslouchá, jak ' + target.name() + "NY bojuje.";
        break;

      case 'DROWNING DRAG DOWN': //FEAR OF DROWNING DRAG DOWN
        // text = user.name() + ' grabs\r\n';
        // text += target.name() + '\s leg and drags him down!\r\n';
        text = hpDamageText;
        break;

      //OMORI'S SOMETHING//
      case 'O SOMETHING ATTACK': //OMORI SOMETHING ATTACK
        text = user.name() + ' sahá skrz ' + target.name() + 'HO.\r\n';
        text += hpDamageText;
        break;

      case 'O SOMETHING NOTHING': //OMORI SOMETHING NOTHING
        text = user.name() + ' vidí skrz ' + target.name() + 'HO.\r\n';
        break;

      case 'O SOMETHING BLACK SPACE': //OMORI SOMETHING BLACK SPACE
        //text = user.name() + ' drags ' + target.name() + ' into\r\n';
        //text += 'the shadows.';
        text = hpDamageText;
        break;

      case 'O SOMETHING SUMMON': //OMORI SOMETHING SUMMON SOMETHING
        text = user.name() + ' něco přivolává\r\n';
        text += 'ze tmy.';
        break;

      case 'O SOMETHING RANDOM EMOTION': //OMORI SOMETHING RANDOM EMOTION
        text = user.name() + ' si hraje se ' + target.name() +'HO EMOCEMI.';
        break;

      //BLURRY IMAGE//
      case 'BLURRY NOTHING': //BLURRY IMAGE NOTHING
        text = 'NĚCO se kolíbá ve větru.';
        break;

      //HANGING BODY//
      case 'HANG WARNING':
          text = 'Cítíš, jak ti jde mráz po zádech.';
          break;

      case 'HANG NOTHING 1':
          text = 'Dělá se ti špatně.';
          break;

      case 'HANG NOTHING 2':
          text = 'Cítíš, jak se ti sevřely plíce.';
          break;

      case 'HANG NOTHING 3':
          text = 'Cítíš, jako by se ti něco\r\n';
          text += 'topilo v žaludku.';
          break;

      case 'HANG NOTHING 4':
          text = 'Cítíš se, jako by ti mělo srdce\r\n';
          text += 'brzy vyskočit z hrudi.';
          break;

      case 'HANG NOTHING 5':
          text = 'Nedokážeš se přestat třást.';
          break;

      case 'HANG NOTHING 6':
          text = 'Slábneš v kolenou.';
          break;

      case 'HANG NOTHING 7':
          text = 'Z čela ti teče\r\n';
          text += 'pot.';
          break;

      case 'HANG NOTHING 8':
          text = 'Cítíš, jak se ti samovolně zatíná pěst.';
          break;

      case 'HANG NOTHING 9':
          text = 'Slyšíš, jak ti bije srdce.';
          break;

      case 'HANG NOTHING 10':
          text = 'Slyšíš, že se ti klidní tep.';
          break;

      case 'HANG NOTHING 11':
          text = 'Slyšíš, že se ti klidní dech.';
          break;

      case 'HANG NOTHING 12':
          text = 'Soustředíš se na to,\r\n';
          text += 'co vidíš před sebou.';
          break;

      //AUBREY//
      case 'AUBREY NOTHING': //AUBREY NOTHING
        text = user.name() + ' ti plive na boty.';
        break;

      case 'AUBREY TAUNT': //AUBREY TAUNT
        text = user.name() + ' nadává ' + target.name() + ' do slabocha!\r\n';
        text += target.name() + " se VZTEKÁ!";
        break;

      //THE HOOLIGANS//
      case 'CHARLIE ATTACK': //HOOLIGANS CHARLIE ATTACK
        text = 'ŠÁRA útočí ze všeech sil!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL ATTACK': //HOOLIGANS ANGEL ATTACK
        text = 'ANDĚL kvapile vráží do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK CHARM': //HOOLIGANS MAVERICK CHARM
        text = 'STŘEMHLAV mrká na ' + target.name() + '!\r\n';
        text += target.name() + ' ztrácí na ÚTOKU.'
        break;

      case 'KIM HEADBUTT': //HOOLIGANS KIM HEADBUTT
        text = 'KIM hlavou naráží do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE CANDY': //HOOLIGANS VANCE CANDY
        text = 'VANCE háže bonbóny!\r\n';
        text += hpDamageText;
        break;

      case 'HOOLIGANS GROUP ATTACK': //THE HOOLIGANS GROUP ATTACK
        text = user.name() + ' do toho dávají vše!\r\n';
        text += hpDamageText;
        break;

      //BASIL//
      case 'BASIL ATTACK': //BASIL ATTACK
        text = user.name() + ' sahá dovnitř ' + target.name() + 'HO.\r\n';
        text += hpDamageText;
        break;

      case 'BASIL NOTHING': //BASIL NOTHING
        text = user.name() + 'OVY oči jsou slzama celé rudé.';
        break;

      case 'BASIL PREMPTIVE STRIKE': //BASIL PREMPTIVE STRIKE
        text = user.name() + ' řeže ' + target.name() +'HO ruku.\r\n';
        text += hpDamageText;
        break;

      //BASIL'S SOMETHING//
      case 'B SOMETHING ATTACK': //BASIL'S SOMETHING ATTACK
        text = user.name() + ' dusí ' + target.name() + 'HO.\r\n';
        text += hpDamageText;
        break;

      case 'B SOMETHING TAUNT': //BASIL'S SOMETHING TAUNT BASIL
        text = user.name() + ' sahá dovnitř ' + target.name() + 'HO.\r\n';
        break;

      //PLAYER SOMETHING BASIL FIGHT//
      case 'B PLAYER SOMETHING STRESS': //B PLAYER SOMETHING STRESS
        text = user.name() + ' něco dělá\r\n';
        text += target.name() + 'MU.\r\n';
        text += hpDamageText;
        break;

      case 'B PLAYER SOMETHING HEAL': //B PLAYER SOMETHING HEAL
        text = user.name() + ' zaplavuje ' + target.name() + 'HO rány.\r\n';
        text += hpDamageText;
        break;

      case 'B OMORI SOMETHING CONSUME EMOTION': //B OMORI SOMETHING CONSUME EMOTION
        text = user.name() + ' požírá ' + target.name() + 'HO EMOCE.';
        break;

      //CHARLIE//
      case 'CHARLIE RELUCTANT ATTACK': //CHARLIE RELUCTANT ATTACK
        text = user.name() + ' bije do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'CHARLIE NOTHING': //CHARLIE NOTHING
        text = user.name() + ' stojí, jako tvrdé Y.';
        break;

      case 'CHARLIE LEAVE': //CHARLIE LEAVE
        text = user.name() + ' toho nechala.';
        break;

      //ANGEL//
      case 'ANGEL ATTACK': //ANGEL ATTACK
        text = user.name() + ' zběsile kope do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL NOTHING': //ANGEL NOTHING
        text = user.name() + ' udělá otočku a zapózuje!';
        break;

      case 'ANGEL QUICK ATTACK': //ANGEL QUICK ATTACK
        text = user.name() + ' se náhle objeví za ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL TEASE': //ANGEL TEASE
        text = user.name() + ' říká nehezké věci o ' + target.name() + '!';
        break;

      //THE MAVERICK//
      case 'MAVERICK ATTACK': //THE MAVERICK ATTACK
        text = user.name() + ' vráží do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK NOTHING': //THE MAVERICK NOTHING
        text = user.name() + ' se chvástá před\r\n';
        text += 'svými věrnými fanoušky!';
        break;

      case 'MAVERICK SMILE': //THE MAVERICK SMILE
        text = user.name() + ' se svůdně usmívá!\r\n';
        text += target.name() + ' ztrácí na ÚTOKU.';
        break;

      case 'MAVERICK TAUNT': //THE MAVERICK TAUNT
        text = user.name() + ' si utahuje z\r\n';
        text += target.name() + '!\r\n';
        text += target.name() + " se VZTEKÁ!"
        break;

      //KIM//
      case 'KIM ATTACK': //KIM ATTACK
        text = user.name() + ' bije do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'KIM NOTHING': //KIM DO NOTHING
        text = user.name() + ' zvoní její telefon...\r\n';
        text += 'Někdo si spletl číslo.';
        break;

      case 'KIM SMASH': //KIM SMASH
        text = user.name() + ' chytá ' + target.name() + 'za tričko\r\n';
        text += 'a vráží mu do obličeje!\r\n';
        text += hpDamageText;
        break;

      case 'KIM TAUNT': //KIM TAUNT
        text = user.name() + ' si utahuje z ' + target.name() + '!\r\n';
        text += target.name() + " má SMUTEK.";
        break;

      //VANCE//
      case 'VANCE ATTACK': //VANCE ATTACK
        text = user.name() + ' bije do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE NOTHING': //VANCE NOTHING
        text = user.name() + ' se škrábe na břiše.';
        break;

      case 'VANCE CANDY': //VANCE CANDY
        text = user.name() + ' háže staré bonbóny po ' + target.name() + '!\r\n';
        text += 'Fuj... Lepí...\r\n';
        text += hpDamageText;
        break;

      case 'VANCE TEASE': //VANCE TEASE
        text = user.name() + ' říká nehezké věci o ' + target.name() + '!\r\n';
        text += target.name() + " má SMUTEK."
        break;

      //JACKSON//
      case 'JACKSON WALK SLOWLY': //JACKSON WALK SLOWLY
        text = user.name() + ' se k tobě pomalu přibližuje...\r\n';
        text += 'Cítíš se, jako by mu nebylo úniku!';
        break;

      case 'JACKSON KILL': //JACKSON AUTO KILL
        text = user.name() + ' TĚ CHYTL!!!\r\n';
        text += 'Celý život se ti mihnul před očima!';
        break;

      //RECYCLEPATH//
      case 'R PATH ATTACK': //RECYCLEPATH ATTACK
        text = user.name() + ' háže pytel po ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'R PATH SUMMON MINION': //RECYCLEPATH SUMMON MINION
        text = user.name() + ' svolává věřící!\r\n';
        text += 'Objevil se RECYKLOSEKTAŘ!';
        break;

      case 'R PATH FLING TRASH': //RECYCLEPATH FLING TRASH
        text = user.name() + ' hází všechen svůj ODPAD\r\n';
        text += 'po ' + target.name() + '!\r\n'
        text += hpDamageText;
        break;

      case 'R PATH GATHER TRASH': //RECYCLEPATH GATHER TRASH
        text = user.name() + ' sbírá ODPAD!';
        break;

    //SOMETHING IN THE CLOSET//
      case 'CLOSET ATTACK': //SOMETHING IN THE CLOSET ATTACK
        text = user.name() + ' táhne ' + target.name() + 'HO pryč!\r\n';
        text += hpDamageText;
        break;

      case 'CLOSET NOTHING': //SOMETHING IN THE CLOSET DO NOTHING
        text = user.name() + ' zlověstně šeptá.';
        break;

      case 'CLOSET MAKE AFRAID': //SOMETHING IN THE CLOSET MAKE AFRAID
        text = user.name() + ' zná tvé tajemsví!';
        break;

      case 'CLOSET MAKE WEAK': //SOMETHING IN THE CLOSET MAKE WEAK
        text = user.name() + ' pokouší ' + target.name() + 'HO touhu nadále žít!';
        break;

    //BIG STRONG TREE//
      case 'BST SWAY': //BIG STRONG TREE NOTHING 1
        text = 'Něžný vánek prohání listy.';
        break;

      case 'BST NOTHING': //BIG STRONG TREE NOTHING 2
        text = user.name() + ' stojí pevně namístě,\r\n';
        text += 'protože je strom.';
        break;

    //DREAMWORLD FEAR EXTRA BATTLES//
    //HEIGHTS//
    case 'DREAM HEIGHTS ATTACK': //DREAM FEAR OF HEIGHTS ATTACK
      text = user.name() + ' údeří do ' + target.name() + 'HO.\r\n';
      text += hpDamageText;
      break;

    case 'DREAM HEIGHTS GRAB': //DREAM FEAR OF HEIGHTS GRAB
      if(target.index() <= unitLowestIndex) {
        text = 'Objevily se ruce, chytajíce všechny!\r\n';
        text += 'Všichni' + ' ztrácí na útoku..';
      }

      break;

    case 'DREAM HEIGHTS HANDS': //DREAM FEAR OF HEIGHTS HANDS
      text = 'Objevily se další ruce, chytajíce\r\n';
      text += user.name() + 'HO.\r\n';
      if(!target._noStateMessage) {text += user.name() + ' přibyla OBRANA!';}
      else {text += parseNoStateChange(user.name(), "OBRANA", "vyšší!")}
      break;

    case 'DREAM HEIGHTS SHOVE': //DREAM FEAR OF HEIGHTS SHOVE
      text = user.name() + ' strká do ' + target.name() + 'HO.\r\n';
      text += hpDamageText + '\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI"){text += target.name() + ' má STRACH.';}
      else {text += parseNoEffectEmotion(target.name(), "STRACH")}
      break;

    case 'DREAM HEIGHTS RELEASE ANGER': //DREAM FEAR OF HEIGHTS RELEASE ANGER
      text = user.name() + ' si na všech vybíjí VZTEK!';
      break;

    //SPIDERS//
    case 'DREAM SPIDERS CONSUME': //DREAM FEAR OF SPIDERS CONSUME
      text = user.name() + ' se schoulil a snědl ' + target.name() + 'HO.\r\n';
      text += hpDamageText;
      break;

    //DROWNING//
    case 'DREAM DROWNING SMALL': //DREAM FEAR OF DROWNING SMALL
      text = 'Všem se těžko dýchá.';
      break;

    case 'DREAM DROWNING BIG': //DREAM FEAR OF DROWNING BIG
      text = 'Všichni jsou na omdlení.';
      break;

    // BLACK SPACE EXTRA //
    case 'BS LIAR': // BLACK SPACE LIAR
      text = 'Lháři.';
      break;

    //BACKGROUND ACTORS//
    //BERLY//
      case 'BERLY ATTACK': //BERLY ATTACK
        text = 'BERLY hlavou naráží do ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BERLY NOTHING 1': //BERLY NOTHING 1
        text = 'BERLY se statečně schovává v koutě.';
        break;

      case 'BERLY NOTHING 2': //BERLY NOTHING 2
        text = 'BERLY si nasazuje brýle.';
        break;

      //TOYS//
      case 'CAN':  // CAN
        text = user.name() + ' kope do PLECHOVKY.';
        break;

      case 'DANDELION':  // DANDELION
        text = user.name() + ' fouká na PAMPELIŠKU.\r\n';
        text += user.name() + ' se opět cítí být ' + (switches.value(6) ? 'sama' : 'sám') + 'sebou.';
        break;

      case 'DYNAMITE':  // DYNAMITE
        text = user.name() + ' vrhá DYNAMIT!';
        break;

      case 'LIFE JAM':  // LIFE JAM
        text = user.name() + ' natírá KAŠI ŽIVÝM DŽEMEM!\r\n';
        text += 'TOAST became ' + target.name() + '!';
        break;

      case 'PRESENT':  // PRESENT
        text = target.name() + ' otevírá DÁREK\r\n';
        text += 'Bylo to pro ' + target.name() + 'zklamání...\r\n';
        if(!target._noEffectMessage){text += target.name() + ' se VZTEKÁ! ';}
        else {text += parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
        break;

      case 'SILLY STRING':  // DYNAMITE
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' uses SILLY STRING!\r\n';
          text += 'JUPÍ!! Jde se slavit!\r\n';
          text += 'Všichni mají RADOST! ';
        }
        break;

      case 'SPARKLER':  // SPARKLER
        text = user.name() + ' zapaluje PRSKAVKU!\r\n';
        text += 'JUPÍ!! Jde se slavit!\r\n';
        if(!target._noEffectMessage){text += target.name() + ' má RADOST!';}
        else {text += parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
        break;

      case 'COFFEE': // COFFEE
        text = user.name() + ' pije KAFE...\r\n';
        text += user.name() + ' se cítí SKVĚLE!';
        break;

      case 'RUBBERBAND': // RUBBERBAND
        text = user.name() + ' letí po ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //OMORI BATTLE//

      case "OMORI ERASES":
        text = user.name() + " maže protivníka.\r\n";
        text += hpDamageText;
        break;

      case "MARI ATTACK":
        text = user.name() + " maže protivníka.\r\n";
        text += target.name() + " má STRACH.\r\n";
        text += hpDamageText;
        break;

      //STATES//
      case 'HAPPY':
        if(!target._noEffectMessage){text = target.name() + ' má RADOST!';}
        else {text = parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
        break;

      case 'ECSTATIC':
        if(!target._noEffectMessage){text = target.name() + ' prožívá NADŠENÍ!!';}
        else {text = parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
        break;

      case 'MANIC':
        if(!target._noEffectMessage){text = target.name() + ' prožívá MÁNII!!!';}
        else {text = parseNoEffectEmotion(target.name(), "ŠŤASTNĚJŠÍ!")}
        break;

      case 'SAD':
        if(!target._noEffectMessage){text = target.name() + ' má SMUTEK.';}
        else {text = parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
        break;

      case 'DEPRESSED':
        if(!target._noEffectMessage){text = target.name() + ' má DEPRESE..';}
        else {text = parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
        break;

      case 'MISERABLE':
        if(!target._noEffectMessage){text = target.name() + ' se cítí MIZERNĚ...';}
        else {text = parseNoEffectEmotion(target.name(), "SMUTNĚJŠÍ!")}
        break;

      case 'ANGRY':
        if(!target._noEffectMessage){text = target.name() + ' se VZTEKÁ!';}
        else {text = parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
        break;

      case 'ENRAGED':
        if(!target._noEffectMessage){text = target.name() + ' ZUŘÍ!!';}
        else {text = parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
        break;

      case 'FURIOUS':
        if(!target._noEffectMessage){text = target.name() + ' BĚSNÍ!!!'}
        else {text = parseNoEffectEmotion(target.name(), "VZTEKLEJŠÍ!")}
        break;

      case 'AFRAID':
        if(!target._noEffectMessage){text = target.name() + ' má STRACH!';}
        else {text = parseNoEffectEmotion(target.name(), "VYSTRAŠENĚJŠÍ")}
        break;

      case 'CANNOT MOVE':
        text = target.name() + ' se nemůže hýbat! ';
        break;

      case 'INFATUATION':
        text = target.name() + ' je láskou znehybněn! ';
        break;

    //SNALEY//
    case 'SNALEY MEGAPHONE': // SNALEY MEGAPHONE
      if(target.index() <= unitLowestIndex) {text = user.name() + ' troubí KLAKSONEM!\r\n';}
      if(target.isStateAffected(16)) {text += target.name() + ' BĚSNÍ!!!\r\n'}
      else if(target.isStateAffected(15)) {text += target.name() + ' ZUŘÍ!!\r\n'}
      else if(target.isStateAffected(14)) {text += target.name() + ' se VZTEKÁ!\r\n'}
      break;

  }
  // Return Text
  return text;
};
//=============================================================================
// * Display Custom Action Text
//=============================================================================
Window_BattleLog.prototype.displayCustomActionText = function(subject, target, item) {
  // Make Custom Action Text
  var text = this.makeCustomActionText(subject, target, item);
  // If Text Length is more than 0
  if (text.length > 0) {
    if(!!this._multiHitFlag && !!item.isRepeatingSkill) {return;}
    // Get Get
    text = text.split(/\r\n/);
    for (var i = 0; i < text.length; i++) { this.push('addText', text[i]); }
    // Add Wait
    this.push('wait', 15);

  }
  if(!!item.isRepeatingSkill) {this._multiHitFlag = true;}
};
//=============================================================================
// * Display Action
//=============================================================================
Window_BattleLog.prototype.displayAction = function(subject, item) {
  // Return if Item has Custom Battle Log Type
  if (item.meta.BattleLogType) { return; }
  // Run Original Function
  _TDS_.CustomBattleActionText.Window_BattleLog_displayAction.call(this, subject, item);
};
//=============================================================================
// * Display Action Results
//=============================================================================
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
  // Get Item Object
  var item = BattleManager._action._item.object();
  // If Item has custom battle log type
  if (item && item.meta.BattleLogType) {
    // Display Custom Action Text
    this.displayCustomActionText(subject, target, item);
    // Return
  }
  // Run Original Function
  else {
    _TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults.call(this, subject, target);
  }
};

const _old_window_battleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage
Window_BattleLog.prototype.displayHpDamage = function(target) {
  let result = target.result();
  if(result.isHit() && result.hpDamage > 0) {
    if(!!result.elementStrong) {
      this.push("addText","...It was a moving attack!");
      this.push("waitForNewLine");
    }
    else if(!!result.elementWeak) {
      this.push("addText", "...It was a dull attack!");
      this.push("waitForNewLine")
    }
  }
  return _old_window_battleLog_displayHpDamage.call(this, target)
};

//=============================================================================
// * CLEAR
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_endAction= Window_BattleLog.prototype.endAction;
Window_BattleLog.prototype.endAction = function() {
  _TDS_.CustomBattleActionText.Window_BattleLog_endAction.call(this);
  this._multiHitFlag = false;
};

//=============================================================================
// * DISPLAY ADDED STATES
//=============================================================================
