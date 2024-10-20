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

    if (!email || !message) {
        alert('Proszę uzupełnić wszystkie pola!');
        event.preventDefault();
    }
});


// Pokazywanie i ukrywanie chmurki
function showSummary(id) {
    const summary = document.getElementById(id);
    const parent = summary.closest('.job-icon');
    if (!parent.classList.contains('clicked')) {
        summary.style.display = 'block';
    }
}

function hideSummary(id) {
    const summary = document.getElementById(id);
    summary.style.display = 'none';
}

// Przełączanie pełnego opisu po kliknięciu — blokuje chmurkę
function toggleFullDescription(detailsId, summaryId) {
    const details = document.getElementById(detailsId);
    const summary = document.getElementById(summaryId);
    const parent = summary.closest('.job-icon');
    if (!parent.classList.contains('clicked')) {
        parent.classList.add('clicked'); // Blokujemy chmurkę
        window.location.href = "firma1.html"; // Przekierowanie na nową stronę
    }
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
