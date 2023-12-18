const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));
require("dotenv").config();
const Person = require("./models/person");

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.json(result);
    })
    .catch((e) => next(e));
});

app.get("/info", (request, response) => {
  Person.find({}).then((result) => {
    response.send(
      `<p>Phonebook has info for ${
        result.length
      } people</p><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) response.json(result);
      response.status(404).end();
    })
    .catch((e) => next(e));
});

app.delete("/api/persons/:id", (request, response, next) => {
  persons = persons.filter((p) => p.id !== request.params.id);
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((e) => next(e));
});

app.post("/api/persons", (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (persons.find((p) => p.name === request.body.name)) {
    return response.status(400).json({
      error: "name is already in the phonebook",
    });
  }
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  persons.concat(person);
  person
    .save()
    .then((person) => {
      response.json(person);
    })
    .catch((e) => next(e));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
