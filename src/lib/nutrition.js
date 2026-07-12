// Plan alimentaire ~3 200 kcal / 140-150 g de protéines — budget étudiant, vie de plagiste.
// 5 repas / jour : petit-déj, collation plage, box déjeuner, smoothie post-boulot, dîner.
// 4 semaines type (A, B, C, D) qui tournent automatiquement → un mois sans répétition,
// et chaque repas peut être remplacé par une alternative d'un tap (🔄).

export const SLOTS = [
  { id: 'pdj', name: 'Petit-déj', emoji: '🌅' },
  { id: 'col', name: 'Collation plage', emoji: '🏖️' },
  { id: 'dej', name: 'Déjeuner (box)', emoji: '🍱' },
  { id: 'smo', name: 'Post-boulot', emoji: '🥤' },
  { id: 'din', name: 'Dîner', emoji: '🌙' },
]

export const INGREDIENTS = {
  'flocons-avoine':   { name: 'Flocons d’avoine', unit: 'g', rayon: 'Épicerie', price: 0.0015 },
  'lait':             { name: 'Lait demi-écrémé', unit: 'ml', rayon: 'Frais', price: 0.001 },
  'lait-entier':      { name: 'Lait entier', unit: 'ml', rayon: 'Frais', price: 0.0011 },
  banane:             { name: 'Bananes', unit: 'pc', rayon: 'Fruits & légumes', price: 0.25 },
  'beurre-cacahuete': { name: 'Beurre de cacahuète', unit: 'g', rayon: 'Épicerie', price: 0.007 },
  miel:               { name: 'Miel', unit: 'g', rayon: 'Épicerie', price: 0.012 },
  skyr:               { name: 'Skyr', unit: 'g', rayon: 'Frais', price: 0.0044 },
  amandes:            { name: 'Amandes', unit: 'g', rayon: 'Épicerie', price: 0.015 },
  oeuf:               { name: 'Œufs', unit: 'pc', rayon: 'Frais', price: 0.25 },
  'pain-complet':     { name: 'Pain complet', unit: 'g', rayon: 'Épicerie', price: 0.0036 },
  beurre:             { name: 'Beurre', unit: 'g', rayon: 'Frais', price: 0.01 },
  thon:               { name: 'Thon en boîte (égoutté)', unit: 'g', rayon: 'Épicerie', price: 0.01 },
  mayo:               { name: 'Mayonnaise', unit: 'g', rayon: 'Épicerie', price: 0.008 },
  riz:                { name: 'Riz (cru)', unit: 'g', rayon: 'Épicerie', price: 0.002 },
  pates:              { name: 'Pâtes (crues)', unit: 'g', rayon: 'Épicerie', price: 0.0015 },
  poulet:             { name: 'Filet de poulet', unit: 'g', rayon: 'Frais', price: 0.008 },
  'huile-olive':      { name: 'Huile d’olive', unit: 'ml', rayon: 'Épicerie', price: 0.008 },
  legumes:            { name: 'Légumes surgelés', unit: 'g', rayon: 'Surgelés', price: 0.002 },
  'sauce-tomate':     { name: 'Sauce tomate', unit: 'g', rayon: 'Épicerie', price: 0.002 },
  parmesan:           { name: 'Parmesan / fromage râpé', unit: 'g', rayon: 'Frais', price: 0.014 },
  lentilles:          { name: 'Lentilles corail', unit: 'g', rayon: 'Épicerie', price: 0.003 },
  creme:              { name: 'Crème légère', unit: 'ml', rayon: 'Frais', price: 0.003 },
  'lait-coco':        { name: 'Lait de coco', unit: 'ml', rayon: 'Épicerie', price: 0.003 },
  'mix-fruits-secs':  { name: 'Mélange fruits secs & noix', unit: 'g', rayon: 'Épicerie', price: 0.012 },
  'barre-cereales':   { name: 'Barres de céréales', unit: 'pc', rayon: 'Épicerie', price: 0.3 },
  cacao:              { name: 'Cacao en poudre', unit: 'g', rayon: 'Épicerie', price: 0.01 },
  fruit:              { name: 'Fruits de saison (pêche, pomme…)', unit: 'pc', rayon: 'Fruits & légumes', price: 0.4 },
  tortilla:           { name: 'Tortillas de blé', unit: 'pc', rayon: 'Épicerie', price: 0.35 },
  semoule:            { name: 'Semoule / couscous', unit: 'g', rayon: 'Épicerie', price: 0.002 },
  'pois-chiches':     { name: 'Pois chiches (boîte, égouttés)', unit: 'g', rayon: 'Épicerie', price: 0.003 },
  mais:               { name: 'Maïs (boîte)', unit: 'g', rayon: 'Épicerie', price: 0.004 },
  'fruits-rouges':    { name: 'Fruits rouges surgelés', unit: 'g', rayon: 'Surgelés', price: 0.005 },
  pesto:              { name: 'Pesto', unit: 'g', rayon: 'Épicerie', price: 0.012 },
  'haricots-rouges':  { name: 'Haricots rouges (boîte, égouttés)', unit: 'g', rayon: 'Épicerie', price: 0.003 },
  'steak-hache':      { name: 'Steak haché surgelé', unit: 'g', rayon: 'Surgelés', price: 0.009 },
  patates:            { name: 'Pommes de terre', unit: 'g', rayon: 'Fruits & légumes', price: 0.0015 },
  'fromage-blanc':    { name: 'Fromage blanc (3%)', unit: 'g', rayon: 'Frais', price: 0.002 },
  yaourt:             { name: 'Yaourts nature', unit: 'pc', rayon: 'Frais', price: 0.15 },
  sardines:           { name: 'Sardines en boîte (égouttées)', unit: 'g', rayon: 'Épicerie', price: 0.011 },
  maquereau:          { name: 'Filets de maquereau en boîte', unit: 'g', rayon: 'Épicerie', price: 0.011 },
  tomates:            { name: 'Tomates', unit: 'g', rayon: 'Fruits & légumes', price: 0.0025 },
  concombre:          { name: 'Concombre', unit: 'g', rayon: 'Fruits & légumes', price: 0.002 },
  courgette:          { name: 'Courgettes', unit: 'g', rayon: 'Fruits & légumes', price: 0.002 },
  'lentilles-vertes': { name: 'Lentilles vertes (sèches)', unit: 'g', rayon: 'Épicerie', price: 0.0025 },
  'haricots-verts':   { name: 'Haricots verts (boîte)', unit: 'g', rayon: 'Épicerie', price: 0.002 },
  ratatouille:        { name: 'Ratatouille (boîte)', unit: 'g', rayon: 'Épicerie', price: 0.0025 },
  compote:            { name: 'Compotes (sans sucres ajoutés)', unit: 'pc', rayon: 'Épicerie', price: 0.3 },
  jambon:             { name: 'Jambon blanc', unit: 'g', rayon: 'Frais', price: 0.011 },
  avocat:             { name: 'Avocats', unit: 'pc', rayon: 'Fruits & légumes', price: 1.0 },
  'fromage-portions': { name: 'Fromages portions (type Babybel)', unit: 'pc', rayon: 'Frais', price: 0.25 },
  'poisson-blanc':    { name: 'Poisson blanc surgelé (colin)', unit: 'g', rayon: 'Surgelés', price: 0.007 },
}

