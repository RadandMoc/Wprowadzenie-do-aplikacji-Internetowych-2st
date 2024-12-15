import './App.css';
import Formularz from './components/formularze/Formularz';
import Haslo from './components/formularze/Haslo';
import Logowanie from './components/formularze/Logowanie';
import Aktualizacja from './components/inne/Aktualizacja';
import Ternary from './components/inne/Ternary';
import Koszyk from './components/koszyk/Koszyk';
import NowyKoszyk from './components/koszyk/NowyKoszyk';
import Licznik from './components/liczniki/Licznik';
import NowyLicznik from './components/liczniki/NowyLicznik';
import Studenci from './components/studenci/Studenci';
import StudentManager from './components/studenci/StudentManager';
import Licznik2 from './components/efekty/Licznik';
import Tytul from './components/efekty/Tytul';
import Odliczanie from './components/efekty/Odliczanie';
import Komentarz from './components/produkty/Komentarz';

const user = { id: 1, username: "johndoe", fullName: "John Doe" };

function App() {
  return (
    <div className="App">
      <h1>Moja Aplikacja</h1>
      <Koszyk />
      <NowyKoszyk />
      <Licznik />
      <NowyLicznik />
      <Formularz />
      <Haslo />
      <Logowanie />
      <Ternary />
      <Aktualizacja />
      <Studenci />
      <StudentManager />
      <Licznik2 />
      <Tytul />
      <Odliczanie />
      <Komentarz id={1} body="To jest komentarz!" postId={101} likes={3} user={user} />
    </div>
  );
}

export default App;
