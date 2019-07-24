exports.newLink = {
  subscribe: (parent, args, context, info) =>
    context.prisma.$subscribe.link({ mutation_in: ["CREATED"] }).node(),
  resolve: payload => payload
};

exports.newVote = {
  subscribe: (parent, args, context, info) =>
    context.prisma.$subscribe.vote({ mutation_in: ["CREATED"] }).node(),
  resolve: payload => payload
};