// kcal / prot ≈ estimations honnêtes par repas
export const MEALS = {
  // ————— PETITS-DÉJEUNERS —————
  'pdj-porridge': {
    name: 'Porridge gainer', emoji: '🥣', slot: 'pdj', kcal: 710, prot: 28, prep: '5 min',
    ingredients: [['flocons-avoine', 80], ['lait', 300], ['banane', 1], ['beurre-cacahuete', 25], ['miel', 10]],
    recipe: [
      'Verse les flocons et le lait dans un bol, 2 min 30 au micro-ondes.',
      'Ajoute le beurre de cacahuète et le miel, mélange.',
      'Coupe la banane en rondelles par-dessus.',
    ],
    astuce: 'Préparable la veille en version overnight oats (au frigo, zéro cuisson).',
  },
  'pdj-skyr': {
    name: 'Skyr bowl puissance', emoji: '🫐', slot: 'pdj', kcal: 735, prot: 48, prep: '3 min',
    ingredients: [['skyr', 300], ['flocons-avoine', 70], ['banane', 1], ['amandes', 25], ['miel', 15]],
    recipe: [
      'Verse le skyr dans un bol, ajoute les flocons et le miel.',
      'Banane en rondelles + amandes par-dessus. C’est tout.',
    ],
    astuce: 'Le petit-déj le plus riche en protéines — parfait les jours de tractions.',
  },
  'pdj-oeufs': {
    name: 'Œufs brouillés & tartines', emoji: '🍳', slot: 'pdj', kcal: 670, prot: 40, prep: '8 min',
    ingredients: [['oeuf', 4], ['pain-complet', 80], ['beurre', 10], ['lait', 250]],
    recipe: [
      'Bats 4 œufs, cuis-les au beurre à feu doux en remuant.',
      'Sers sur les tartines de pain complet, avec un grand verre de lait.',
    ],
  },
  'pdj-pain-perdu': {
    name: 'Pain perdu du sportif', emoji: '🍞', slot: 'pdj', kcal: 705, prot: 34, prep: '10 min',
    ingredients: [['oeuf', 3], ['pain-complet', 80], ['lait', 200], ['beurre', 10], ['miel', 15], ['banane', 1]],
    recipe: [
      'Bats les œufs avec le lait, trempe les tranches de pain dedans.',
      'Dore au beurre à la poêle, 2 min par face.',
      'Miel + banane par-dessus. Petit-déj de champion.',
    ],
  },
  'pdj-crepes-avoine': {
    name: 'Crêpes d’avoine', emoji: '🥞', slot: 'pdj', kcal: 725, prot: 31, prep: '12 min',
    ingredients: [['flocons-avoine', 80], ['oeuf', 2], ['lait', 150], ['banane', 1], ['miel', 15], ['beurre-cacahuete', 15]],
    recipe: [
      'Mixe flocons + œufs + lait + la moitié de la banane au blender.',
      'Cuis 3-4 crêpes épaisses à la poêle.',
      'Garnis : beurre de cacahuète, miel, reste de banane.',
    ],
    astuce: 'La pâte se garde 2 jours au frigo — double les doses le dimanche.',
  },
  'pdj-muesli': {
    name: 'Muesli géant', emoji: '🥛', slot: 'pdj', kcal: 795, prot: 42, prep: '2 min',
    ingredients: [['flocons-avoine', 80], ['lait-entier', 300], ['skyr', 150], ['amandes', 20], ['mix-fruits-secs', 30]],
    recipe: ['Tout dans un grand bol, mélange, mange. Le petit-déj le plus rapide du programme.'],
  },
  'pdj-fromage-blanc': {
    name: 'Bowl fromage blanc', emoji: '🥥', slot: 'pdj', kcal: 695, prot: 37, prep: '3 min',
    ingredients: [['fromage-blanc', 300], ['flocons-avoine', 70], ['banane', 1], ['miel', 15], ['amandes', 15]],
    recipe: [
      'Fromage blanc + flocons + miel dans un bol, mélange.',
      'Banane en rondelles et amandes par-dessus.',
    ],
    astuce: 'Le fromage blanc est la protéine la moins chère du rayon frais — 2× moins cher que le skyr.',
  },
  'pdj-mug-cake': {
    name: 'Bowl cake choco-banane', emoji: '🍰', slot: 'pdj', kcal: 705, prot: 30, prep: '5 min',
    ingredients: [['flocons-avoine', 70], ['oeuf', 2], ['banane', 1], ['cacao', 10], ['miel', 15], ['lait', 100], ['beurre-cacahuete', 15]],
    recipe: [
      'Écrase la banane, mélange avec œufs, flocons, cacao, miel et lait dans un grand bol.',
      '3 min au micro-ondes puissance max. Beurre de cacahuète fondu par-dessus.',
    ],
    astuce: 'Un gâteau au petit-déj, texture moelleuse — et pourtant 100 % dans le plan.',
  },
  'pdj-omelette-fromage': {
    name: 'Omelette-fromage & tartines', emoji: '🫓', slot: 'pdj', kcal: 685, prot: 36, prep: '8 min',
    ingredients: [['oeuf', 3], ['parmesan', 20], ['pain-complet', 80], ['beurre', 10], ['fruit', 1], ['lait', 150]],
    recipe: ['Omelette de 3 œufs au fromage, tartines beurrées, un fruit et un verre de lait.'],
  },
  'pdj-overnight': {
    name: 'Overnight oats', emoji: '🌙', slot: 'pdj', kcal: 675, prot: 33, prep: '0 min (fait la veille)',
    ingredients: [['flocons-avoine', 80], ['lait', 250], ['skyr', 100], ['miel', 15], ['mix-fruits-secs', 30]],
    recipe: [
      'La veille : tout dans un bocal, mélange, frigo.',
      'Le matin : attrape le bocal, c’est prêt. Le petit-déj des matins pressés.',
    ],
  },
  'pdj-riz-au-lait': {
    name: 'Riz au lait du sportif', emoji: '🍚', slot: 'pdj', kcal: 780, prot: 33, prep: 'meal prep',
    ingredients: [['riz', 60], ['lait-entier', 400], ['miel', 20], ['amandes', 15], ['banane', 1], ['skyr', 100]],
    recipe: [
      'Cuis le riz dans le lait à feu doux 25 min (fais-en pour 3 jours le dimanche).',
      'Sers froid avec miel, skyr, banane et amandes.',
    ],
  },
  'pdj-tartines-pb': {
    name: 'Tartines PB-banane + skyr', emoji: '🥜', slot: 'pdj', kcal: 650, prot: 40, prep: '3 min',
    ingredients: [['pain-complet', 100], ['beurre-cacahuete', 25], ['banane', 1], ['skyr', 200], ['miel', 10]],
    recipe: ['Grosses tartines beurre de cacahuète + banane en rondelles. Bol de skyr au miel à côté.'],
  },
  'pdj-croque': {
    name: 'Croque-monsieur maison ×2', emoji: '🥪', slot: 'pdj', kcal: 670, prot: 40, prep: '10 min',
    ingredients: [['pain-complet', 100], ['jambon', 80], ['parmesan', 30], ['beurre', 10], ['fruit', 1]],
    recipe: [
      'Deux croques : pain, jambon, fromage râpé, à la poêle avec un couvercle (ou grille-pain).',
      'Un fruit pour finir. Petit-déj salé qui cale bien.',
    ],
  },
  // ————— COLLATIONS PLAGE —————
  'col-sandwich-thon': {
    name: 'Sandwich thon', emoji: '🥪', slot: 'col', kcal: 460, prot: 34, prep: '4 min',
    ingredients: [['pain-complet', 90], ['thon', 140], ['mayo', 15]],
    recipe: [
      'Mélange le thon égoutté avec la mayo.',
      'Tartine entre deux belles tranches de pain complet.',
    ],
    astuce: 'Se prépare le matin, tient très bien dans un sac à la plage (glacière si possible).',
  },
  'col-oeufs': {
    name: 'Œufs durs & banane', emoji: '🥚', slot: 'col', kcal: 450, prot: 24, prep: '0 min si meal prep',
    ingredients: [['oeuf', 3], ['pain-complet', 60], ['banane', 1]],
    recipe: ['Œufs durs cuits le dimanche (10 min à l’eau bouillante), à emporter avec pain et banane.'],
    astuce: 'Zéro préparation le matin : tout est prêt depuis le meal prep.',
  },
  'col-mix': {
    name: 'Mix du plagiste', emoji: '🥜', slot: 'col', kcal: 400, prot: 7, prep: '0 min',
    ingredients: [['mix-fruits-secs', 40], ['banane', 1], ['barre-cereales', 1]],
    recipe: ['Un sachet de mix fruits secs + banane + barre. Tient dans la poche, résiste au soleil.'],
  },
  'col-wrap-poulet': {
    name: 'Wrap poulet-fromage', emoji: '🌯', slot: 'col', kcal: 455, prot: 29, prep: '3 min',
    ingredients: [['tortilla', 1], ['poulet', 80], ['parmesan', 15], ['banane', 1]],
    recipe: [
      'Roule le poulet du meal prep + fromage râpé dans la tortilla.',
      'Banane en dessert. Se mange froid sans problème.',
    ],
  },
  'col-skyr-shake': {
    name: 'Yaourt à boire maison', emoji: '🥛', slot: 'col', kcal: 475, prot: 34, prep: '2 min',
    ingredients: [['skyr', 200], ['lait', 200], ['miel', 20], ['banane', 1], ['flocons-avoine', 30]],
    recipe: ['Secoue skyr + lait + miel dans une gourde. Banane et flocons à part (ou tout au blender).'],
    astuce: 'Gourde isotherme = reste frais toute la matinée à la plage.',
  },
  'col-pain-pb': {
    name: 'Tartines cacahuète-miel', emoji: '🍯', slot: 'col', kcal: 500, prot: 17, prep: '2 min',
    ingredients: [['pain-complet', 80], ['beurre-cacahuete', 30], ['miel', 10], ['banane', 1]],
    recipe: ['Deux grosses tartines beurre de cacahuète + miel, banane par-dessus ou à part.'],
  },
  'col-fb-pot': {
    name: 'Pot fromage blanc à emporter', emoji: '🫙', slot: 'col', kcal: 430, prot: 26, prep: '2 min',
    ingredients: [['fromage-blanc', 250], ['flocons-avoine', 40], ['miel', 15], ['fruit', 1]],
    recipe: ['Dans un bocal : fromage blanc + flocons + miel. Le fruit à part. Glacière si possible.'],
  },
  'col-compote-oeufs': {
    name: 'Snack plage équilibré', emoji: '🍎', slot: 'col', kcal: 430, prot: 17, prep: '0 min si meal prep',
    ingredients: [['compote', 2], ['amandes', 25], ['oeuf', 2]],
    recipe: ['2 œufs durs du meal prep + 2 compotes à boire + une poignée d’amandes. Tient parfaitement au soleil.'],
  },
  'col-jambon': {
    name: 'Sandwich jambon-beurre', emoji: '🥖', slot: 'col', kcal: 505, prot: 27, prep: '3 min',
    ingredients: [['pain-complet', 80], ['jambon', 80], ['beurre', 10], ['yaourt', 1], ['fruit', 1]],
    recipe: ['Le classique : pain, beurre, jambon. Yaourt à boire et fruit à côté.'],
  },
  'col-skyr-barre': {
    name: 'Skyr-barre-banane', emoji: '🍌', slot: 'col', kcal: 430, prot: 28, prep: '1 min',
    ingredients: [['skyr', 200], ['barre-cereales', 1], ['banane', 1], ['amandes', 20]],
    recipe: ['Pot de skyr + barre émiettée dedans + banane + amandes. Zéro cuisine.'],
  },
  'col-avocat-oeufs': {
    name: 'Tartine avocat-œufs', emoji: '🥑', slot: 'col', kcal: 460, prot: 22, prep: '4 min',
    ingredients: [['pain-complet', 80], ['avocat', 0.5], ['oeuf', 2]],
    recipe: [
      'Écrase le demi-avocat sur le pain, sel-poivre-citron.',
      'Œufs durs du meal prep en rondelles par-dessus. Bons gras au menu.',
    ],
  },
  'col-cookies': {
    name: 'Cookies d’avoine maison', emoji: '🍪', slot: 'col', kcal: 440, prot: 12, prep: 'meal prep',
    ingredients: [['flocons-avoine', 50], ['beurre-cacahuete', 20], ['miel', 15], ['banane', 1]],
    recipe: [
      'Dimanche : écrase 3 bananes + 150g flocons + 60g beurre de cacahuète + miel, forme 9 cookies, 15 min au four à 180°.',
      'Emporte-en 3 à la plage — la portion indiquée.',
    ],
    astuce: 'Se gardent 4-5 jours dans une boîte. Le goûter maison le moins cher du plan.',
  },
  'col-lait-choco': {
    name: 'Lait chocolaté + banane', emoji: '🍫', slot: 'col', kcal: 450, prot: 17, prep: '2 min',
    ingredients: [['lait-entier', 400], ['cacao', 15], ['miel', 15], ['banane', 1]],
    recipe: ['Secoue lait + cacao + miel dans une gourde isotherme. La banane voyage à côté.'],
    astuce: 'Le lait chocolaté est étudié comme boisson de récup : glucides + protéines au bon ratio.',
  },
  'col-pain-fromage': {
    name: 'Pain-fromage-fruit', emoji: '🧀', slot: 'col', kcal: 420, prot: 17, prep: '1 min',
    ingredients: [['pain-complet', 60], ['fromage-portions', 3], ['fruit', 1]],
    recipe: ['3 portions de fromage, du pain, un fruit. Le snack qui survit à une journée de sac.'],
  },
  // ————— DÉJEUNERS (BOX MEAL PREP) —————
  'dej-riz-poulet': {
    name: 'Box riz-poulet', emoji: '🍗', slot: 'dej', kcal: 770, prot: 46, prep: 'meal prep',
    ingredients: [['riz', 100], ['poulet', 150], ['huile-olive', 10], ['legumes', 200]],
    recipe: [
      'Riz et poulet cuits le dimanche (poulet en morceaux à la poêle, bien assaisonné).',
      'Assemble en boîte : riz + poulet + légumes + filet d’huile d’olive.',
      'Se mange froid ou réchauffé. 3 boîtes d’avance au frigo.',
    ],
    astuce: 'L’huile d’olive c’est +90 kcal gratuites : ne la saute pas.',
  },
  'dej-pates-thon': {
    name: 'Box pâtes-thon', emoji: '🍝', slot: 'dej', kcal: 765, prot: 48, prep: 'meal prep',
    ingredients: [['pates', 120], ['thon', 140], ['sauce-tomate', 150], ['huile-olive', 10], ['parmesan', 15]],
    recipe: [
      'Pâtes cuites le dimanche, mélangées à la sauce tomate.',
      'Ajoute le thon égoutté, l’huile et le parmesan dans la boîte.',
      'Excellent froid en salade de pâtes — parfait pour la plage.',
    ],
  },
  'dej-riz-lentilles': {
    name: 'Box riz-lentilles-œufs', emoji: '🍛', slot: 'dej', kcal: 835, prot: 41, prep: 'meal prep',
    ingredients: [['riz', 80], ['lentilles', 70], ['oeuf', 3], ['huile-olive', 10]],
    recipe: [
      'Lentilles corail : 10 min dans l’eau bouillante, avec le riz du meal prep.',
      'Ajoute 3 œufs durs coupés en deux + huile d’olive + sel, cumin.',
    ],
    astuce: 'Le combo riz + lentilles = protéine complète, et c’est le déj le moins cher.',
  },
  'dej-couscous-poulet': {
    name: 'Box couscous-poulet', emoji: '🫘', slot: 'dej', kcal: 855, prot: 54, prep: 'meal prep',
    ingredients: [['semoule', 100], ['poulet', 140], ['pois-chiches', 100], ['huile-olive', 10], ['legumes', 150]],
    recipe: [
      'Semoule : verse le même volume d’eau bouillante, couvre 5 min, égrène.',
      'Ajoute poulet du meal prep, pois chiches, légumes, huile, ras-el-hanout.',
    ],
    astuce: 'La semoule est prête en 5 min — le glucide le plus rapide de la semaine.',
  },
  'dej-salade-riz': {
    name: 'Salade de riz complète', emoji: '🥗', slot: 'dej', kcal: 760, prot: 47, prep: 'meal prep',
    ingredients: [['riz', 90], ['thon', 140], ['oeuf', 2], ['mais', 80], ['huile-olive', 10]],
    recipe: [
      'Riz froid du meal prep + thon + œufs durs + maïs + huile d’olive.',
      'Sel, poivre, un trait de vinaigre si tu en as. Parfaite froide.',
    ],
  },
  'dej-wraps-thon': {
    name: 'Wraps thon-maïs', emoji: '🌯', slot: 'dej', kcal: 735, prot: 38, prep: '5 min',
    ingredients: [['tortilla', 2], ['thon', 140], ['mayo', 20], ['mais', 50], ['fruit', 1]],
    recipe: [
      'Mélange thon + mayo + maïs, répartis dans 2 tortillas, roule serré.',
      'Un fruit en dessert. Le déj le plus transportable du programme.',
    ],
  },
  'dej-salade-lentilles': {
    name: 'Salade lentilles-thon', emoji: '🥙', slot: 'dej', kcal: 710, prot: 54, prep: 'meal prep',
    ingredients: [['lentilles-vertes', 90], ['thon', 140], ['tomates', 150], ['huile-olive', 10], ['pain-complet', 60]],
    recipe: [
      'Lentilles cuites le dimanche (20 min à l’eau, sans sel au départ).',
      'Mélange lentilles froides + thon + tomates en dés + huile + vinaigre.',
      'Le pain à côté. Riche en fer et en fibres, excellente froide.',
    ],
    astuce: 'Une des meilleures assiettes santé/prix qui existe : ~2 € la box.',
  },
  'dej-taboule-poulet': {
    name: 'Taboulé poulet d’été', emoji: '🥗', slot: 'dej', kcal: 775, prot: 51, prep: 'meal prep',
    ingredients: [['semoule', 90], ['poulet', 140], ['tomates', 100], ['concombre', 100], ['pois-chiches', 80], ['huile-olive', 10]],
    recipe: [
      'Semoule gonflée à l’eau bouillante (5 min à couvert).',
      'Ajoute tomates + concombre en dés, pois chiches, poulet du meal prep, huile, citron, menthe si tu as.',
    ],
    astuce: 'LE plat de plagiste : frais, léger à digérer, plein de protéines.',
  },
  'dej-riz-sardines': {
    name: 'Box riz-sardines', emoji: '🐟', slot: 'dej', kcal: 715, prot: 36, prep: 'meal prep',
    ingredients: [['riz', 90], ['sardines', 90], ['tomates', 150], ['pois-chiches', 100], ['huile-olive', 5]],
    recipe: [
      'Riz froid du meal prep + sardines égouttées écrasées à la fourchette.',
      'Tomates en dés + pois chiches + un filet d’huile et de citron.',
    ],
    astuce: 'Les sardines = oméga-3 + calcium pour ~1 € la boîte. Le meilleur poisson du supermarché.',
  },
  'dej-pates-courgettes': {
    name: 'Pâtes poulet-courgettes', emoji: '🥒', slot: 'dej', kcal: 795, prot: 53, prep: 'meal prep',
    ingredients: [['pates', 110], ['poulet', 140], ['courgette', 150], ['huile-olive', 10], ['parmesan', 15]],
    recipe: [
      'Courgette en demi-rondelles sautées 5 min à la poêle.',
      'Mélange avec pâtes et poulet du meal prep, huile, parmesan. Bonne froide aussi.',
    ],
  },
  'dej-wraps-omelette': {
    name: 'Wraps omelette-fromage', emoji: '🌯', slot: 'dej', kcal: 725, prot: 35, prep: '8 min',
    ingredients: [['tortilla', 2], ['oeuf', 3], ['parmesan', 20], ['tomates', 100], ['fruit', 1]],
    recipe: [
      'Omelette fine de 3 œufs au fromage, roulée dans les tortillas avec les tomates.',
      'Se mange froid à la plage sans problème.',
    ],
  },
  'dej-pates-jambon': {
    name: 'Pâtes jambon-crème', emoji: '🍝', slot: 'dej', kcal: 725, prot: 39, prep: 'meal prep',
    ingredients: [['pates', 130], ['jambon', 80], ['creme', 60], ['legumes', 150], ['parmesan', 10]],
    recipe: ['Pâtes du meal prep + jambon en lamelles + crème + petits légumes. Réchauffe ou mange froid en salade.'],
  },
  'dej-semoule-boulettes': {
    name: 'Semoule-boulettes maison', emoji: '🧆', slot: 'dej', kcal: 735, prot: 39, prep: 'meal prep',
    ingredients: [['semoule', 90], ['steak-hache', 100], ['sauce-tomate', 150], ['pois-chiches', 60], ['huile-olive', 5]],
    recipe: [
      'Dimanche : forme des boulettes avec le steak haché + épices, cuis-les à la poêle.',
      'Assemble : semoule + boulettes + sauce tomate + pois chiches.',
    ],
  },
  'dej-pdt-thon': {
    name: 'Salade pommes de terre-thon', emoji: '🥔', slot: 'dej', kcal: 710, prot: 45, prep: 'meal prep',
    ingredients: [['patates', 350], ['thon', 140], ['haricots-verts', 150], ['oeuf', 1], ['huile-olive', 10], ['pain-complet', 40]],
    recipe: [
      'Pommes de terre cuites le dimanche, en dés avec thon, haricots verts, œuf dur.',
      'Vinaigrette huile-moutarde. Encore meilleure le lendemain.',
    ],
  },
  'dej-couscous-vege': {
    name: 'Couscous végé œufs-pois chiches', emoji: '🌱', slot: 'dej', kcal: 825, prot: 38, prep: '10 min',
    ingredients: [['semoule', 100], ['pois-chiches', 150], ['oeuf', 2], ['legumes', 150], ['huile-olive', 10]],
    recipe: ['Semoule 5 min à l’eau bouillante + pois chiches + légumes + 2 œufs durs + huile et ras-el-hanout.'],
    astuce: 'Journée sans viande ni poisson — ton portefeuille et la planète disent merci.',
  },
  'dej-pates-sardines': {
    name: 'Pâtes aux sardines', emoji: '🐟', slot: 'dej', kcal: 730, prot: 38, prep: 'meal prep',
    ingredients: [['pates', 120], ['sardines', 90], ['sauce-tomate', 150], ['huile-olive', 5]],
    recipe: [
      'Écrase les sardines dans la sauce tomate chaude, mélange aux pâtes.',
      'Classique sicilien, version plagiste. Excellent froid aussi.',
    ],
  },
  'dej-salade-pois-chiches': {
    name: 'Salade pois chiches-thon', emoji: '🥗', slot: 'dej', kcal: 650, prot: 47, prep: '5 min',
    ingredients: [['pois-chiches', 200], ['thon', 140], ['tomates', 150], ['concombre', 100], ['huile-olive', 10], ['pain-complet', 60]],
    recipe: ['Tout dans une boîte : pois chiches égouttés, thon, tomates, concombre, huile-citron. Pain à côté.'],
  },
  // ————— POST-BOULOT —————
  'smo-gainer': {
    name: 'Smoothie gainer maison', emoji: '🥤', slot: 'smo', kcal: 655, prot: 32, prep: '3 min',
    ingredients: [['lait-entier', 250], ['flocons-avoine', 50], ['banane', 1], ['beurre-cacahuete', 20], ['skyr', 100], ['miel', 10]],
    recipe: [
      'Tout au blender 30 secondes : lait entier, flocons, banane, beurre de cacahuète, skyr, miel.',
      'À boire en rentrant du boulot ou juste après la séance.',
    ],
    astuce: 'Ton « gainer » maison : 3× moins cher qu’en magasin et sans cochonneries.',
  },
  'smo-choco': {
    name: 'Smoothie choco-banane', emoji: '🍫', slot: 'smo', kcal: 550, prot: 28, prep: '3 min',
    ingredients: [['lait-entier', 250], ['flocons-avoine', 40], ['banane', 1], ['cacao', 15], ['skyr', 100], ['miel', 15]],
    recipe: ['Tout au blender : lait entier, flocons, banane, cacao, skyr, miel. Goût milkshake, prix étudiant.'],
  },
  'smo-skyr-gouter': {
    name: 'Skyr miel-amandes', emoji: '🍯', slot: 'smo', kcal: 430, prot: 38, prep: '2 min',
    ingredients: [['skyr', 300], ['amandes', 20], ['miel', 20]],
    recipe: ['Skyr + miel + amandes. Le goûter express des jours off.'],
  },
  'smo-fruits-rouges': {
    name: 'Smoothie fruits rouges', emoji: '🍓', slot: 'smo', kcal: 555, prot: 34, prep: '3 min',
    ingredients: [['lait-entier', 300], ['skyr', 150], ['fruits-rouges', 150], ['flocons-avoine', 40], ['miel', 20]],
    recipe: ['Tout au blender. Les fruits surgelés le rendent bien frais — parfait après une journée au soleil.'],
  },
  'smo-cafe': {
    name: 'Iced coffee protéiné', emoji: '☕', slot: 'smo', kcal: 560, prot: 33, prep: '3 min',
    ingredients: [['lait-entier', 300], ['skyr', 150], ['banane', 1], ['flocons-avoine', 40], ['miel', 10]],
    recipe: [
      'Un café refroidi (ou 1 c.à.c de café soluble) + tout le reste au blender avec des glaçons.',
      'Le boost de fin de journée de plage.',
    ],
  },
  'smo-fb-choco': {
    name: 'Mousse choco protéinée', emoji: '🍮', slot: 'smo', kcal: 450, prot: 31, prep: '3 min',
    ingredients: [['fromage-blanc', 250], ['lait', 200], ['banane', 1], ['cacao', 15], ['miel', 15]],
    recipe: ['Tout au blender (ou fouette énergiquement) : texture mousse au chocolat, macros de sportif.'],
  },
  'smo-peche': {
    name: 'Smoothie fruits d’été', emoji: '🍑', slot: 'smo', kcal: 530, prot: 30, prep: '3 min',
    ingredients: [['skyr', 150], ['yaourt', 1], ['fruit', 2], ['flocons-avoine', 40], ['miel', 15], ['lait', 100]],
    recipe: ['Pêches ou abricots de saison + skyr + yaourt + flocons + miel + lait, au blender avec des glaçons.'],
  },
  'smo-milkshake-banane': {
    name: 'Milkshake banane-miel', emoji: '🥛', slot: 'smo', kcal: 555, prot: 27, prep: '3 min',
    ingredients: [['lait-entier', 350], ['banane', 1], ['flocons-avoine', 30], ['miel', 20], ['skyr', 100]],
    recipe: ['Tout au blender avec des glaçons. Le plus simple des post-boulot.'],
  },
  'smo-porridge-froid': {
    name: 'Porridge froid choco', emoji: '🍫', slot: 'smo', kcal: 525, prot: 29, prep: '2 min',
    ingredients: [['fromage-blanc', 200], ['lait', 150], ['flocons-avoine', 40], ['cacao', 10], ['miel', 15], ['banane', 1]],
    recipe: ['Mélange tout à la cuillère (pas besoin de blender). Texture crème dessert, macros de sportif.'],
  },
  'smo-yaourt-fruits-rouges': {
    name: 'Smoothie yaourt-fruits rouges', emoji: '🍓', slot: 'smo', kcal: 530, prot: 29, prep: '3 min',
    ingredients: [['yaourt', 2], ['skyr', 100], ['fruits-rouges', 150], ['flocons-avoine', 40], ['miel', 20], ['lait', 100]],
    recipe: ['Au blender — les fruits rouges surgelés font office de glaçons.'],
  },
  'smo-gouter-tartines': {
    name: 'Tartines + lait choco', emoji: '🍞', slot: 'smo', kcal: 530, prot: 22, prep: '3 min',
    ingredients: [['pain-complet', 60], ['beurre-cacahuete', 20], ['lait-entier', 300], ['cacao', 10], ['miel', 10]],
    recipe: ['Le goûter d’enfance version gains : tartines de beurre de cacahuète + grand lait chocolaté.'],
  },
  'smo-nice-cream': {
    name: 'Glace banane protéinée', emoji: '🍦', slot: 'smo', kcal: 445, prot: 27, prep: '3 min',
    ingredients: [['banane', 2], ['lait', 100], ['beurre-cacahuete', 15], ['cacao', 10], ['skyr', 150]],
    recipe: [
      'Congèle des bananes en rondelles (dimanche).',
      'Blender : bananes congelées + skyr + lait + cacao + PB = glace crémeuse minute.',
    ],
    astuce: 'La « nice cream » : le dessert glacé de l’été qui compte comme un vrai apport.',
  },
  // ————— DÎNERS —————
  'din-omelette': {
    name: 'Omelette fromagère + riz', emoji: '🧀', slot: 'din', kcal: 770, prot: 42, prep: '10 min',
    ingredients: [['oeuf', 4], ['parmesan', 30], ['riz', 90], ['legumes', 150]],
    recipe: [
      'Réchauffe le riz du meal prep avec les légumes.',
      'Omelette de 4 œufs au fromage râpé, à peine baveuse.',
    ],
  },
  'din-pates-poulet': {
    name: 'Pâtes crémeuses au poulet', emoji: '🍲', slot: 'din', kcal: 805, prot: 56, prep: '12 min',
    ingredients: [['pates', 110], ['poulet', 150], ['creme', 80], ['parmesan', 15]],
    recipe: [
      'Réchauffe le poulet du meal prep à la poêle.',
      'Ajoute la crème, le parmesan, puis les pâtes cuites. Poivre généreusement.',
    ],
  },
  'din-riz-thon': {
    name: 'Riz thon coco-curry', emoji: '🍛', slot: 'din', kcal: 725, prot: 38, prep: '10 min',
    ingredients: [['riz', 100], ['thon', 140], ['lait-coco', 100], ['legumes', 150]],
    recipe: [
      'Fais chauffer le lait de coco avec du curry, ajoute les légumes.',
      'Ajoute le thon, sers sur le riz du meal prep.',
    ],
    astuce: 'Le dîner « restaurant » de la semaine, pour 2,50 €.',
  },
  'din-riz-saute': {
    name: 'Riz sauté œufs-poulet', emoji: '🥡', slot: 'din', kcal: 835, prot: 53, prep: '12 min',
    ingredients: [['riz', 80], ['oeuf', 3], ['poulet', 100], ['legumes', 150], ['huile-olive', 10]],
    recipe: [
      'Poêle bien chaude : légumes puis riz froid du meal prep, remue fort.',
      'Pousse sur le côté, brouille les œufs, ajoute le poulet.',
      'Sauce soja si tu en as. Style cantine chinoise, prix étudiant.',
    ],
    astuce: 'Le riz de la veille saute mieux que le riz frais — merci le meal prep.',
  },
  'din-pates-pesto': {
    name: 'Pâtes pesto-poulet', emoji: '🌿', slot: 'din', kcal: 875, prot: 53, prep: '10 min',
    ingredients: [['pates', 130], ['poulet', 130], ['pesto', 30], ['parmesan', 15]],
    recipe: [
      'Réchauffe les pâtes avec une louche d’eau, ajoute le pesto hors du feu.',
      'Poulet du meal prep + parmesan. Prêt en 10 minutes chrono.',
    ],
  },
  'din-chili': {
    name: 'Chili express', emoji: '🌶️', slot: 'din', kcal: 790, prot: 46, prep: '15 min',
    ingredients: [['steak-hache', 125], ['haricots-rouges', 200], ['riz', 80], ['sauce-tomate', 150]],
    recipe: [
      'Fais revenir le steak haché émietté, ajoute sauce tomate + haricots.',
      'Cumin, paprika, 5 min à feu doux. Sers sur le riz du meal prep.',
    ],
    astuce: 'Double les doses : le chili est encore meilleur réchauffé le lendemain.',
  },
  'din-poulet-patates': {
    name: 'Poulet, patates & haricots verts', emoji: '🍽️', slot: 'din', kcal: 685, prot: 47, prep: '20 min',
    ingredients: [['poulet', 160], ['patates', 350], ['haricots-verts', 200], ['huile-olive', 10]],
    recipe: [
      'Pommes de terre en dés : 8 min au micro-ondes puis dorées à la poêle.',
      'Poulet du meal prep réchauffé + haricots verts. Le dîner « équilibré de base », efficace.',
    ],
  },
  'din-steak-rata': {
    name: 'Steak haché, riz & ratatouille', emoji: '🥘', slot: 'din', kcal: 745, prot: 40, prep: '12 min',
    ingredients: [['steak-hache', 125], ['ratatouille', 200], ['riz', 90], ['parmesan', 15]],
    recipe: [
      'Steak haché à la poêle, ratatouille réchauffée dedans.',
      'Sers sur le riz du meal prep, parmesan par-dessus. Fer + légumes sans effort.',
    ],
  },
  'din-maquereau-patates': {
    name: 'Maquereau & pommes de terre', emoji: '🎣', slot: 'din', kcal: 735, prot: 37, prep: '15 min',
    ingredients: [['maquereau', 120], ['patates', 350], ['oeuf', 1], ['pain-complet', 40], ['huile-olive', 5]],
    recipe: [
      'Pommes de terre vapeur ou micro-ondes, en salade tiède avec huile et vinaigre.',
      'Filets de maquereau + 1 œuf dur. Oméga-3 au max pour 2,50 €.',
    ],
    astuce: 'Maquereau et sardines : les poissons gras les moins chers, parfaits 2×/semaine.',
  },
  'din-curry-pois-chiches': {
    name: 'Curry poulet-pois chiches', emoji: '🍛', slot: 'din', kcal: 890, prot: 47, prep: '15 min',
    ingredients: [['pois-chiches', 150], ['poulet', 120], ['lait-coco', 100], ['sauce-tomate', 100], ['riz', 80]],
    recipe: [
      'Lait de coco + sauce tomate + curry à la poêle, 3 min.',
      'Ajoute pois chiches et poulet du meal prep, laisse mijoter 5 min. Sers sur le riz.',
    ],
  },
  'din-gratin-thon': {
    name: 'Gratin de pâtes au thon', emoji: '🧀', slot: 'din', kcal: 790, prot: 53, prep: '20 min',
    ingredients: [['pates', 110], ['thon', 140], ['creme', 80], ['parmesan', 30], ['legumes', 150]],
    recipe: [
      'Pâtes du meal prep + thon + crème + légumes dans un plat.',
      'Fromage râpé par-dessus, 12 min au four bien chaud (ou couvercle à la poêle).',
    ],
  },
  'din-hachis': {
    name: 'Hachis parmentier express', emoji: '🥧', slot: 'din', kcal: 725, prot: 43, prep: '20 min',
    ingredients: [['patates', 400], ['steak-hache', 125], ['parmesan', 20], ['lait', 100], ['legumes', 100]],
    recipe: [
      'Purée maison (patates micro-ondes + lait), steak haché revenu en dessous.',
      'Fromage râpé, 5 min sous le gril si tu as un four.',
    ],
  },
  'din-curry-oeufs': {
    name: 'Curry d’œufs coco (végé)', emoji: '🍛', slot: 'din', kcal: 830, prot: 35, prep: '12 min',
    ingredients: [['riz', 80], ['oeuf', 3], ['lait-coco', 100], ['legumes', 150], ['pois-chiches', 80]],
    recipe: [
      'Lait de coco + curry + légumes + pois chiches, 5 min à la poêle.',
      'Ajoute 3 œufs durs coupés en deux, sers sur le riz.',
    ],
  },
  'din-poelee-poulet': {
    name: 'Poêlée poulet-légumes du soleil', emoji: '🍗', slot: 'din', kcal: 675, prot: 49, prep: '15 min',
    ingredients: [['poulet', 160], ['patates', 300], ['courgette', 150], ['huile-olive', 10], ['parmesan', 15]],
    recipe: ['Tout à la poêle : patates précuites au micro-ondes, poulet du meal prep, courgettes. Fromage à la fin.'],
  },
  'din-bolo': {
    name: 'Spaghetti bolognaise', emoji: '🍝', slot: 'din', kcal: 815, prot: 48, prep: '15 min',
    ingredients: [['pates', 120], ['steak-hache', 125], ['sauce-tomate', 200], ['parmesan', 15]],
    recipe: [
      'Steak haché émietté à la poêle, sauce tomate, origan, 5 min de mijotage.',
      'Sur les pâtes, parmesan généreux. La valeur sûre.',
    ],
  },
  'din-tortilla-espagnole': {
    name: 'Tortilla espagnole', emoji: '🇪🇸', slot: 'din', kcal: 750, prot: 35, prep: '18 min',
    ingredients: [['patates', 350], ['oeuf', 4], ['huile-olive', 10], ['pain-complet', 40]],
    recipe: [
      'Pommes de terre en fines tranches dorées à la poêle.',
      'Verse 4 œufs battus dessus, cuis à couvert 6-8 min. Se mange chaude ou froide.',
    ],
  },
  'din-colin-riz': {
    name: 'Colin-riz-légumes', emoji: '🐠', slot: 'din', kcal: 685, prot: 44, prep: '15 min',
    ingredients: [['poisson-blanc', 200], ['riz', 100], ['legumes', 150], ['huile-olive', 10]],
    recipe: [
      'Filets de colin surgelés : 8-10 min à la poêle avec un couvercle, citron.',
      'Riz du meal prep + légumes. Le dîner léger et propre de la semaine.',
    ],
    astuce: 'Le poisson blanc surgelé : ~7 €/kg, ultra maigre, parfait le soir.',
  },
  'din-puree-jambon': {
    name: 'Purée maison-jambon-fromage', emoji: '🥔', slot: 'din', kcal: 705, prot: 41, prep: '15 min',
    ingredients: [['patates', 400], ['lait', 100], ['beurre', 10], ['jambon', 120], ['parmesan', 20], ['legumes', 150]],
    recipe: ['Purée maison au micro-ondes (patates + lait + beurre), jambon et fromage râpé, légumes à côté.'],
  },
  'din-patates-oeufs': {
    name: 'Poêlée paysanne', emoji: '🥔', slot: 'din', kcal: 730, prot: 34, prep: '20 min',
    ingredients: [['patates', 400], ['oeuf', 3], ['parmesan', 30], ['huile-olive', 10]],
    recipe: [
      'Pommes de terre en dés, 8 min au micro-ondes puis dorées à la poêle.',
      'Casse les œufs par-dessus, couvre 3 min, fromage râpé à la fin.',
    ],
  },
}

