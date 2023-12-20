const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  let sum = 0;
  for (const n of blogs) sum += n.likes;
  return sum;
};
module.exports = {
  dummy,
  totalLikes
};
