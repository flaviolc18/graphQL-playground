exports.postedBy = (parent, args, context) =>
  context.prisma.link({ id: parent.id }).postedBy();

exports.votes = (parent, args, context) =>
  context.prisma.link({ id: parent.id }).votes();