// Menus des 7 jours (lundi → dimanche) — 4 semaines qui tournent : A, B, C, D.
// 28 journées différentes, chacune ≈ 3 100-3 400 kcal et ≥ 140 g de protéines
// (protéines : 1,6-2,2 g/kg recommandés — ici ~2,2 g/kg pour 77 kg).
export const WEEK_A = [
  ['pdj-porridge', 'col-sandwich-thon', 'dej-riz-poulet', 'smo-choco', 'din-omelette'],
  ['pdj-skyr', 'col-fb-pot', 'dej-pates-thon', 'smo-gainer', 'din-poulet-patates'],
  ['pdj-crepes-avoine', 'col-pain-pb', 'dej-salade-lentilles', 'smo-choco', 'din-steak-rata'],
  ['pdj-skyr', 'col-oeufs', 'dej-riz-poulet', 'smo-fruits-rouges', 'din-pates-pesto'],
  ['pdj-porridge', 'col-sandwich-thon', 'dej-taboule-poulet', 'smo-choco', 'din-riz-saute'],
  ['pdj-fromage-blanc', 'col-wrap-poulet', 'dej-wraps-thon', 'smo-gainer', 'din-chili'],
  ['pdj-pain-perdu', 'col-fb-pot', 'dej-riz-lentilles', 'smo-skyr-gouter', 'din-pates-poulet'],
]

