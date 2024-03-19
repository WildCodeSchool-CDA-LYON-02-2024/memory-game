const cards = document.querySelectorAll('.memory-card'); 
let cardsPicked = []; 
let lockedCards = false; 
let lockedShuffle = false;
const innerCards = [...document.querySelectorAll('.double-face')]; // on récupète toutes les cartes double-face
let numberOfTrials = 0;
const advice = document.querySelector('.advice');
const score = document.querySelector('.score-value');

/**
 * permet de placer les cartes aléatoirement dans la grille
 */
function shuffleCards() {
    cards.forEach(card => {
        const randomPos = Math.trunc(Math.random() * 12);
        // order pour pouvoir mélanger les cartes et leur donner un ordre différent dans le dom, mais sans changer la structure. Etant donné que randomPos est calculé aléatoirement, il est possible de plusieurs cartes tombent sur la même valeur -> pas grave car dans ce cas, se mettront juste l'une après l'autre
        card.style.order = randomPos;
    })
}

shuffleCards();

/**
 * flipCard : fonction appelée au clic sur une carte (pour rappel, on a un eventListener qui nous permet de détecter le clic sur une carte) -> but de cette fonction : récupérer l'élélement double-face (event.target.children[0]) -> donc carte avec ses deux faces + récupération de la valeur de l'attribut data-card
 * Si lockedCards est à true, alors on sort de la fonction sans rien faire :  on ne voudra pas retourner plus de cartes
 * sinon, on appelle saveCards
 * 
 * condition cardsPicked.length === 2 : on n'appelle la fonction qui calcule le résultat si et seulement si on a deux cartes dans notre tableau
 * @param {*} event 
 * @returns 
 */
const flipCard = (event) => {
    if (lockedCards) return;
    saveCards(event.target.children[0], event.target.getAttribute('data-card'));

    if (cardsPicked.length === 2) {
        result();
    }
}

cards.forEach(card => {
    card.addEventListener(('click'), flipCard);
});

/**
 * fonction saveCards prend deux paramètres en entrée
 * @param {*} element : représente la carte (on lui passe l'élément double-face)
 * @param {*} value : valeur de data-attribute
 * 
 * on va passer la classe active aux cartes sélectionnées (on a cliqué dessus, donc on veut les retourner)
 * puis on sauvegarde ces cartes sélectionnées dans le tableau cardsPicked
 */
const saveCards = (element, value) => {
    // premiere ligne pour voir si on a déjà cliqué sur la carte qu'on sélectionne. Et dans ce cas, on ne push pas dans le tableau et on sort de la fonction
    if (element === cardsPicked[0]?.element) return;

    element.classList.add('active');
    cardsPicked.push({element, value});
}

/**
 * Fonction result est appelée lorsque notre tableau cardsPicked contient deux cartes
 * @returns 
 */
const result = () => {
    saveNumberOfTrails(); // appel de fonction de calcul de coups 

    // cas où les valeurs des deux data-attributes des cartes retournées sont les mêmes : on empêche le fait de pouvoir à nouveau cliquer dessus, car sinon vont à nous être ajoutées au tableau cardsPicked, ce qu'on ne veut pas !
    if (cardsPicked[0].value === cardsPicked[1].value) {
        cardsPicked[0].element.parentElement.removeEventListener(('click'), flipCard);
        cardsPicked[1].element.parentElement.removeEventListener(('click'), flipCard);

        // on réinitialise le tableau de cartes pour pouvoir sélectionner une nouvelle paire
        cardsPicked = [];
        return;
    }

    // on bloque le fait de pouvoir retourner de nouvelles cartes :  on ne pourra en retourner que deux à la fois (vu que result est appelée dès que cardsPicked est à 2)
    lockedCards = true;

    setTimeout(() => {
        // si on n'est pas dans le cas de valeurs identiques, alors on retire la classe active afin que les cartes cachent à nouveau leur face
        cardsPicked[0].element.classList.remove('active');
        cardsPicked[1].element.classList.remove('active');
        cardsPicked = [];
        lockedCards = false;
    }, 1000)
}

/**
 * 
 */
const saveNumberOfTrails = () => {
    numberOfTrials++;

    // on va récupérer que les cartes qu'il nous reste à découvrir car pas encore la classe active : on obtient un tableau de cartes qui n'ont pas la classe active = sont face cachée -> s'il nous reste des cartes sans la classe active, le jeu continue, sinon le jeu est terminé (donc victoire)
    const checkForEnd = innerCards.filter(card => !card.classList.contains('active'));

    if(!checkForEnd.length) {
        advice.textContent = "Bravo ! Appuyez sur la touche Espace pour relancer une partie";
        score.textContent = `${numberOfTrials}`;
    }
    score.textContent = `${numberOfTrials}`;
}

/**
 * 
 * @param {*} event : event de clic sur une touche du keyboard
 * @returns 
 * fonction qui va tout réinitialiser afin de commencer une nouvelle partie
 */
const handleRestart = (event) => {
    // quand on clique sur la touche espace, on a un comportement par défaut qui est de faire descendre la vue du navigateur : preventDefault pour supprimer ce comportement
    event.preventDefault();

    if (event.keyCode === 32) { // 32 : barre d'espace
        innerCards.forEach(card => card.classList.remove('active'));
        advice.innerHTML = `<h2>Tentez de gagner avec le moins d'essais possibles</h2>`;
        score.textContent = `0`;
        numberOfTrials = 0;
        cards.forEach(card => card.addEventListener('click', flipCard));
    }

    if (lockedShuffle) return; // lockedShuffle pour ne pas spammer la touche espace
    lockedShuffle = true;

    setTimeout(() => {
        shuffleCards();
        lockedShuffle = false;
    }, 1000);
}

// on se met en écoute sur l'appui des touches du clavier
window.addEventListener('keydown', handleRestart);


