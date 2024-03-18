const cards = document.querySelectorAll('.memory-card');
let cardsPicked = [];
let lockedCards = false;
let lockedShuffle = false;
const innerCards = [...document.querySelectorAll('.double-face')];
let numberOfTrials = 0;
const advice = document.querySelector('.advice');
const score = document.querySelector('.score-value');

/**
 * permet de placer les cartes aléatoirement dans la grille
 */
function shuffleCards() {
    cards.forEach(card => {
        const randomPos = Math.trunc(Math.random() * 12);
        card.style.order = randomPos;
    })
}

shuffleCards();

const flipCard = (event) => {
    if (lockedCards) return;
    saveCards(event.target.children[0], event.target.getAttribute('data-card'));

    if (cardsPicked.length === 2) {
        result();
    }
}

const saveCards = (element, value) => {
    element.classList.add('active');
    cardsPicked.push({element, value});
    console.log('cardsPicked', cardsPicked)
}

const result = () => {
    saveNumberOfTrails();

    if (cardsPicked[0].value === cardsPicked[1].value) {
        cardsPicked[0].element.parentElement.removeEventListener(('click'), flipCard);
        cardsPicked[1].element.parentElement.removeEventListener(('click'), flipCard);
        cardsPicked = [];
        return;
    }

    lockedCards = true;

    setTimeout(() => {
        cardsPicked[0].element.classList.remove('active');
        cardsPicked[1].element.classList.remove('active');
        cardsPicked = [];
        lockedCards = false;
    }, 1000)
}


cards.forEach(card => {
    card.addEventListener(('click'), flipCard);
});

const saveNumberOfTrails = () => {
    numberOfTrials++;
    const checkForEnd = innerCards.filter(card => !card.classList.contains('active'))
    // console.log('checkForEnd', checkForEnd)

    if(!checkForEnd.length) {
        // todo c'est fini donc il faudra changer le texte
        //advice : changer le texte
        score.textContent = `${numberOfTrials}`;
    }
    score.textContent = `${numberOfTrials}`;
}

const handleRestart = (event) => {
    event.preventDefault();

    if (event.keyCode === 32) {
        innerCards.forEach(card => card.classList.remove('active'));
        // todo : changer les textes
        numberOfTrials = 0;
        cards.forEach(card => card.addEventListener('click', flipCard));
    }

    if (lockedShuffle) return;
    lockedShuffle = true;

    setTimeout(() => {
        shuffleCards();
        lockedShuffle = false;
    }, 1000);
}

window.addEventListener('keydown', handleRestart);