export const WEEK_B = [
  ['pdj-muesli', 'col-oeufs', 'dej-salade-riz', 'smo-choco', 'din-poulet-patates'],
  ['pdj-fromage-blanc', 'col-sandwich-thon', 'dej-pates-courgettes', 'smo-peche', 'din-riz-thon'],
  ['pdj-skyr', 'col-compote-oeufs', 'dej-riz-sardines', 'smo-fb-choco', 'din-pates-poulet'],
  ['pdj-porridge', 'col-skyr-shake', 'dej-couscous-poulet', 'smo-choco', 'din-maquereau-patates'],
  ['pdj-crepes-avoine', 'col-oeufs', 'dej-riz-poulet', 'smo-cafe', 'din-curry-pois-chiches'],
  ['pdj-skyr', 'col-mix', 'dej-wraps-thon', 'smo-gainer', 'din-riz-saute'],
  ['pdj-oeufs', 'col-pain-pb', 'dej-riz-lentilles', 'smo-skyr-gouter', 'din-steak-rata'],
]

export const WEEK_C = [
  ['pdj-fromage-blanc', 'col-wrap-poulet', 'dej-taboule-poulet', 'smo-fruits-rouges', 'din-omelette'],
  ['pdj-porridge', 'col-fb-pot', 'dej-salade-lentilles', 'smo-gainer', 'din-pates-pesto'],
  ['pdj-muesli', 'col-compote-oeufs', 'dej-salade-riz', 'smo-fb-choco', 'din-poulet-patates'],
  ['pdj-crepes-avoine', 'col-sandwich-thon', 'dej-riz-poulet', 'smo-peche', 'din-chili'],
  ['pdj-skyr', 'col-oeufs', 'dej-pates-courgettes', 'smo-choco', 'din-maquereau-patates'],
  ['pdj-pain-perdu', 'col-skyr-shake', 'dej-riz-sardines', 'smo-gainer', 'din-pates-poulet'],
  ['pdj-fromage-blanc', 'col-mix', 'dej-riz-lentilles', 'smo-skyr-gouter', 'din-riz-saute'],
]

