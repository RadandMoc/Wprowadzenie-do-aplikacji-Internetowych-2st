function toggleFlip(card) {
    const isFlipped = card.getAttribute('data-flipped') === 'true';
    card.classList.toggle('flipped');
    card.setAttribute('data-flipped', !isFlipped);
}

function toggleAll() {
    const cards = document.querySelectorAll('.flip-card');
    const anyFlipped = Array.from(cards).some(card => card.getAttribute('data-flipped') === 'true');
    cards.forEach(card => {
        if (anyFlipped) {
            card.classList.remove('flipped');
            card.setAttribute('data-flipped', 'false');
        } else {
            card.classList.add('flipped');
            card.setAttribute('data-flipped', 'true');
        }
    });
}