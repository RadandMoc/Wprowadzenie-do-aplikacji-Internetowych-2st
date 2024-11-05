function toggleDetails(id) {
    const details = document.getElementById(id);
    if (details.style.display === "none") {
        details.style.display = "block";
    } else {
        details.style.display = "none";
    }
}

// Walidacja formularza kontaktowego
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function (event) {
        // Pobranie wartości pól formularza
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Sprawdzenie, czy pola są wypełnione
        if (!email || !message) {
            alert('Proszę wypełnić wszystkie wymagane pola.');
            event.preventDefault(); // Zatrzymanie wysyłania formularza
            return;
        }

        // Proste sprawdzenie poprawności adresu e-mail
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Proszę podać poprawny adres e-mail.');
            event.preventDefault(); // Zatrzymanie wysyłania formularza
            return;
        }

    });
});


// Pokazywanie i ukrywanie chmurki
function showSummary(id) {
    const summary = document.getElementById(id);
    summary.style.display = 'block';
}

function hideSummary(id) {
    const summary = document.getElementById(id);
    summary.style.display = 'none';
}

function loadNextPage(pageName){
    window.location.href = pageName;
}

function toggleSection(id) {
    const section = document.getElementById(id);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

document.querySelectorAll('.circle-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