export const WEEK_D = [
  ['pdj-skyr', 'col-pain-pb', 'dej-salade-riz', 'smo-skyr-gouter', 'din-curry-pois-chiches'],
  ['pdj-crepes-avoine', 'col-sandwich-thon', 'dej-couscous-poulet', 'smo-fb-choco', 'din-riz-thon'],
  ['pdj-porridge', 'col-fb-pot', 'dej-taboule-poulet', 'smo-peche', 'din-steak-rata'],
  ['pdj-muesli', 'col-oeufs', 'dej-wraps-thon', 'smo-gainer', 'din-poulet-patates'],
  ['pdj-fromage-blanc', 'col-wrap-poulet', 'dej-pates-thon', 'smo-fruits-rouges', 'din-riz-saute'],
  ['pdj-oeufs', 'col-skyr-shake', 'dej-riz-sardines', 'smo-cafe', 'din-pates-pesto'],
  ['pdj-pain-perdu', 'col-compote-oeufs', 'dej-riz-lentilles', 'smo-skyr-gouter', 'din-omelette'],
]

const WEEKS = [
  { label: 'Semaine A', days: WEEK_A },
  { label: 'Semaine B', days: WEEK_B },
  { label: 'Semaine C', days: WEEK_C },
  { label: 'Semaine D', days: WEEK_D },
]

