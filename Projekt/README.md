1. Setup projektu:

należy wejść terminalem do folderu Projekt/backend po czym wpisać w terminalu:
python -m venv venv
source venv/bin/activate # Na Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

Drugim terminalem należy wejść do folderu Projekt/shop-project
npm install
npm run dev

należy wejść na link z terminalu frontendu i cieszyć się aplikacją.

2. Użyta technologia i biblioteki

Backend:
Django: Framework webowy dla Pythona.
Django REST Framework: Rozszerzenie Django do budowania API RESTful.
SimpleJWT: Biblioteka do obsługi JWT (JSON Web Tokens) w Django.

Frontend:
React: Biblioteka do budowania interfejsów użytkownika.
TypeScript: Język programowania będący nadzbiorem JavaScript, dodający statyczne typowanie.
Vite: Narzędzie do budowania aplikacji frontendowych.
Material-UI: Biblioteka komponentów UI dla React.
Axios: Biblioteka do wykonywania zapytań HTTP.

3. Opis funkcjonalności:

Użytkownik:
Rejestracja i logowanie: Użytkownicy mogą się rejestrować i logować do aplikacji. RM
Przeglądanie produktów: Użytkownicy mogą przeglądać listę produktów oraz szczegóły poszczególnych produktów. TZ
Dodawanie do koszyka: Użytkownicy mogą dodawać produkty do koszyka, zmieniać ich ilość oraz usuwać je z koszyka. TZ
Składanie zamówień: Użytkownicy mogą składać zamówienia na produkty znajdujące się w koszyku. TZ
Dodawanie recenzji: Użytkownicy mogą dodawać recenzje do produktów, które zakupili. RM
Edytowanie recenzji: Użytkownicy mogą edytować swoje recenzje produktów. RM
Historia zamówień: Użytkownicy mogą przeglądać historię swoich zamówień wraz z ich szczegółami. TZ

Administrator (to samo co użytkownik plus):
Dodawanie produktów: Administratorzy mogą dodawać nowe produkty do sklepu. RM
Zarządzanie recenzjami: Administratorzy mogą usuwać recenzje produktów. TZ

Autorzy:
RM - Radosław Mocarski
TZ - Tomasz Zapart

4. Użytkownicy z bazy danych:

Dodano przykładowych użytkowników do bazy danych. Podane zostaną w formie Login/Hasło/Rola:

superadmin/123/admin
Tomek/tz/user
Radek/rm/user

!!! WAŻNE !!!
Login uwzględnia wielkość liter. Jeśli jakiś login zaczyna się z wielkiej, to logowanie wymaga również wielkiej litery na początku. Tak samo w przypadku dalszych znaków.

Żeby dodać admina, należy w terminalu backendu (podczas nie dzialania servera) wpisać:
python manage.py createsuperuser
i podążać za instrukcjami

POSTMAN:
https://restless-station-985514.postman.co/workspace/New-Team-Workspace~1e63cc91-1ede-4e38-afb4-9c69aabd420e/collection/40115069-bc83342a-1053-4478-85f2-414b7600d170?action=share&creator=40115069
