function toggleDetails(id) {
    const details = document.getElementById(id);
    if (details.style.display === "none") {
        details.style.display = "block";
    } else {
        details.style.display = "none";
    }
}

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
