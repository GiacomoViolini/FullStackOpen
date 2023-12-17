const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((p) => p.id == request.params.id);
  if (person) response.json(person);
  response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((p) => p.id != request.params.id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (persons.find((p) => p.name == request.body.name)) {
    return response.status(400).json({
      error: "name is already in the phonebook",
    });
  }
  const person = {
    id: generateId(),
    name: request.body.name,
    number: request.body.number,
  };
  persons.concat(person);
  response.json(person);
});