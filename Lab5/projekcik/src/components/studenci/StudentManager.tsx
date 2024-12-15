import React, { useState } from "react";

interface Student {
  imie: string;
  nazwisko: string;
  rocznik: number;
}

const StudentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    { imie: "Anna", nazwisko: "Kowalska", rocznik: 2001 },
    { imie: "Jan", nazwisko: "Nowak", rocznik: 1999 },
    { imie: "Ewa", nazwisko: "Wiśniewska", rocznik: 2000 },
  ]);

  const [newStudent, setNewStudent] = useState<Student>({
    imie: "",
    nazwisko: "",
    rocznik: 0,
  });

  const addStudent = () => {
    if (newStudent.imie && newStudent.nazwisko && newStudent.rocznik > 0) {
      setStudents((prev) => [...prev, newStudent]);
      setNewStudent({ imie: "", nazwisko: "", rocznik: 0 });
    } else {
      alert("Wprowadź poprawne dane!");
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Rocznik</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.imie}</td>
              <td>{student.nazwisko}</td>
              <td>{student.rocznik}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input
          type="text"
          value={newStudent.imie}
          onChange={(e) => setNewStudent({ ...newStudent, imie: e.target.value })}
          placeholder="Imię"
        />
        <input
          type="text"
          value={newStudent.nazwisko}
          onChange={(e) => setNewStudent({ ...newStudent, nazwisko: e.target.value })}
          placeholder="Nazwisko"
        />
        <input
          type="number"
          value={newStudent.rocznik || ""}
          onChange={(e) => setNewStudent({ ...newStudent, rocznik: parseInt(e.target.value) || 0 })}
          placeholder="Rocznik"
        />
        <button onClick={addStudent}>Dodaj</button>
      </div>
    </div>
  );
};

export default StudentManager;
