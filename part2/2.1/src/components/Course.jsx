const Header = ({ name }) => <h1>{name}</h1>;
const Content = ({ parts }) => {
  return (
    <>
      {parts.map((p) => (
        <p key={p.id}>
          {p.name} {p.exercises}
        </p>
      ))}
    </>
  );
};
const Total = ({ parts }) => {
  const total = parts.reduce((a, c) => a + c.exercises, 0);
  return <h3>total of {total} exercises</h3>;
};

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;