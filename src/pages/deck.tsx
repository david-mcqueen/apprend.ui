import {
    ApolloClient,
    InMemoryCache,
    gql,
    createHttpLink
  } from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Auth from "../auth/auth";
import { withAuth } from "../auth/withAuth";

import './deck.scss';

type Verb = {
  group: string;
  name: string;
  translation: string;
}

const Deck = () => {

    const [verbs, setVerbs] = useState<Verb[]>();
    const {deck} = useParams();

    useEffect(() => {
        const httpLink = createHttpLink({
            uri: 'https://25sro6ugqjhslkekpc4ozezqx4.appsync-api.eu-west-2.amazonaws.com/graphql',
        });

        const authLink = setContext(async (_, { headers }) => {
          const authedUser = await Auth.GetAuthedUser();
          
          // return the headers to the context so httpLink can read them
          return {
              headers: {
              ...headers,
              authorization: authedUser.AccessToken,
              }
          }
        });

        const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
          });
    
          client
            .query({
                query: gql`
                query Query {
                    getCategory(category: "en#fr#${deck}") {
                      verbs {
                        group
                        name
                        translation
                      }
                    }
                  }              
                `
            })
            .then(result => {
              console.log(result);

              const returnedVerbs = result?.data.getCategory.verbs;
              setVerbs(returnedVerbs);
            });
    }, [deck]);

    return (
      <div className="deck">
        {verbs?.map((verb: Verb) => (
          <div>
            <h1>{verb.name}</h1>
            <h2>{verb.translation}</h2>
            <h2>{verb.group}</h2>
          </div>
        ))}
      </div>
    )
}

export default withAuth(Deck);