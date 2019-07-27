import React from "react";

import { Mutation } from "react-apollo";

import { timeDifferenceForDate } from "../utils";
import { AUTH_TOKEN } from "../constants";

import { VOTE_MUTATION, FEED_QUERY } from "../resolvers";

function Link({ link, index }) {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(store, { data: { vote } }) => {
              const data = store.readQuery({ query: FEED_QUERY });

              const votedLink = data.feed.links.find(
                ({ id }) => id === link.id
              );
              votedLink.votes = vote.link.votes;

              store.writeQuery({ query: FEED_QUERY, data });
            }}
          >
            {voteMutation => (
              <div
                style={{ cursor: "pointer" }}
                className="ml1 gray f11"
                onClick={voteMutation}
              >
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default Link;
