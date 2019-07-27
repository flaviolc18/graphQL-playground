import React from "react";
import { Query } from "react-apollo";

import { FEED_QUERY } from "../resolvers";

import Link from "./Link";

import { NEW_LINKS_SUBSCRIPTION } from "../resolvers";

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

function LinkList() {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;

        subscribeToMore({
          document: NEW_LINKS_SUBSCRIPTION,
          updateQuery
        });

        return (
          <div>
            {data.feed.links.map((link, index) => (
              <Link key={link.id} link={link} index={index} />
            ))}
          </div>
        );
      }}
    </Query>
  );
}

export default LinkList;
