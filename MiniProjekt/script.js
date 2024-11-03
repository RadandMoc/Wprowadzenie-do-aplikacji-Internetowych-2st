function toggleDetails(id) {
    const details = document.getElementById(id);
    if (details.style.display === "none") {
        details.style.display = "block";
    } else {
        details.style.display = "none";
    }
}

// Walidacja formularza kontaktowego
document.getElementById('contactForm').addEventListener('submit', function(event) {
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !message) {
        alert('Proszę uzupełnić wszystkie pola!');
        event.preventDefault();
    }

    if (!emailRegex.test(email)) {
        alert('Proszę podać poprawny adres e-mail!');
        event.preventDefault();
    }
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
