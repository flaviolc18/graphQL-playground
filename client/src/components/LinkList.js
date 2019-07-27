import React, { Fragment } from "react";
import { Query } from "react-apollo";

import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION } from "../resolvers";
import { LINKS_PER_PAGE } from "../constants";

import Link from "./Link";

const updateQuery = (prev, { subscriptionData: { data } }) => {
  if (!data) {
    return prev;
  }
  const exists = prev.feed.links.find(({ id }) => id === data.newLink.id);
  if (exists) {
    return prev;
  }

  return Object.assign({}, prev, {
    feed: {
      ...prev.feed,
      links: [...prev.feed.links, data.newLink],
      count: prev.feed.links.length + 1
    }
  });
};

const getQueryVariables = (location, match) => {
  const isNewPage = location.pathname.includes("new");
  const page = parseInt(match.params.page, 10);

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;
  return { first, skip, orderBy };
};

const getLinksToRender = (data, location) => {
  const isNewPage = location.pathname.includes("new");
  if (isNewPage) {
    return data.feed.links;
  }
  const rankedLinks = data.feed.links.slice();
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};

const nextPage = (data, match, history) => {
  const page = parseInt(match.params.page, 10);
  if (page <= data.feed.count / LINKS_PER_PAGE) {
    const nextPage = page + 1;
    history.push(`/new/${nextPage}`);
  }
};

const previousPage = (match, history) => {
  const page = parseInt(match.params.page, 10);
  if (page > 1) {
    const previousPage = page - 1;
    history.push(`/new/${previousPage}`);
  }
};

const updateCacheAfterVote = (link, location, match) => (
  store,
  { data: { vote } }
) => {
  const isNewPage = location.pathname.includes("new");
  const page = parseInt(match.params.page, 10);

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;
  const data = store.readQuery({
    query: FEED_QUERY,
    variables: { first, skip, orderBy }
  });

  const votedLink = data.feed.links.find(({ id }) => id === link.id);
  votedLink.votes = vote.link.votes;

  store.writeQuery({ query: FEED_QUERY, data });
};

function LinkList({ location, match, history }) {
  return (
    <Query query={FEED_QUERY} variables={getQueryVariables(location, match)}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;

        subscribeToMore({
          document: NEW_LINKS_SUBSCRIPTION,
          updateQuery
        });

        const linksToRender = getLinksToRender(data, location);
        const isNewPage = location.pathname.includes("new");
        const pageIndex = match.params.page
          ? (match.params.page - 1) * LINKS_PER_PAGE
          : 0;

        return (
          <Fragment>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={updateCacheAfterVote(
                  link,
                  loading,
                  match
                )}
              />
            ))}
            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div
                  className="pointer mr2"
                  onClick={() => previousPage(match, history)}
                >
                  Previous
                </div>
                <div
                  className="pointer"
                  onClick={() => nextPage(data, match, history)}
                >
                  Next
                </div>
              </div>
            )}
          </Fragment>
        );
      }}
    </Query>
  );
}

export default LinkList;
