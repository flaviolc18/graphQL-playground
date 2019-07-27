import React from "react";
import { Query } from "react-apollo";

import { FEED_QUERY } from "../resolvers";

import Link from "./Link";

function LinkList() {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;

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
