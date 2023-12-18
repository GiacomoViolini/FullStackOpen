const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (!process.argv[3]) {
  Person.find({}).then((result) => {
    console.log("phonebook:")
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
  return;
}

const password = process.argv[2];

const url = `mongodb+srv://giac18:${password}@firsttest.3fxfyab.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

person.save().then((result) => {
  console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`);
  mongoose.connection.close();
});
