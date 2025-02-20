let lastFlipState = false;

function toggleFlip(card) {
    const isFlipped = card.getAttribute('data-flipped') === 'true';
    card.classList.toggle('flipped');
    card.setAttribute('data-flipped', !isFlipped);
}

function toggleAll() {
    const cards = document.querySelectorAll('.flip-card');
    lastFlipState = !lastFlipState;
    cards.forEach(card => {
        card.classList.toggle('flipped', lastFlipState);
        card.setAttribute('data-flipped', lastFlipState);
    });
}