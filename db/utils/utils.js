exports.formatDates = list => {
  return list.map(object => {
    const date = new Date(object.created_at);
    newObj = { ...object };
    newObj.created_at = date;
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
  return comments.map(comment => {
    const newComment = { ...comment };
    newComment.author = newComment.created_by;
    delete newComment.created_by;
    newComment.article_id = articleRef[comment.belongs_to];
    delete newComment.belongs_to;
    newComment.created_at = new Date(newComment.created_at);
    return newComment;
  });
};
