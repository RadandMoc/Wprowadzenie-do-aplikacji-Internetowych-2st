import React from "react";

interface Student {
  imie: string;
  nazwisko: string;
  rocznik: number;
}

const Studenci: React.FC = () => {
  const students: Student[] = [
    { imie: "Anna", nazwisko: "Kowalska", rocznik: 2001 },
    { imie: "Jan", nazwisko: "Nowak", rocznik: 1999 },
    { imie: "Ewa", nazwisko: "Wiśniewska", rocznik: 2000 },
  ];

  return (
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
  );
};

export default Studenci;
