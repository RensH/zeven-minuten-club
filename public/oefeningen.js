/* Zeven Minuten Club — oefeningenbibliotheek, poppetje en dagworkout-generator.
   Poses zijn hoeken (graden): 0 = recht omlaag, 90 = naar rechts (vooruit), 180 = omhoog, -90 = naar links.
   Het poppetje kijkt naar rechts. t = romp (bekken -> nek), a1/a2 = [bovenarm, onderarm], l1/l2 = [dij, scheen].
   1 = dichtstbijzijnde ledemaat (donker), 2 = verste (licht). air = hoogte boven de grond. */
(function(){
const L = {torso:26, ua:12.5, fa:11, th:19.5, sh:19.5, foot:6.2};
const GROUND = 92;

// Basisposes om te hergebruiken
const STAND = {t:180, a1:[8,12], a2:[-8,-4], l1:[3,0], l2:[-3,0]};
const P = (o) => Object.assign({}, STAND, o);
const PLANK = {t:96, a1:[0,0], a2:[0,0], l1:[-84,-84], l2:[-84,-84]};
const PL = (o) => Object.assign({}, PLANK, o);
const BACK = {t:-90, a1:[90,90], a2:[90,90], l1:[140,-5], l2:[140,-5]}; // op de rug, hoofd links, knieën gebogen
const BK = (o) => Object.assign({}, BACK, o);
const QUAD = {t:90, a1:[0,0], a2:[0,0], l1:[0,-90], l2:[0,-90]}; // handen en knieën
const Q = (o) => Object.assign({}, QUAD, o);
const FRONT = {t:180, a1:[18,10], a2:[-18,-10], l1:[6,0], l2:[-6,0]}; // vooraanzicht
const F = (o) => Object.assign({}, FRONT, o);

// cat: c = cardio, l = benen & billen, u = armen & bovenlijf, k = buik & core
// jump: springt (valt weg bij "zonder springen"), side: wissel halverwege van kant, prop: stoel/muur
const EX = [
  // ---------- CARDIO ----------
  {id:"jacks", n:"Jumping jacks", c:"c", jump:1, view:"front", tip:"Spring armen en benen tegelijk wijd en weer terug. Land zacht op je voorvoeten.", easy:"Stap om en om opzij in plaats van te springen.",
    A:F({}), B:F({a1:[150,165], a2:[-150,-165], l1:[22,22], l2:[-22,-22], air:3})},
  {id:"highknees", n:"Hoge knieën", c:"c", tip:"Ren op de plaats en trek je knieën tot heuphoogte. Pomp mee met je armen.", easy:"Wandel in plaats van te rennen, knieën nog steeds hoog.",
    A:P({a1:[-35,40], a2:[35,130], l1:[95,0], l2:[-2,0], air:2}), B:P({a1:[35,130], a2:[-35,40], l1:[-2,0], l2:[95,0], air:2}),
    K:[P({a1:[-35,40], a2:[35,130], l1:[95,0], l2:[-2,0], air:2}), P({a1:[-5,30], a2:[5,40], l1:[2,0], l2:[-2,0], air:1}), P({a1:[35,130], a2:[-35,40], l1:[-2,0], l2:[95,0], air:2}), P({a1:[-5,30], a2:[5,40], l1:[2,0], l2:[-2,0], air:1})], seg:0.2},
  {id:"buttkicks", n:"Hielen naar billen", c:"c", tip:"Ren op de plaats en tik met je hielen tegen je billen. Bovenlijf rechtop.", easy:"Doe het wandelend, één been per keer.",
    A:P({a1:[-30,35], a2:[30,120], l1:[-8,-165], l2:[0,0], air:2}), B:P({a1:[30,120], a2:[-30,35], l1:[0,0], l2:[-8,-165], air:2}),
    K:[P({a1:[-30,35], a2:[30,120], l1:[-8,-165], l2:[0,0], air:2}), P({a1:[-5,30], a2:[5,40], l1:[2,0], l2:[-2,0], air:1}), P({a1:[30,120], a2:[-30,35], l1:[0,0], l2:[-8,-165], air:2}), P({a1:[-5,30], a2:[5,40], l1:[2,0], l2:[-2,0], air:1})], seg:0.2},
  {id:"climbers", n:"Mountain climbers", c:"c", tip:"Steunpositie op je handen. Trek om en om je knie naar je borst, heupen laag.", easy:"Zet je handen op een stoel of bank.",
    A:PL({l1:[72,-58]}), B:PL({l2:[72,-58]}), speed:0.5},
  {id:"burpees", n:"Burpees", c:"c", jump:1, tip:"Hurk, handen op de grond, spring naar plank, terug naar hurkzit en spring omhoog.", easy:"Stap naar achteren en weer terug, sla de sprong over.",
    A:P({a1:[170,178], a2:[165,175], air:5}), B:{t:120, a1:[12,6], a2:[6,0], l1:[100,-25], l2:[96,-25]},
    K:[P({}), {t:150, a1:[30,20], a2:[26,16], l1:[70,-25], l2:[66,-25]}, {t:122, a1:[10,4], a2:[6,0], l1:[108,-22], l2:[104,-22]}, PL({}), {t:122, a1:[10,4], a2:[6,0], l1:[108,-22], l2:[104,-22]}, {t:150, a1:[90,90], a2:[86,86], l1:[70,-25], l2:[66,-25]}, P({a1:[172,178], a2:[168,176], air:8}), P({a1:[120,150], a2:[116,146]})], seg:0.4},
  {id:"squatjacks", n:"Squat jacks", c:"c", jump:1, view:"front", tip:"Spring van smalle stand naar een brede squat en weer terug. Handen voor je borst.", easy:"Stap opzij naar de squat in plaats van te springen.",
    A:F({a1:[25,-115], a2:[-25,115], l1:[5,0], l2:[-5,0]}), B:F({a1:[25,-115], a2:[-25,115], l1:[78,16], l2:[-78,-16]}),
    K:[F({a1:[25,-115], a2:[-25,115], l1:[8,2], l2:[-8,-2]}), F({a1:[28,-112], a2:[-28,112], l1:[26,14], l2:[-26,-14], air:9}), F({a1:[25,-115], a2:[-25,115], l1:[78,16], l2:[-78,-16]}), F({a1:[28,-112], a2:[-28,112], l1:[26,14], l2:[-26,-14], air:9})], seg:0.32},
  {id:"boxing", n:"Schaduwboksen", c:"c", tip:"Lichte spreidstand, stoot snel om en om recht vooruit. Blijf op je voorvoeten veren.", easy:"Rustiger tempo, focus op een rechte stoot.",
    A:P({a1:[90,90], a2:[45,165], l1:[18,4], l2:[-16,-2]}), B:P({a1:[45,165], a2:[90,90], l1:[18,4], l2:[-16,-2]}), speed:0.45},
  {id:"jumpsquats", n:"Squat jumps", c:"c", jump:1, tip:"Zak in een squat en spring explosief omhoog. Land zacht en zak direct weer door.", easy:"Kom op je tenen in plaats van te springen.",
    A:{t:136, a1:[-30,-20], a2:[-25,-15], l1:[102,-34], l2:[100,-34]}, B:P({a1:[160,170], a2:[155,165], air:9}), speed:0.9},
  {id:"jumplunges", n:"Sprong-lunges", c:"c", jump:1, tip:"Vanuit een lunge spring je omhoog en wissel je in de lucht van been.", easy:"Wissel stappend van been, zonder sprong.",
    A:P({a1:[-30,20], a2:[40,120], l1:[85,0], l2:[-15,-88]}), B:P({a1:[40,120], a2:[-30,20], l1:[-15,-88], l2:[85,0]}),
    K:[P({a1:[-30,20], a2:[40,120], l1:[85,0], l2:[-15,-88]}), P({a1:[10,60], a2:[10,60], l1:[30,-20], l2:[20,-30], air:9}), P({a1:[40,120], a2:[-30,20], l1:[-15,-88], l2:[85,0]}), P({a1:[10,60], a2:[10,60], l1:[20,-30], l2:[30,-20], air:9})], seg:0.45},

  // ---------- BENEN & BILLEN ----------
  {id:"squats", n:"Squats", c:"l", tip:"Voeten op heupbreedte, billen naar achteren, knieën boven je tenen. Borst omhoog.", easy:"Zak minder diep of tik met je billen een stoel aan.",
    A:P({a1:[90,90], a2:[88,88]}), B:{t:136, a1:[92,92], a2:[90,90], l1:[102,-34], l2:[100,-34]}},
  {id:"pulsesquats", n:"Pulserende squats", c:"l", tip:"Blijf onderin de squat en veer klein op en neer. Niet helemaal omhoogkomen.", easy:"Neem af en toe een korte pauze bovenin.",
    A:{t:140, a1:[92,92], a2:[90,90], l1:[92,-30], l2:[90,-30]}, B:{t:136, a1:[92,92], a2:[90,90], l1:[104,-35], l2:[102,-35]}, speed:0.4},
  {id:"sumo", n:"Sumo squats", c:"l", view:"front", tip:"Brede stand, tenen naar buiten. Zak recht naar beneden, knieën naar buiten duwen.", easy:"Zak minder diep.",
    A:F({a1:[25,-115], a2:[-25,115], l1:[22,16], l2:[-22,-16]}), B:F({a1:[25,-115], a2:[-25,115], l1:[80,16], l2:[-80,-16]})},
  {id:"wallsit", n:"Wall sit", c:"l", prop:"wall", tip:"Rug plat tegen de muur, knieën in 90 graden. Volhouden en rustig doorademen.", easy:"Zak minder diep, bijvoorbeeld tot 45 graden.",
    A:{t:180, a1:[30,175], a2:[25,170], l1:[90,0], l2:[88,0]}, B:{t:180, a1:[30,170], a2:[25,165], l1:[90,0], l2:[88,0]}, hold:1},
  {id:"lunges", n:"Lunges", c:"l", tip:"Grote stap vooruit, zak tot je achterste knie bijna de grond raakt. Wissel af.", easy:"Kleinere stap en minder diep.",
    A:P({a1:[0,0], a2:[0,0]}), B:P({a1:[0,0], a2:[0,0], l1:[85,0], l2:[-12,-88]})},
  {id:"revlunges", n:"Achterwaartse lunges", c:"l", tip:"Stap naar achteren en zak recht naar beneden. Gewicht op je voorste hiel. Wissel af.", easy:"Houd je vast aan een stoel voor balans.",
    A:P({a1:[30,150], a2:[25,150]}), B:P({a1:[30,150], a2:[25,150], l1:[85,0], l2:[-12,-88]})},
  {id:"sidelunges", n:"Zijwaartse lunges", c:"l", view:"front", tip:"Grote stap opzij, buig dat been en duw je billen naar achteren. Ander been gestrekt.", easy:"Kleinere stap opzij.",
    A:F({a1:[25,-115], a2:[-25,115]}), B:F({t:174, a1:[25,-115], a2:[-25,115], l1:[72,-4], l2:[-50,-50]}), speed:1.1},
  {id:"stepups", n:"Step-ups op een stoel", c:"l", prop:"stepbox", side:1, tip:"Zet één voet op een stevige stoel of traptree en stap omhoog. Halverwege van been wisselen.", easy:"Gebruik de onderste traptree.",
    A:P({a1:[25,40], a2:[-25,-15], l1:[72,-12], l2:[-2,0]}), B:P({a1:[-25,-15], a2:[25,40], l1:[0,0], l2:[-15,-55], air:12})},
  {id:"calfraises", n:"Kuitheffen", c:"l", tip:"Kom zo hoog mogelijk op je tenen en zak rustig terug. Houd je evt. vast aan de muur.", easy:"Op twee benen, rustig tempo.",
    A:P({}), B:P({air:4, f1:40, f2:40}), speed:0.7},
  {id:"bridge", n:"Bruggetje", c:"l", tip:"Op je rug, voeten plat. Duw je heupen omhoog en knijp je billen samen. Rustig terug.", easy:"Kleinere beweging, voeten dichter bij je billen.",
    A:BK({}), B:BK({t:-62, l1:[118,-2], l2:[118,-2]})},
  {id:"slbridge", n:"Bruggetje op één been", c:"l", side:1, tip:"Als het bruggetje, maar met één been gestrekt. Heupen blijven recht. Halverwege wisselen.", easy:"Gewone bruggetjes met twee voeten.",
    A:BK({l1:[120,120]}), B:BK({t:-62, l1:[100,100], l2:[118,-2]})},
  {id:"donkey", n:"Donkey kicks", c:"l", side:1, tip:"Op handen en knieën. Duw één voet met gebogen knie richting plafond. Halverwege wisselen.", easy:"Minder hoog, rug blijft recht.",
    A:Q({}), B:Q({l1:[-96,-186]})},
  {id:"sideleg", n:"Zijwaarts been heffen", c:"l", side:1, view:"front", tip:"Op je zij liggend, til je bovenste been gestrekt omhoog en laat het gecontroleerd zakken.", easy:"Kleinere beweging.",
    A:{t:-90, a1:[96,92], a2:[-92,-92], l1:[92,92], l2:[90,90]}, B:{t:-90, a1:[96,92], a2:[-92,-92], l1:[128,128], l2:[90,90]}},
  {id:"goodmorning", n:"Good mornings", c:"l", tip:"Armen gekruist voor je borst, knieën licht gebogen. Buig vanuit je heupen voorover met een rechte rug; je benen blijven staan.", easy:"Minder ver voorover.",
    A:P({a1:[22,150], a2:[18,146], l1:[6,-3], l2:[4,-3]}), B:P({t:104, a1:[-54,74], a2:[-58,70], l1:[6,-3], l2:[4,-3]})},

  {id:"hipthrust", n:"Hip thrusts tegen de bank", c:"l", prop:"backbench", tip:"Schouderbladen tegen de rand van een bank, voeten plat. Duw je heupen omhoog tot je lichaam recht is en knijp je billen samen.", easy:"Doe gewone bruggetjes op de grond.",
    A:{t:-122, a1:[-80,-95], a2:[-82,-95], l1:[118,-2], l2:[116,-2]}, B:{t:-92, a1:[-60,-95], a2:[-62,-95], l1:[95,0], l2:[93,0]}},
  {id:"bridgepulse", n:"Bruggetje pulsen", c:"l", tip:"Kom omhoog in de brug en blijf daar. Beweeg je heupen in kleine, snelle pulsen op en neer zonder te gaan liggen.", easy:"Gewone bruggetjes in rustig tempo.",
    A:BK({t:-66, l1:[120,-2], l2:[120,-2]}), B:BK({t:-58, l1:[114,-4], l2:[114,-4]}), speed:0.4},
  {id:"bridgemarch", n:"Bruggetje met marcheren", c:"l", tip:"Houd je heupen omhoog in de brug en til om en om een knie op. Heupen blijven recht en hoog.", easy:"Gewone bruggetjes.",
    A:BK({t:-62, l1:[118,-2], l2:[118,-2]}), B:BK({t:-62, l1:[165,95], l2:[118,-2]}), speed:0.8},
  {id:"kickback", n:"Staande kickbacks", c:"l", side:1, tip:"Handen op je heupen of tegen de muur. Duw één been gestrekt naar achteren en knijp je bil aan. Halverwege wisselen.", easy:"Kleinere beweging.",
    A:P({t:172, a1:[25,140], a2:[20,140], l1:[2,0], l2:[-2,0]}), B:P({t:165, a1:[25,140], a2:[20,140], l1:[-42,-38], l2:[-2,0]})},
  {id:"standabduct", n:"Squat met been opzij", c:"l", side:1, view:"front", tip:"Zak in een squat, kom krachtig omhoog en til bovenin één gestrekt been opzij. Halverwege van been wisselen.", easy:"Alleen het been opzij heffen, zonder squat.",
    A:F({a1:[25,-115], a2:[-25,115]}), B:F({a1:[25,-115], a2:[-25,115], l1:[42,42]}),
    K:[F({a1:[25,-115], a2:[-25,115]}), F({t:180, a1:[30,-110], a2:[-30,110], l1:[60,-28], l2:[-60,28]}), F({a1:[25,-115], a2:[-25,115]}), F({t:186, a1:[25,-115], a2:[-25,115], l1:[46,46], l2:[-3,-1]})], seg:0.5},
  {id:"lungeknee", n:"Lunge met knieheffing", c:"l", side:1, tip:"Stap naar achteren in een lunge en kom omhoog met die knie naar je borst. Halverwege van been wisselen.", easy:"Zonder knieheffing, gewoon terug naar staan.",
    A:P({a1:[-20,30], a2:[30,140], l1:[85,0], l2:[-12,-88]}), B:P({a1:[30,140], a2:[-20,30], l1:[0,0], l2:[100,0]}),
    K:[P({a1:[-20,30], a2:[30,140], l1:[85,0], l2:[-12,-88]}), P({a1:[0,20], a2:[0,20]}), P({a1:[30,140], a2:[-20,30], l1:[0,0], l2:[100,0]}), P({a1:[0,20], a2:[0,20]})], seg:0.5},
  // ---------- ARMEN & BOVENLIJF ----------
  {id:"pushups", n:"Push-ups", c:"u", tip:"Handen iets breder dan je schouders, lichaam in één lijn. Borst naar de grond.", easy:"Op je knieën of met je handen op een bank.",
    A:PL({}), B:PL({t:92, a1:[-95,4], a2:[-95,4]})},
  {id:"kneepush", n:"Knie-push-ups", c:"u", tip:"Push-ups met je knieën op de grond. Heupen in lijn met je schouders.", easy:"Handen op een stoel of tegen de muur.",
    A:PL({t:110, l1:[-62,-140], l2:[-62,-140]}), B:PL({t:98, a1:[-95,4], a2:[-95,4], l1:[-72,-140], l2:[-72,-140]})},
  {id:"diamond", n:"Diamant-push-ups", c:"u", tip:"Duimen en wijsvingers raken elkaar onder je borst. Ellebogen langs je lichaam. Zwaar voor je triceps!", easy:"Op je knieën.",
    A:PL({}), B:PL({t:92, a1:[-110,8], a2:[-110,8]})},
  {id:"dips", n:"Triceps dips op een stoel", c:"u", prop:"bench", tip:"Handen op de rand van een stevige stoel achter je. Buig je ellebogen naar achteren en duw terug.", easy:"Voeten dichterbij, knieën meer gebogen.",
    A:{t:180, a1:[-35,-25], a2:[-38,-28], l1:[90,0], l2:[88,0]}, B:{t:178, a1:[-80,-10], a2:[-83,-12], l1:[110,-5], l2:[108,-5]}},
  {id:"rotpush", n:"Push-up met rotatie", c:"u", tip:"Doe een push-up en draai daarna open naar een zijplank met je arm omhoog. Wissel van kant.", easy:"Sla de push-up over, alleen draaien.",
    A:PL({t:92, a1:[-95,4], a2:[-95,4]}), B:PL({t:100, a1:[178,178], l1:[-80,-80]}),
    K:[PL({}), PL({t:92, a1:[-95,4], a2:[-95,4]}), PL({}), PL({t:102, a1:[178,178], l1:[-80,-80]}), PL({})], seg:0.6},
  {id:"taps", n:"Plank met schoudertikken", c:"u", tip:"Hoge plank. Tik om en om met je hand je andere schouder aan. Heupen stil houden.", easy:"Voeten wat verder uit elkaar of op je knieën.",
    A:PL({}), B:PL({a1:[45,-150]}), speed:0.6},
  {id:"pike", n:"Pike push-ups", c:"u", tip:"Billen hoog in een omgekeerde V. Buig je ellebogen en breng je hoofd richting de grond. Traint je schouders.", easy:"Kleinere beweging of voeten op de grond dichterbij.",
    A:{t:40, a1:[25,25], a2:[25,25], l1:[-35,-35], l2:[-35,-35]}, B:{t:14, a1:[-70,18], a2:[-70,18], l1:[-40,-40], l2:[-40,-40]}},
  {id:"updown", n:"Plank up-downs", c:"u", tip:"Wissel tussen onderarmplank en hoge plank, één arm per keer. Heupen zo stil mogelijk.", easy:"Op je knieën.",
    A:PL({t:93, a1:[0,90], a2:[0,90]}), B:PL({}),
    K:[PL({t:93, a1:[0,90], a2:[0,90]}), PL({t:93, a1:[0,90], a2:[0,90]}), PL({t:94, a1:[0,0], a2:[-28,28]}), PL({t:94, a1:[0,0], a2:[-28,28]}), PL({}), PL({}), PL({t:94, a1:[-28,28], a2:[0,0]}), PL({t:94, a1:[-28,28], a2:[0,0]})], seg:0.4, stops:1},
  {id:"inchworm", n:"Inchworms", c:"u", tip:"Buig voorover, loop met je handen naar een plank en loop weer terug. Benen zo recht mogelijk.", easy:"Knieën buigen mag.",
    A:{t:28, a1:[14,12], a2:[12,10], l1:[0,0], l2:[0,0]}, B:PL({}), speed:1.3},
  {id:"downdog", n:"Plank naar downward dog", c:"u", tip:"Duw vanuit de plank je billen omhoog naar een omgekeerde V, dan weer terug naar de plank.", easy:"Knieën licht gebogen.",
    A:PL({}), B:{t:40, a1:[25,25], a2:[25,25], l1:[-35,-35], l2:[-35,-35]}, speed:1.1},
  {id:"armcircles", n:"Armcirkels", c:"u", view:"front", tip:"Armen gestrekt opzij op schouderhoogte. Maak kleine snelle cirkels, halverwege andere kant op.", easy:"Rustiger tempo.",
    A:F({a1:[85,85], a2:[-85,-85]}), B:F({a1:[100,100], a2:[-100,-100]}), speed:0.3},
  {id:"crabtoe", n:"Krab-teentikken", c:"u", tip:"Krabhouding: handen achter je, heupen omhoog. Trap een been omhoog en tik met je andere hand je teen.", easy:"Heupen laag houden.",
    A:{t:-118, a1:[-15,-15], a2:[-20,-20], l1:[90,0], l2:[88,0]}, B:{t:-118, a1:[140,140], a2:[-20,-20], l1:[135,135], l2:[88,0]}},

  // ---------- BUIK & CORE ----------
  {id:"crunches", n:"Crunches", c:"k", tip:"Op je rug, knieën gebogen. Krul je schouders van de grond, onderrug blijft liggen.", easy:"Kleinere beweging.",
    A:BK({a1:[-160,60], a2:[-165,55]}), B:BK({t:-118, a1:[-140,85], a2:[-145,80]})},
  {id:"plank", n:"Plank", c:"k", tip:"Op je onderarmen, lichaam in één rechte lijn. Buik aanspannen, heupen niet laten zakken.", easy:"Op je knieën.",
    A:PL({t:93, a1:[0,90], a2:[0,90]}), B:PL({t:94, a1:[0,90], a2:[0,90]}), hold:1},
  {id:"sideplank", n:"Zijplank", c:"k", side:1, view:"front", tip:"Op één onderarm, lichaam in een rechte lijn, heupen omhoog. Halverwege van kant wisselen.", easy:"Onderste knie op de grond.",
    A:{t:-111, a1:[180,180], a2:[4,2], l1:[69,69], l2:[70,70]}, B:{t:-107, a1:[176,176], a2:[6,4], l1:[73,73], l2:[74,74]}, hold:1},
  {id:"bicycle", n:"Fietsende crunches", c:"k", tip:"Op je rug, handen bij je hoofd. Breng elleboog naar de andere knie en wissel af als op een fiets.", easy:"Voeten hoger houden, langzamer.",
    A:BK({t:-112, a1:[-140,85], a2:[-145,80], l1:[155,60], l2:[100,100]}), B:BK({t:-112, a1:[-140,85], a2:[-145,80], l1:[100,100], l2:[155,60]}), speed:0.7},
  {id:"deadbug", n:"Dead bug", c:"k", tip:"Op je rug, armen recht omhoog, knieën in 90 graden boven je heupen. Strek langzaam één arm achter je hoofd en het andere been uit. Wissel af.", easy:"Alleen de benen bewegen, armen blijven omhoog.",
    A:BK({a1:[180,180], a2:[178,178], l1:[175,90], l2:[172,90]}), B:BK({a1:[262,264], a2:[178,178], l1:[175,90], l2:[100,100]})},
  {id:"legraises", n:"Beenheffen", c:"k", tip:"Op je rug, benen gestrekt. Til ze omhoog tot 90 graden en laat ze langzaam zakken zonder de grond te raken.", easy:"Knieën gebogen houden.",
    A:BK({l1:[175,175], l2:[172,172]}), B:BK({l1:[100,100], l2:[98,98]})},
  {id:"flutter", n:"Flutter kicks", c:"k", tip:"Op je rug, benen gestrekt net boven de grond. Trappel klein en snel op en neer.", easy:"Benen hoger houden.",
    A:BK({t:-100, l1:[100,100], l2:[115,115]}), B:BK({t:-100, l1:[115,115], l2:[100,100]}), speed:0.35},
  {id:"hollow", n:"Hollow hold", c:"k", tip:"Op je rug: armen boven je hoofd, schouders en benen van de grond. Onderrug blijft plat. Volhouden.", easy:"Knieën gebogen en armen langs je lichaam.",
    A:BK({t:-112, a1:[-118,-118], a2:[-115,-115], l1:[108,108], l2:[106,106]}), B:BK({t:-110, a1:[-115,-115], a2:[-112,-112], l1:[106,106], l2:[104,104]}), hold:1},
  {id:"toetouch", n:"Teentikken", c:"k", tip:"Op je rug met je benen recht omhoog. Krul je bovenlijf op en tik met je handen je tenen.", easy:"Knieën licht gebogen.",
    A:BK({a1:[175,175], a2:[172,172], l1:[178,178], l2:[176,176]}), B:BK({t:-128, a1:[162,162], a2:[160,160], l1:[178,178], l2:[176,176]})},
  {id:"russian", n:"Russian twists", c:"k", tip:"Zit met je bovenlijf iets naar achteren en je voeten los. Draai je handen van links naar rechts.", easy:"Voeten op de grond.",
    A:{t:-150, a1:[115,85], a2:[110,80], l1:[125,75], l2:[123,75]}, B:{t:-150, a1:[55,70], a2:[50,65], l1:[125,75], l2:[123,75]}, speed:0.6},
  {id:"superman", n:"Superman", c:"k", tip:"Op je buik. Til tegelijk armen, borst en benen van de grond, houd even vast en zak terug.", easy:"Alleen armen of alleen benen.",
    A:{t:90, a1:[92,92], a2:[92,92], l1:[-90,-90], l2:[-90,-90]}, B:{t:104, a1:[112,112], a2:[110,110], l1:[-102,-102], l2:[-100,-100]}},
  {id:"birddog", n:"Bird dog", c:"k", tip:"Op handen en knieën, rug recht. Strek één arm vooruit en tegelijk het andere been naar achteren. Even vasthouden en wisselen.", easy:"Alleen een arm of alleen een been.",
    A:Q({}), B:Q({a1:[95,95], l2:[-95,-95]})},
  {id:"standcrunch", n:"Staande knie-crunch", c:"k", tip:"Strek je armen boven je hoofd. Trek ze krachtig omlaag terwijl je een knie optilt, alsof je de knie aantikt. Wissel af.", easy:"Rustiger tempo.",
    A:P({a1:[172,176], a2:[168,174]}), B:P({t:162, a1:[75,40], a2:[70,35], l1:[105,-5]}), speed:0.7},
];

// Engelse namen voor de stem
const EN = {"jacks": "Jumping jacks", "highknees": "High knees", "buttkicks": "Butt kicks", "climbers": "Mountain climbers", "burpees": "Burpees", "squatjacks": "Squat jacks", "boxing": "Shadow boxing", "jumpsquats": "Jump squats", "jumplunges": "Jumping lunges", "squats": "Squats", "pulsesquats": "Pulse squats", "sumo": "Sumo squats", "wallsit": "Wall sit", "lunges": "Lunges", "revlunges": "Reverse lunges", "sidelunges": "Side lunges", "stepups": "Step-ups", "calfraises": "Calf raises", "bridge": "Glute bridge", "slbridge": "Single-leg glute bridge", "donkey": "Donkey kicks", "sideleg": "Side-lying leg raises", "goodmorning": "Good mornings", "hipthrust": "Hip thrusts", "bridgepulse": "Glute bridge pulses", "bridgemarch": "Glute bridge march", "kickback": "Standing kickbacks", "standabduct": "Squat to side leg raise", "lungeknee": "Reverse lunge with knee drive", "pushups": "Push-ups", "kneepush": "Knee push-ups", "diamond": "Diamond push-ups", "dips": "Triceps dips", "rotpush": "Push-up with rotation", "taps": "Plank shoulder taps", "pike": "Pike push-ups", "updown": "Plank up-downs", "inchworm": "Inchworms", "downdog": "Plank to downward dog", "armcircles": "Arm circles", "crabtoe": "Crab toe touches", "crunches": "Crunches", "plank": "Plank", "sideplank": "Side plank", "bicycle": "Bicycle crunches", "deadbug": "Dead bug", "legraises": "Leg raises", "flutter": "Flutter kicks", "hollow": "Hollow hold", "toetouch": "Toe touches", "russian": "Russian twists", "superman": "Superman", "birddog": "Bird dog", "standcrunch": "Standing knee crunch"};
for(const e of EX) e.en = EN[e.id] || e.n;

/* ---------- poppetje: slanke illustratiestijl ----------
   Elk lichaamsdeel is een gevulde vorm. Ledematen zijn taps toelopende capsules (convex omhulsel van twee cirkels),
   de romp is een vloeiend silhouet met heupen, taille en borst. Alle vormen hebben dezelfde draairichting,
   zodat ze per kleurlaag in één pad samensmelten zonder gaten. */
const rad = d => d*Math.PI/180;
const dir = a => [Math.sin(rad(a)), Math.cos(rad(a))];
const add = (p,v,s=1) => [p[0]+v[0]*s, p[1]+v[1]*s];
const seg = (p,a,len) => add(p,dir(a),len);
const Rr = {hip:5.6, knee:3.3, ankle:1.85, sh:3.0, elb:1.85, wr:1.3, hand:1.8, head:4.6, shoe:2.0};
function joints(q, front){
  const up=dir(q.t), face=dir(q.t-90);
  const pel=[q.dx||0,0];
  const neck=add(pel,up,L.torso);
  const head=front?add(neck,up,2.5+Rr.head):add(add(neck,up,2.4+Rr.head),face,0.8);
  const shb=add(pel,up,L.torso-(front?3.0:2.2));
  const sh1=front?add(shb,face,5.5):add(shb,face,-0.4), sh2=front?add(shb,face,-5.5):add(shb,face,-0.4);
  const hp1=front?add(add(pel,face,3.4),up,-0.5):pel, hp2=front?add(add(pel,face,-3.4),up,-0.5):pel;
  const e1=seg(sh1,q.a1[0],L.ua), w1=seg(e1,q.a1[1],L.fa), h1=seg(w1,q.a1[1],2);
  const e2=seg(sh2,q.a2[0],L.ua), w2=seg(e2,q.a2[1],L.fa), h2=seg(w2,q.a2[1],2);
  const k1=seg(hp1,q.l1[0],L.th), f1=seg(k1,q.l1[1],L.sh);
  const k2=seg(hp2,q.l2[0],L.th), f2=seg(k2,q.l2[1],L.sh);
  // voeten: zijaanzicht wijzen naar voren (haaks op scheen), vooraanzicht naar buiten
  // staande voet blijft plat (wijst naar voren); bij een schuin of horizontaal scheenbeen volgt de voet het been
  const flat=sh=>{ const a=Math.abs(sh); return a<=45 ? 90 : a>=75 ? sh+90 : 90+(sh+90-90)*((a-45)/30); };
  const fa1=front? q.l1[1]+70 : flat(q.l1[1])-(q.f1||0);
  const fa2=front? q.l2[1]-70 : flat(q.l2[1])-(q.f2||0);
  const toe1=seg(f1,fa1,front?3:L.foot), heel1=seg(f1,fa1,front?-0.5:-1.6);
  const toe2=seg(f2,fa2,front?3:L.foot), heel2=seg(f2,fa2,front?-0.5:-1.6);
  return {pel,neck,head,shb,sh1,sh2,hp1,hp2,e1,w1,h1,e2,w2,h2,k1,f1,k2,f2,toe1,toe2,heel1,heel2,up,face};
}
// Punten met straal voor grond en kader
const RP = {pel:5.2, neck:2, head:Rr.head+0.6, shb:4.3, e1:Rr.elb, w1:Rr.wr, h1:Rr.hand, e2:Rr.elb, w2:Rr.wr, h2:Rr.hand, k1:Rr.knee, k2:Rr.knee, f1:Rr.ankle, f2:Rr.ankle, toe1:Rr.shoe, toe2:Rr.shoe, heel1:Rr.shoe, heel2:Rr.shoe};
function bbox(j){
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  for(const k in RP){ const p=j[k], r=RP[k]; x0=Math.min(x0,p[0]-r);x1=Math.max(x1,p[0]+r);y0=Math.min(y0,p[1]-r);y1=Math.max(y1,p[1]+r); }
  return {x0,x1,y0,y1};
}
const lerp=(a,b,t)=>a+(b-a)*t;
const frames = ex => ex.K || [ex.A, ex.B];
function mix(A,B,t){
  const o={};
  for(const k of ["t","air","f1","f2","dx"]) o[k]=lerp(A[k]||0,B[k]||0,t);
  for(const k of ["a1","a2","l1","l2"]) o[k]=[lerp(A[k][0],B[k][0],t),lerp(A[k][1],B[k][1],t)];
  return o;
}
/* Vast steunpunt per oefening: dat punt blijft tijdens de beweging op zijn plek (voeten blijven staan). */
const ANCHOR = {
  lunges:"f2", revlunges:"f1", sidelunges:"f2", stepups:"f1", kickback:"f2", standabduct:"f2", lungeknee:"f1",
  highknees:"pel", buttkicks:"pel", burpees:"pel", boxing:"pel", wallsit:"pel", jacks:"pel", squatjacks:"pel", jumplunges:"pel",
  climbers:"hands", donkey:"pel", birddog:"pel", taps:"feet", slbridge:"f2", bridgemarch:"f2", updown:"feet", dips:"hands", hipthrust:"shb",
  kneepush:"knees", sideleg:"pel", superman:"pel", russian:"pel", legraises:"pel", deadbug:"pel", flutter:"pel", hollow:"pel", toetouch:"pel", bicycle:"pel", armcircles:"pel", sideplank:"hands", crabtoe:"hands"
};
function anchorX(ex,j){
  const a=ANCHOR[ex.id]||"feet";
  if(a==="feet") return (j.f1[0]+j.f2[0])/2;
  if(a==="hands") return (j.w1[0]+j.w2[0])/2;
  if(a==="knees") return (j.k1[0]+j.k2[0])/2;
  return j[a][0];
}
/* Twee steunpunten (bv. tenen en handen): kantel het hele lichaam rond het eerste punt tot het tweede de grond raakt. */
const CONTACT = {
  pushups:["toes",["h1","h2"]], diamond:["toes",["h1","h2"]], rotpush:["toes",["h1","h2"]], taps:["toes",["h1","h2"]],
  climbers:["backtoe",["h1","h2"]], plank:["toes",["e1","e2","h1","h2"]], updown:["toes",["e1","e2","h1","h2"]],
  kneepush:["knees",["h1","h2"]], pike:["toes",["h1","h2"]], downdog:["toes",["h1","h2"]], inchworm:["toes",["h1","h2"]],
  sideplank:["toes",["h1","h2"]], birddog:["hands",["k1","k2"]], donkey:["hands",["k1","k2"]],
  bridge:["feet",["shb","head"]], bridgepulse:["feet",["shb","head"]], slbridge:["foot2",["shb","head"]], bridgemarch:["foot2",["shb","head"]]
};
// Liggende oefeningen: alleen de romp bepaalt de grond, zodat bewegende armen of benen het lichaam niet optillen
const GROUNDBY = {climbers:["h1","h2"], legraises:["pel","shb"], deadbug:["pel","shb"], flutter:["pel"], hollow:["pel"], toetouch:["pel"], bicycle:["pel"], superman:["pel","shb"], sideleg:["pel","shb"]};
const bottomOf=(j,k)=>j[k][1]+(RP[k]||0);
const PIV={toes:["toe1","toe2"], hands:["h1","h2"], knees:["k1","k2"], feet:["heel1","heel2","toe1","toe2"], foot2:["heel2","toe2"]};
const rotQ=(q,d)=>Object.assign({},q,{t:q.t-d, a1:[q.a1[0]-d,q.a1[1]-d], a2:[q.a2[0]-d,q.a2[1]-d], l1:[q.l1[0]-d,q.l1[1]-d], l2:[q.l2[0]-d,q.l2[1]-d]});
function settle(ex,q,front){
  const c=CONTACT[ex.id]; if(!c) return q;
  const pk=c[0]==="backtoe" ? [q.l1[0]<q.l2[0]?"toe1":"toe2"] : PIV[c[0]];
  const g=d=>{ const j=joints(rotQ(q,d),front); const pv=Math.max(...pk.map(k=>bottomOf(j,k))); return Math.max(...c[1].map(k=>bottomOf(j,k)))-pv; };
  // kantelhoek zoeken: steunpunt 2 even laag als steunpunt 1
  let lo=-35, hi=35, glo=g(lo), ghi=g(hi);
  if(Math.sign(glo)===Math.sign(ghi)) return q;
  for(let i=0;i<22;i++){ const m=(lo+hi)/2, gm=g(m); if(Math.sign(gm)===Math.sign(glo)){ lo=m; glo=gm; } else hi=m; }
  return rotQ(q,(lo+hi)/2);
}
function shiftJ(j,sx){ const o={}; for(const k in j) o[k]=(k==="up"||k==="face")?j[k]:[j[k][0]+sx,j[k][1]]; return o; }
const cache={};
function frameOffset(ex){
  if(cache[ex.id]) return cache[ex.id];
  const f=ex.view==="front", j0=joints(settle(ex,frames(ex)[0],f),f), ax=anchorX(ex,j0);
  // kader over een hele bewegingscyclus, met het steunpunt vast
  let x0=1e9,x1=-1e9;
  for(let i=0;i<=24;i++){ const j=joints(settle(ex,poseAt(ex,i/24),f),f), b=bbox(shiftJ(j,ax-anchorX(ex,j))); x0=Math.min(x0,b.x0); x1=Math.max(x1,b.x1); }
  return cache[ex.id]={dx:60-(x0+x1)/2, ax, a:j0};
}
function groundDy(j, air){ return GROUND - bbox(j).y1 - (air||0); }

/* --- geometrie --- */
function circlePts(c,r,n=14){ const o=[]; for(let i=0;i<n;i++){ const a=i/n*2*Math.PI; o.push([c[0]+Math.cos(a)*r, c[1]+Math.sin(a)*r]); } return o; }
function hull(pts){ // monotone chain, tegen de klok in
  pts=pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[],hi=[];
  for(const p of pts){ while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); }
  for(let i=pts.length-1;i>=0;i--){ const p=pts[i]; while(hi.length>=2&&cr(hi[hi.length-2],hi[hi.length-1],p)<=0) hi.pop(); hi.push(p); }
  hi.pop(); lo.pop(); return lo.concat(hi);
}
const area=poly=>{ let a=0; for(let i=0;i<poly.length;i++){ const p=poly[i],q=poly[(i+1)%poly.length]; a+=p[0]*q[1]-q[0]*p[1]; } return a; };
const orient=poly=> area(poly)<0 ? poly.slice().reverse() : poly;
const capsule=(a,ra,b,rb)=>hull(circlePts(a,ra).concat(circlePts(b,rb)));
function catmull(pts, steps=4){ // gesloten vloeiende lijn door de punten
  const o=[], n=pts.length;
  for(let i=0;i<n;i++){
    const p0=pts[(i-1+n)%n], p1=pts[i], p2=pts[(i+1)%n], p3=pts[(i+2)%n];
    for(let s=0;s<steps;s++){ const t=s/steps, t2=t*t, t3=t2*t;
      o.push([0,1].map(k=>0.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3))); }
  }
  return o;
}
// Rompprofiel: [positie langs de rug (0 = heup, 1 = halsbasis), achterkant, voorkant]
const PSIDE=[[-0.12,-4.2,3.4],[0.04,-6.4,4.4],[0.2,-5.6,4.2],[0.42,-4.1,3.5],[0.6,-4.5,5.6],[0.72,-4.7,5.2],[0.86,-4.5,3.9],[0.95,-3.6,2.9],[1.0,-2.3,2.1]];
const PFRONT=[[-0.16,-1.4,1.4],[-0.06,-5.4,5.4],[0.06,-6.6,6.6],[0.22,-6.1,6.1],[0.42,-4.8,4.8],[0.6,-5.4,5.4],[0.8,-5.8,5.8],[0.9,-6.3,6.3],[1.0,-2.2,2.2]];
function torsoPoly(j, front, from, to){
  const prof=(front?PFRONT:PSIDE).filter(r=>r[0]>=from-1e-9&&r[0]<=to+1e-9);
  const P=(u,v)=>add(add(j.pel,j.up,u*L.torso),j.face,v);
  const back=prof.map(r=>P(r[0],r[1])), fr=prof.map(r=>P(r[0],r[2])).reverse();
  return catmull(back.concat(fr),3);
}
function topPoly(j, front){ // sporttopje: zijkant met lage voorkant, vooraanzicht met bandjes en ronde hals
  const P=(u,v)=>add(add(j.pel,j.up,u*L.torso),j.face,v);
  if(front){
    const rows=PFRONT.filter(r=>r[0]<=0.82);
    const left=rows.map(r=>P(r[0],r[1])), right=rows.map(r=>P(r[0],r[2])).reverse();
    return catmull(left.concat([P(0.9,-5.8),P(0.99,-4.4),P(0.99,-3.0),P(0.9,-1.6),P(0.86,0),P(0.9,1.6),P(0.99,3.0),P(0.99,4.4),P(0.9,5.8)],right),2);
  }
  const back=PSIDE.filter(r=>r[0]<=0.95).map(r=>P(r[0],r[1]));
  const fr=PSIDE.filter(r=>r[0]<=0.72).map(r=>P(r[0],r[2])).reverse();
  return catmull(back.concat([P(0.98,-2.4),P(0.95,0.2),P(0.84,3.4)],fr),3);
}
function polyD(polys, X){ return polys.map(p=>"M"+orient(p).map(X).join("L")+"Z").join(""); }

