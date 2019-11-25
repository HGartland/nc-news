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
  return list.reduce(function(refObj, commentObj) {
    refObj[commentObj.title] = commentObj.article_id;
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  // takes array of objects
  // takes reference object
  // returns new array of objects
  // created_by key changed to author
  // belongs_to key changed to article_id
  // belongs_to value changed to article_id value
  // created_at converted to JS date object
};
