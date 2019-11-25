exports.formatDates = list => {
  // take an array
  // of objects
  // return a new array
  // for each item in array
  // timestamp converted into a js date object???
  // everything else is unmodified
  // original array is not mutated? -- maybe forget this one
  return list.map(object => {
    const date = new Date(object.created_at);
    newObj = { ...object };
    newObj.created_at = date
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return newObj;
  });
};

exports.makeRefObj = list => {
  return {};
  // take array
  // return one object
  // key of title
  // val of id
};

exports.formatComments = (comments, articleRef) => {};