const NS="http://www.w3.org/2000/svg";
function el(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); parent&&parent.appendChild(e); return e; }
function poseAt(ex, t){ // t: 0..1 heen-en-terug (A/B) of rondgang door keyframes
  if(!ex.K) return mix(ex.A,ex.B,Math.max(0,Math.min(1,t)));
  const n=ex.K.length, x=((t%1)+1)%1*n, i=Math.floor(x), f=x-i;
  if(ex.stops) return mix(ex.K[i],ex.K[(i+1)%n],0.5-0.5*Math.cos(f*Math.PI));
  const P0=ex.K[(i-1+n)%n], P1=ex.K[i], P2=ex.K[(i+1)%n], P3=ex.K[(i+2)%n];
  const cr=(a,b,c,d)=>0.5*((2*b)+(-a+c)*f+(2*a-5*b+4*c-d)*f*f+(-a+3*b-3*c+d)*f*f*f);
  const o={};
  for(const k of ["t","air","f1","f2","dx"]) o[k]=cr(P0[k]||0,P1[k]||0,P2[k]||0,P3[k]||0);
  for(const k of ["a1","a2","l1","l2"]) o[k]=[0,1].map(m=>cr(P0[k][m],P1[k][m],P2[k][m],P3[k][m]));
  o.air=Math.max(0,o.air);
  return o;
}
function draw(svg, ex, t){
  const front=ex.view==="front";
  const q=settle(ex,poseAt(ex,t),front), off=frameOffset(ex), j0=joints(q,front), j=shiftJ(j0,off.ax-anchorX(ex,j0));
  const gb=GROUNDBY[ex.id], dy=gb ? GROUND-Math.max(...gb.map(k=>bottomOf(j,k)))-(q.air||0) : groundDy(j,q.air), dx=off.dx;
  const X=p=>`${(p[0]+dx).toFixed(1)},${(p[1]+dy).toFixed(1)}`;
  const side=!front;
  const off2=(p,a,d)=>add(p,dir(a),side?d:0);
  const leg=(hp,k,f,la)=>{ // la = [dijhoek, scheenhoek]
    const qm=add(hp,dir(la[0]),L.th*0.42), cm=add(k,dir(la[1]),L.sh*0.3);
    return [hull(circlePts(hp,front?4.5:Rr.hip).concat(circlePts(off2(qm,la[0]+90,0.7),front?4.0:4.9),circlePts(k,Rr.knee))),
            hull(circlePts(k,Rr.knee).concat(circlePts(off2(cm,la[1]-90,0.8),3.5),circlePts(f,Rr.ankle)))];
  };
  const shoe=(f,toe,heel)=>[capsule(heel,Rr.shoe,toe,front?Rr.shoe:1.5), circlePts(f,Rr.ankle+0.3,10)];
  const arm=(sh,e,w,h,aa)=>{
    const dm=add(sh,dir(aa[0]),L.ua*0.3), fm=add(e,dir(aa[1]),L.fa*0.28);
    return [hull(circlePts(sh,front?2.5:Rr.sh).concat(circlePts(dm,front?2.4:2.75),circlePts(e,Rr.elb))),
            hull(circlePts(e,Rr.elb).concat(circlePts(fm,2.1),circlePts(w,Rr.wr))), circlePts(h,Rr.hand,14)];
  };
  const P=svg._p, set=(k,polys)=>P[k].setAttribute("d",polyD(polys,X));
  set("farArm",front?[]:arm(j.sh2,j.e2,j.w2,j.h2,q.a2));
  set("farArmF",front?arm(j.sh2,j.e2,j.w2,j.h2,q.a2):[]);
  set("farLeg",leg(j.hp2,j.k2,j.f2,q.l2)); set("farShoe",shoe(j.f2,j.toe2,j.heel2));
  // romp: huid boven (schouders/hals), outfit eronder
  const neckTop=front?add(j.neck,j.up,2.8):add(add(j.neck,j.up,2.6),j.face,-0.1);
  const neckPoly=capsule(add(j.neck,j.up,-2),2.4,neckTop,2.1);
  set("torsoSkin",[torsoPoly(j,front,0.55,1.0),neckPoly]);
  set("torso",[topPoly(j,front)]);
  set("nearLeg",leg(j.hp1,j.k1,j.f1,q.l1)); set("nearShoe",shoe(j.f1,j.toe1,j.heel1));
  // hoofd: profiel met neus, lippen en kin; haar met haarlijn; paardenstaart met elastiekje
  const h=j.head, F=j.face, U=j.up, back=[-F[0],-F[1]];
  const LP=(x,y)=>add(add(h,F,x),U,y);  // lokaal: x = kijkrichting, y = omhoog
  const arc=(r,a0,a1,n)=>{ const o=[]; for(let i=0;i<=n;i++){ const a=rad(a0+(a1-a0)*i/n); o.push(LP(r*Math.cos(a),r*Math.sin(a))); } return o; };
  let facePoly, hairPolys=[], tie=[], hairBack=[], ears=[];
  if(front){
    // gezicht: ovaal met wangen en een smallere kin
    facePoly=[]; for(let i=0;i<28;i++){ const a=i/28*2*Math.PI, sy=Math.sin(a), w=sy<0?3.9*(1-0.2*sy*sy*sy*sy):3.9; facePoly.push(LP(w*Math.cos(a), (sy<0?5.0:4.6)*sy-0.2)); }
    facePoly=catmull(facePoly,1);
    // achterhaar: smalle donkere rand langs boven en zijkant, naar achteren gekamd
    const hb=[]; for(let i=0;i<=16;i++){ const a=rad(-14+208*i/16); hb.push(LP(4.55*Math.cos(a), 4.9*Math.sin(a)+0.5)); }
    hairBack=[catmull(hb.concat([LP(-3.6,-1.1),LP(3.6,-1.1)]).reverse(),2)];
    ears=[circlePts(LP(3.95,-0.5),1.0,12), circlePts(LP(-3.95,-0.5),1.0,12)];
    // haar voorop: volume bovenop met een zachte haarlijn naar de slapen
    hairPolys.push(catmull([LP(-4.15,0.4),LP(-4.75,2.4),LP(-4.0,4.5),LP(-2.0,5.75),LP(0.6,6.0),LP(3.0,5.5),LP(4.5,3.9),LP(4.8,2.0),LP(4.15,0.4),LP(3.75,2.2),LP(2.7,3.4),LP(1.0,4.0),LP(-0.9,3.95),LP(-2.6,3.25),LP(-3.75,2.0)],3));
    hairPolys.push(circlePts(LP(0.4,6.4),1.9,14));
  } else {
    facePoly=catmull([LP(-1.0,-3.9),LP(-3.6,-2.5)].concat(arc(4.6,200,40,6),[LP(4.3,1.6),LP(4.55,0.6),LP(4.75,-0.1),LP(5.65,-1.1),LP(4.95,-1.55),LP(5.0,-2.1),LP(4.7,-2.5),LP(4.85,-2.95),LP(4.45,-3.9),LP(3.4,-4.75),LP(1.2,-4.5)]),3);
    hairPolys.push(catmull(arc(5.15,28,205,10).concat([LP(-4.6,-2.4),LP(-3.3,-3.3),LP(-2.3,-1.8),LP(-1.3,0.0),LP(0.4,1.7),LP(2.2,2.7),LP(4.1,2.75)]),3));
    // paardenstaart: dik bij het elastiekje, valt met de zwaartekracht
    const maxY=GROUND-dy, base=LP(-4.3,1.9), sway=Math.sin(t*Math.PI*2)*0.3+(q.air?-0.5:0);
    const rads=[2.3,2.7,2.6,2.2,1.7,1.2,0.75];
    let pts=[base];
    for(let i=1;i<rads.length;i++){
      const k=i/(rads.length-1), b=0.85*(1-k)*(1-k)+sway*k;
      let d=[back[0]*b, back[1]*b+0.5+k*0.9]; const n=Math.hypot(d[0],d[1])||1; d=[d[0]/n,d[1]/n];
      let np=add(pts[i-1],d,2.3); if(np[1]>maxY-rads[i]) np=[np[0]+back[0]*1.1, maxY-rads[i]];
      pts.push(np);
    }
    for(let i=0;i<pts.length-1;i++) hairPolys.push(capsule(pts[i],rads[i],pts[i+1],rads[i+1]));
    const d0=[pts[1][0]-pts[0][0],pts[1][1]-pts[0][1]], n0=Math.hypot(d0[0],d0[1])||1, pp=[-d0[1]/n0,d0[0]/n0], tc=add(pts[0],[d0[0]/n0,d0[1]/n0],0.9);
    tie=[capsule(add(tc,pp,1.6),0.5,add(tc,pp,-1.6),0.5)];
  }
  set("hairBack",hairBack); set("ears",ears);
  set("face",[facePoly]);
  set("hair",hairPolys);
  set("tie",tie);
  set("nearArm",arm(j.sh1,j.e1,j.w1,j.h1,q.a1));
  const bb=bbox(j);
  P.shadow.setAttribute("cx",(((bb.x0+bb.x1)/2)+dx).toFixed(1)); P.shadow.setAttribute("rx",Math.max(10,(bb.x1-bb.x0)/2+2).toFixed(1));
}
function propShapes(svg, ex){
  if(!ex.prop) return;
  const off=frameOffset(ex), A=off.a, dyA=groundDy(A,ex.A.air);
  const g=el("g",{class:"prop"},svg), ox=off.dx;
  const bench=(x,y)=>{ el("rect",{x:x-24,y,width:28,height:4,rx:1.5},g); el("rect",{x:x-22,y:y+4,width:3,height:GROUND-y-4},g); el("rect",{x:x-1,y:y+4,width:3,height:GROUND-y-4},g); };
  if(ex.prop==="wall"){ const x=Math.min(A.pel[0]-5.4,A.neck[0]-4.5)+ox+3.6; el("rect",{x:x-5,y:10,width:5,height:GROUND-10},g); }
  if(ex.prop==="stepbox"){ const x=A.f1[0]+ox, y=Math.max(A.toe1[1],A.heel1[1])+dyA+Rr.shoe; el("rect",{x:x-9,y,width:26,height:GROUND-y,rx:1.5},g); }
  if(ex.prop==="bench"){ bench(Math.min(A.h1[0],A.h2[0])+ox+3, Math.max(A.h1[1],A.h2[1])+dyA+Rr.hand); }
  if(ex.prop==="backbench"){ bench(A.shb[0]+ox+4, A.shb[1]+dyA+4.4); }
}
function makeFigure(ex, cls){
  const svg=el("svg",{viewBox:"0 0 120 100",class:"fig "+(ex.view==="front"?"front ":"")+(cls||""),role:"img","aria-label":ex.n});
  el("line",{x1:4,y1:GROUND,x2:116,y2:GROUND,class:"ground"},svg);
  const P={};
  P.shadow=el("ellipse",{cx:60,cy:GROUND,rx:20,ry:2.2,class:"shadow"},svg);
  propShapes(svg, ex);
  for(const [k,c] of [["farArm","skin far"],["farLeg","outfit far"],["farShoe","shoe far"],["torsoSkin","skin"],["torso","outfit"],["hairBack","hair"],["ears","ear"],["face","skin"],["hair","hair"],["tie","tie"],["nearLeg","outfit"],["nearShoe","shoe"],["farArmF","skin far"],["nearArm","skin"]])
    P[k]=el("path",{class:"part "+c},svg);
  svg._p=P; svg._ex=ex;
  draw(svg,ex,0);
  return svg;
}
const live=new Set(); let raf=0; const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function animate(svg){ live.add(svg); if(!raf && !reduce) raf=requestAnimationFrame(loop); }
function loop(now){
  for(const s of live){
    if(!s.isConnected){ live.delete(s); continue; }
    const ex=s._ex;
    let t;
    if(ex.K){ const period=ex.K.length*(ex.seg||0.6)*1000; t=(now%period)/period; }
    else { const period=(ex.hold?3.2:(ex.speed||1)*1.6)*1000; const ph=(now % period)/period; t=0.5-0.5*Math.cos(ph*2*Math.PI); }
    draw(s,ex,t);
  }
  raf = live.size ? requestAnimationFrame(loop) : 0;
}

