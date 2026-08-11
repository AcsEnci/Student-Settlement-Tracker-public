import { useEffect, useState } from "react";
import Loading from "../Loading";

const fetchDays = () => {
  return fetch("/api/days/").then((res) => res.json());
};


const StudentForm = ({ onSave, disabled, student, onCancel }) => {
  const [name, setName] = useState(student?.name ?? "");
  const [budget, setBudget] = useState(student?.budget ?? 0);
  const [studyDay, setStudyDay] = useState(student?.studyDay ?? []);
  const [selectedDays, setSelectedDays] = useState(student?.studyDay ?? []);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState([]);

  useEffect(() => {
    fetchDays()
      .then((days) => {
        setDays(days);
        setIsLoading(false);
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const numericBudget = Number(budget);

    if (student) {
      return onSave({
        ...student,
        name,
        budget: numericBudget,
        studyDay: selectedDays,
      });
    }

    return onSave({
      name,
      budget: numericBudget,
      studyDay: selectedDays,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  const dayChanger = (day) => {
    return !day;
  }

  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="name">Név:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="budget">Óradíj:</label>
        <input
        type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          name="budget"
          id="budget"
        />
      </div>

      <div className="control">
        <label htmlFor="studyDay">Nap(ok):</label>
        <div id="studyDay" className="studyDay">
        {days.map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={() => {
                if (selectedDays.includes(day)) {
                  setSelectedDays(selectedDays.filter((d) => d !== day));
                } else {
                  setSelectedDays([...selectedDays, day]);
                }
              }}
              name={day}
              id={day}
            />
            {day}
          </label>
        ))}
        </div>
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          Tanuló Mentése
        </button>

        <button type="button" onClick={onCancel}>
          Vissza
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