import { weekIndexSince, fromISO, weekDates, mondayOf } from './dates.js'
import { DEFAULT_GOALS } from './config.js'

// Plan de la semaine contenant `iso` (rotation A → B → C → D)
export function weekPlanFor(iso) {
  const idx = weekIndexSince(DEFAULT_GOALS.startDate, iso)
  return WEEKS[((idx % 4) + 4) % 4]
}

// Repas du jour (avec remplacements 🔄 appliqués) : [mealId × 5]
export function mealsForDate(iso, swaps = null) {
  const { days } = weekPlanFor(iso)
  const dayIdx = (fromISO(iso).getDay() + 6) % 7
  const base = days[dayIdx]
  const daySwaps = swaps?.[iso]
  if (!daySwaps) return base
  return base.map((id, i) => daySwaps[i] || id)
}

// Les 7 jours effectifs (remplacements inclus) de la semaine contenant `iso`
export function effectiveWeekDays(iso, swaps = null) {
  return weekDates(mondayOf(iso)).map((d) => mealsForDate(d, swaps))
}

// Alternatives proposées pour un créneau (pour le bouton 🔄)
export function alternativesFor(slotIdx, currentId) {
  const slot = SLOTS[slotIdx].id
  return Object.keys(MEALS).filter((id) => MEALS[id].slot === slot && id !== currentId)
}