/* ---------- dagworkout ---------- */
const FOCUS = {
  mix:    {label:"Gevarieerd",       slots:"clukclukcluk"},
  benen:  {label:"Benen & billen",   slots:"cllkclulclkl"},
  armen:  {label:"Armen & bovenlijf",slots:"cuukculucuku"},
  core:   {label:"Buik & core",      slots:"ckkuckclckuk"},
  cardio: {label:"Cardio",           slots:"clcucklcuclc"},
};
function hash(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function rng(seed){ let a=seed||1; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function shuffle(arr,r){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const ORDER="cluk";
function pick(dateKey, focus, noJump, variant, avoid){
  const r=rng(hash(`${dateKey}|${focus}|${noJump?1:0}|${variant||0}`));
  const pools={}; for(const c of ORDER) pools[c]=shuffle(EX.filter(e=>e.c===c && !(noJump&&e.jump)),r);
  // Oefeningen van gisteren achteraan zetten
  if(avoid) for(const c of ORDER) pools[c].sort((a,b)=>(avoid.has(a.id)?1:0)-(avoid.has(b.id)?1:0));
  const used=new Set(), out=[];
  for(const c of (FOCUS[focus]||FOCUS.mix).slots){
    let ex=pools[c].find(e=>!used.has(e.id));
    if(!ex){ for(const alt of ORDER){ ex=pools[alt].find(e=>!used.has(e.id)); if(ex) break; } }
    used.add(ex.id); out.push(ex);
  }
  // Twee keer achter elkaar een staande wissel-oefening? Dan is dat prima; houd de volgorde zoals de slots.
  return out;
}
function workoutFor(dateKey, prevKey, focus, noJump, variant){
  const y = prevKey ? new Set(pick(prevKey, focus, noJump, 0).map(e=>e.id)) : null;
  return pick(dateKey, focus, noJump, variant, y);
}

window.ZMC_EX = {EX, FOCUS, makeFigure, animate, draw, workoutFor, CAT:{c:"Cardio",l:"Benen & billen",u:"Armen & bovenlijf",k:"Buik & core"}};
})();
