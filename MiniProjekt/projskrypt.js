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

function updateFlipCardHeight() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        const front = card.querySelector('.flip-card-front');
        const back = card.querySelector('.flip-card-back');
        
        // Reset heights to auto to get true content height
        front.style.height = 'auto';
        back.style.height = 'auto';
        
        // Get the maximum height
        const frontHeight = front.offsetHeight;
        const backHeight = back.offsetHeight;
        const maxHeight = Math.max(frontHeight, backHeight);
        
        // Set the container height
        card.style.height = `${maxHeight}px`;
        card.querySelector('.flip-card-inner').style.height = `${maxHeight}px`;
        front.style.height = `${maxHeight}px`;
        back.style.height = `${maxHeight}px`;
    });
}

// Wywołaj funkcję po załadowaniu strony i po każdej zmianie rozmiaru okna
window.addEventListener('load', updateFlipCardHeight);
window.addEventListener('resize', updateFlipCardHeight);