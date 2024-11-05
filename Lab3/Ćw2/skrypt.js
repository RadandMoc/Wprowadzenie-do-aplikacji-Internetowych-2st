// Elementy HTML
const minLengthInput = document.getElementById('minLength');
const maxLengthInput = document.getElementById('maxLength');
const uppercaseCheckbox = document.getElementById('uppercase');
const specialCharsCheckbox = document.getElementById('specialChars');
const generateButton = document.getElementById('generatePassword');

// Znaki do generowania haseł
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const specialChars = '!@#$%^&*()_+-=[]{}|;:",.<>?';

// Funkcja generująca losowe hasło
function generatePassword() {
    const minLength = parseInt(minLengthInput.value);
    const maxLength = parseInt(maxLengthInput.value);
    const useUppercase = uppercaseCheckbox.checked;
    const useSpecialChars = specialCharsCheckbox.checked;

    // Sprawdzenie poprawności długości hasła
    if (isNaN(minLength) || isNaN(maxLength) || minLength < 1 || maxLength < minLength) {
        alert("Podaj prawidłowe wartości długości hasła.");
        return;
    }

    const passwordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let availableChars = lowercaseChars;
    if (useUppercase) {
        availableChars += uppercaseChars;
    }
    if (useSpecialChars) {
        availableChars += specialChars;
    }

    // Generowanie hasła
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }

    // Wyświetlenie hasła w alert
    alert(`Wygenerowane hasło: ${password}`);
}

// Dodanie event listenera do przycisku generowania hasła
generateButton.addEventListener('click', generatePassword);
