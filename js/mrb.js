/* DO NOT CHANGE THIS LINE */ if(!window.rebindRules){window.rebindRules=new Set();} /* DO NOT CHANGE THIS LINE */ 
//// PUT RULES BELOW THIS LINE
/// NOTE THAT FOR EACH BACK SLASH YOU NEED TWO
/// USE RULE IDENTIFIERS
/// format: [macro, newText, predicate?, priority?]
/// note that priority is MANDATORY when predicate is provided.
// Example rules: 
// rebindRules.add(["kel", "\\n<DW KEL>"]);
// rebindRules.add(["kel", "\\n<FA KEL>", () => $gameVariables.value(22)===2, 1]);
rebindRules.add(["aub","\\n<AUBRY>"]);
rebindRules.add(["art","\\n<MALÍŘKA>"]);
rebindRules.add(["spxh","\\n<VESMÍRNÝ EX-MANŽEL>"]);
rebindRules.add(["mai", "\\n<POŠTOVNÍ SCHRÁNKA>"]);
rebindRules.add(["smm","\\n<KLÍČKOKRTEK MICHAL>"]);
rebindRules.add(["jaw","\\n<PAN CENIL>"]);
rebindRules.add(["mav","\\n<STŘEMHLAV>"]);
rebindRules.add(["spg","\\n<VESMÍRNÝ PIRÁT>"]);
rebindRules.add(["spd","\\n<VESMÍRNÝ CÁPEK>"]);
rebindRules.add(["spb","\\n<VESMÍRNÝ KÁMOŠ>"]);
rebindRules.add(["wis","\\n<MOUDRÝ KÁMEN>"]);
rebindRules.add(["eye","\\n<OBČA>"]);
rebindRules.add(["ban","\\n<OFČA>"]);
rebindRules.add(["gra","\\n<BASILOVA BABIČKA>"]);
rebindRules.add(["kit","\\n<KLUK S DRAKEM>"]);
rebindRules.add(["tvg","\\n<TELEKUKAČKA>"]);
rebindRules.add(["sha","\\n<PODEZŘELÝ KRTEK>"]);
rebindRules.add(["may","\\n<STAROSTA>"]);
rebindRules.add(["sle","\\n<SPÍCÍ KRTEK>"]);
rebindRules.add(["spo","\\n<SPORTOVNÍ KRTEK>"]);
rebindRules.add(["che","\\n<KUCHAŘ>"]);
rebindRules.add(["spr","\\n<KLÍČKOKRTEK>"]);
rebindRules.add(["ban","\\n<KRTEK BANDITA>"]);
rebindRules.add(["smo","\\n<MALÍK>"]);
rebindRules.add(["sou","\\n<ZÁSTUPCE ŠÉFKUCHAŘE>"]);
rebindRules.add(["tea","\\n<UČITEL>"]);
rebindRules.add(["st1","\\n<ŽÁK 1>"]);
rebindRules.add(["st2","\\n<ŽÁK 2>"]);
rebindRules.add(["st3","\\n<ŽÁK 3>"]);
rebindRules.add(["dun","\\n<HLOUPÝ KRTEK>"]);
rebindRules.add(["lau","\\n<MYCÍ KRTEK>"]);
rebindRules.add(["squ","\\n<KRYCHLOKRTEK>"]);
rebindRules.add(["dm1","\\n<JÍDLOKRTEK 1>"]);
rebindRules.add(["dm2","\\n<JÍDLOKRTEK 2>"]);
rebindRules.add(["dm3","\\n<JÍDLOKRTEK 3>"]);
rebindRules.add(["mm1","\\n<KLÍČKOKRTEK>"]);
rebindRules.add(["mm2","\\n<KLÍČKOKRTEK>"]);
rebindRules.add(["sp1","\\n<VESMÍRNÁ POSÁDKA 1>"]);
rebindRules.add(["sp2","\\n<VESMÍRNÁ POSÁDKA 2>"]);
rebindRules.add(["sp3","\\n<VESMÍRNÁ POSÁDKA 3>"]);
rebindRules.add(["ear","\\n<PLANETA ZEMĚ>"]);
rebindRules.add(["sbf","\\n<VESMÍRNÝ MILENEC>"]);
rebindRules.add(["sxbf","\\n<VESMÍRNÝ EX-MILENEC>"]);
rebindRules.add(["cap","\\n<KAPITÁN VESMÍRŇÁK>"]);
rebindRules.add(["sxhb","\\n<VESMÍRNÝ EX-MANŽEL>"]);
rebindRules.add(["shb","\\n<VESMÍRNÝ MANŽEL>"]);
/// DO NOT CHANGE ANYTHING BELOW THIS LINE
if (!window.rebindInstalled) {
    (function() {
        let rules = {};
        let lastRefreshSize = 0;
    
        let og = {
            MsgMacro: Yanfly.MsgMacro,
            MsgMacroRef: Yanfly.MsgMacroRef
        }
    
        let lut = {};
    
        window.rebindRefresh = function() {
            if (lastRefreshSize === window.rebindRules.size) return;
            
            rules = {};
            lut = {};
            for (let i in og.MsgMacroRef) {
                lut[og.MsgMacroRef[i]] = i;
                rules[i] = {
                    base: og.MsgMacro[og.MsgMacroRef[i]],
                    predicate: []
                }
            }
    
            window.rebindRules.forEach(function(value) {
                if (value.length === 2) { // BASE RULE
                    rules[value[0].toUpperCase()].base = value[1];
                } else {
                    rules[value[0].toUpperCase()].predicate.push({
                        priority: value[3]||0,
                        value: value[1],
                        predicate: value[2]
                    });
                }
            });
    
            console.log(rules, lut);
        }
    
        Yanfly.MsgMacro = new Proxy(Yanfly.MsgMacro, {
            get(target, symbol) {
                if(rules[lut[symbol]]) {
                    let predicateRules = rules[lut[symbol]].predicate;
                    let predicateResults = [];
                    for (let rule of predicateRules) {
                        predicateResults.push([
                            rule.predicate(),
                            rule.priority,
                            rule.value
                        ]);
                    }
    
                    predicateResults = predicateResults.filter(value => value[0]);
                    predicateResults.sort((a,b) => a[1] - b[1]);
                    
                    if (predicateResults.length > 0) {
                        return predicateResults[predicateResults.length - 1][2];
                    } else {
                        return rules[lut[symbol]].base;
                    }
                } else {
                    return Reflect.get(...arguments);
                }
            }
        })
    
        window.rebindInstalled = true;
    })();
    }
    window.rebindRefresh();