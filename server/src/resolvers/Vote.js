exports.link = (parent, args, context) =>
  context.prisma.vote({ id: parent.id }).link();

exports.user = (parent, args, context) =>
  context.prisma.vote({ id: parent.id }).user();
