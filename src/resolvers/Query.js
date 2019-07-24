exports.feed = (parent, { filter, skip, first }, context, info) => {
  const where = filter
    ? {
        OR: [{ description_contains: filter }, { url_contains: filter }]
      }
    : {};

  return context.prisma.links({ where, skip, first });
};
