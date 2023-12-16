import { useEffect, useState } from "react";
import backend from "./backend";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilter} />
    </div>
  );
};

const PersonForm = ({
  handleSubmit,
  newName,
  handleNewName,
  number,
  handleNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={number} onChange={handleNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filter, handleDelete }) => {
  const peopleToShow = persons.filter((p) =>
    p.name.toUpperCase().includes(filter.toUpperCase())
  );
  return (
    <>
      {peopleToShow.map((p) => (
        <div key={p.id}>
          {p.name} {p.number}{" "}
          <button onClick={() => handleDelete(p)}>delete</button>
        </div>
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    backend.getAll().then((p) => setPersons(persons.concat(p)));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (persons.find((p) => p.name == newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const id = persons.findIndex((p) => p.name == newName);
        const newPerson = {
          name: newName,
          number: number,
          id: id + 1,
        };
        backend
          .update(id + 1, newPerson)
          .then((p) => {
            const people = persons.map((p) => {
              if (p.id == id + 1) {
                p.number = number;
              }
              return p;
            });
            setPersons(people);
            setSuccess(`Updated ${newName}`);
            setNewName("");
            setNumber("");
          })
          .catch((e) => {
            setError(
              `Information of ${newName} has already been removed from server`
            );
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: number,
        id: persons.length + 1,
      };
      setPersons(persons.concat(newPerson));
      backend.create(newPerson);
      setSuccess(`Added ${newName}`);
      setNewName("");
      setNumber("");
    }
    setTimeout(() => {
      setSuccess(null);
    }, 5000);
  };

  const handleDelete = (p) => {
    console.log(p);
    if (window.confirm(`Delete ${p.name} ?`)) {
      backend
        .deleteData(p)
        .then((todelete) => {
          const newPeople = persons.filter((a) => a.id != p.id);
          setPersons(newPeople);
        })
        .catch((e) => console.log(e));
    }
  };

  const handleFilter = (e) => setFilter(e.target.value);
  const handleNewName = (e) => setNewName(e.target.value);
  const handleNumber = (e) => setNumber(e.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        number={number}
        handleNewName={handleNewName}
        handleNumber={handleNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