export function dayTotals(mealIds) {
  return mealIds.reduce(
    (acc, id) => ({ kcal: acc.kcal + MEALS[id].kcal, prot: acc.prot + MEALS[id].prot }),
    { kcal: 0, prot: 0 },
  )
}

// Liste de courses agrégée pour une semaine de plan
export function shoppingList(days) {
  const totals = {}
  for (const day of days)
    for (const mealId of day)
      for (const [ing, qty] of MEALS[mealId].ingredients)
        totals[ing] = (totals[ing] || 0) + qty

  const byRayon = {}
  let budget = 0
  for (const [ing, qty] of Object.entries(totals)) {
    const info = INGREDIENTS[ing]
    const price = qty * info.price
    budget += price
    ;(byRayon[info.rayon] ||= []).push({ id: ing, name: info.name, qty, unit: info.unit, price })
  }
  for (const list of Object.values(byRayon)) list.sort((a, b) => b.price - a.price)
  return { byRayon, budget }
}

export function fmtQty(qty, unit) {
  if (unit === 'pc') return `× ${qty}`
  if (unit === 'g' && qty >= 1000) return `${(qty / 1000).toFixed(qty % 1000 === 0 ? 0 : 1)} kg`
  if (unit === 'ml' && qty >= 1000) return `${(qty / 1000).toFixed(1)} L`
  return `${qty} ${unit}`
}

