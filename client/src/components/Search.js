import React, { useState } from "react";
import { withApollo } from "react-apollo";

import { FEED_SEARCH_QUERY } from "../resolvers";
import Link from "./Link";

function Search({ client }) {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");

  const executeSearch = async () => {
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });
    setLinks(result.data.feed.links);
  };

  return (
    <div>
      <div>
        Search <input type="text" onChange={e => setFilter(e.target.value)} />
        <button onClick={() => executeSearch()}>OK</button>
      </div>
      {links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
}

export default withApollo(Search);
