import {
    ApolloClient,
    InMemoryCache,
    gql,
    createHttpLink
  } from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import { useEffect, useState } from "react";
import Auth from "../auth/auth";
import { withAuth } from "../auth/withAuth";

const Deck = () => {

    const [verbs, setVerbs] = useState<string>();

    useEffect(() => {
        const httpLink = createHttpLink({
            uri: 'https://25sro6ugqjhslkekpc4ozezqx4.appsync-api.eu-west-2.amazonaws.com/graphql',
        });

        const authLink = setContext(async (_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('access_token');
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
                    getCategory(category: "en#fr#communication") {
                      verbs {
                        group
                        name
                        translation
                      }
                    }
                  }              
                `
            })
            .then(result => setVerbs(JSON.stringify(result.data)));
    }, []);

    return (
      <>
      <div>
        <ul>
          <li>
            Communication
          </li>
          <li>
            
          </li>
        </ul>
      </div>
        {verbs}
      </>
    )
} 

export default withAuth(Deck);

