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
  'din-patates-oeufs': {
    name: 'Poêlée paysanne', emoji: '🥔', slot: 'din', kcal: 730, prot: 34, prep: '20 min',
    ingredients: [['patates', 400], ['oeuf', 3], ['parmesan', 30], ['huile-olive', 10]],
    recipe: [
      'Pommes de terre en dés, 8 min au micro-ondes puis dorées à la poêle.',
      'Casse les œufs par-dessus, couvre 3 min, fromage râpé à la fin.',
    ],
  },
}

// Menus des 7 jours (lundi → dimanche) — 4 semaines qui tournent : A, B, C, D
export const WEEK_A = [
  ['pdj-porridge', 'col-sandwich-thon', 'dej-riz-poulet', 'smo-choco', 'din-omelette'],
  ['pdj-skyr', 'col-mix', 'dej-pates-thon', 'smo-gainer', 'din-riz-thon'],
  ['pdj-porridge', 'col-oeufs', 'dej-riz-poulet', 'smo-choco', 'din-pates-poulet'],
  ['pdj-skyr', 'col-sandwich-thon', 'dej-pates-thon', 'smo-gainer', 'din-omelette'],
  ['pdj-porridge', 'col-oeufs', 'dej-riz-poulet', 'smo-choco', 'din-pates-poulet'],
  ['pdj-skyr', 'col-mix', 'dej-pates-thon', 'smo-gainer', 'din-riz-thon'],
  ['pdj-oeufs', 'col-mix', 'dej-riz-lentilles', 'smo-skyr-gouter', 'din-pates-poulet'],
]

export const WEEK_B = [
  ['pdj-skyr', 'col-oeufs', 'dej-pates-thon', 'smo-gainer', 'din-pates-poulet'],
  ['pdj-porridge', 'col-sandwich-thon', 'dej-riz-lentilles', 'smo-choco', 'din-omelette'],
  ['pdj-skyr', 'col-mix', 'dej-riz-poulet', 'smo-gainer', 'din-riz-thon'],
  ['pdj-porridge', 'col-oeufs', 'dej-pates-thon', 'smo-choco', 'din-pates-poulet'],
  ['pdj-skyr', 'col-sandwich-thon', 'dej-riz-poulet', 'smo-gainer', 'din-omelette'],
  ['pdj-porridge', 'col-mix', 'dej-riz-lentilles', 'smo-choco', 'din-riz-thon'],
  ['pdj-oeufs', 'col-mix', 'dej-riz-poulet', 'smo-skyr-gouter', 'din-pates-poulet'],
]

export const WEEK_C = [
  ['pdj-crepes-avoine', 'col-wrap-poulet', 'dej-couscous-poulet', 'smo-fruits-rouges', 'din-patates-oeufs'],
  ['pdj-muesli', 'col-skyr-shake', 'dej-salade-riz', 'smo-cafe', 'din-chili'],
  ['pdj-porridge', 'col-sandwich-thon', 'dej-riz-poulet', 'smo-choco', 'din-riz-saute'],
  ['pdj-crepes-avoine', 'col-oeufs', 'dej-wraps-thon', 'smo-choco', 'din-pates-pesto'],
  ['pdj-muesli', 'col-skyr-shake', 'dej-salade-riz', 'smo-choco', 'din-chili'],
  ['pdj-skyr', 'col-mix', 'dej-wraps-thon', 'smo-gainer', 'din-riz-saute'],
  ['pdj-pain-perdu', 'col-pain-pb', 'dej-riz-lentilles', 'smo-skyr-gouter', 'din-pates-poulet'],
]

export const WEEK_D = [
  ['pdj-muesli', 'col-sandwich-thon', 'dej-salade-riz', 'smo-skyr-gouter', 'din-pates-pesto'],
  ['pdj-porridge', 'col-wrap-poulet', 'dej-pates-thon', 'smo-fruits-rouges', 'din-patates-oeufs'],
  ['pdj-crepes-avoine', 'col-skyr-shake', 'dej-couscous-poulet', 'smo-cafe', 'din-riz-thon'],
  ['pdj-skyr', 'col-pain-pb', 'dej-riz-poulet', 'smo-choco', 'din-chili'],
  ['pdj-pain-perdu', 'col-oeufs', 'dej-wraps-thon', 'smo-gainer', 'din-riz-saute'],
  ['pdj-muesli', 'col-mix', 'dej-salade-riz', 'smo-cafe', 'din-pates-poulet'],
  ['pdj-oeufs', 'col-wrap-poulet', 'dej-riz-lentilles', 'smo-skyr-gouter', 'din-riz-thon'],
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