// Meal prep du dimanche : quantités réelles calculées depuis le plan de la semaine
export function mealPrepSteps(days) {
  const totals = {}
  for (const day of days)
    for (const mealId of day)
      for (const [ing, qty] of MEALS[mealId].ingredients)
        totals[ing] = (totals[ing] || 0) + qty

  const boxes = days.flat().filter((id) => MEALS[id].prep === 'meal prep').length
  const kg = (g) => (g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g} g`)

  const steps = []
  if (totals.riz) steps.push({ time: '10 min', text: `Mets ${kg(totals.riz)} de riz à cuire dans une grande casserole (il servira toute la semaine).` })
  if (totals.pates) steps.push({ time: '12 min', text: `Pendant ce temps, cuis ${kg(totals.pates)} de pâtes al dente, égoutte, un filet d’huile pour qu’elles ne collent pas.` })
  if (totals.poulet) steps.push({ time: '15 min', text: `Coupe ${kg(totals.poulet)} de poulet en morceaux, cuis à la poêle en 2 fournées. Assaisonne fort : paprika, ail, herbes.` })
  if (totals.oeuf > 8) steps.push({ time: '12 min', text: `Fais durcir ${totals.oeuf - 8} œufs (10 min à l’eau bouillante) pour les collations et les box. Garde le reste des œufs pour les omelettes.` })
  if (boxes) steps.push({ time: '10 min', text: `Assemble ${boxes} box déjeuner (riz/pâtes + protéine + légumes + huile). Frigo : 3 jours max, congèle le reste.` })
  steps.push({ time: '5 min', text: 'Prépare 3 sachets « smoothie » (flocons + cacao déjà dosés) : le matin il ne reste qu’à blender avec lait et banane.' })
  steps.push({ time: '3 min', text: 'Portionne le mix fruits secs en sachets pour la plage. C’est plié pour la semaine 💪' })
  return steps
}
