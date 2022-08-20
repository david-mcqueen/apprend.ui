import {
    ApolloClient,
    InMemoryCache,
    gql,
    createHttpLink
  } from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
import GetAuthedUser from "../auth/auth";

const httpLink = createHttpLink({
    uri: 'https://ysvkktn5mzentc4qb2w75u25am.appsync-api.eu-west-2.amazonaws.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const authedUser = await GetAuthedUser();
  
  // return the headers to the context so httpLink can read them
  return {
      headers: {
      ...headers,
      authorization: authedUser!.AccessToken,
      }
  }
});

export type Element = {
    group: string;
    element: string;
    translation: string;
  }

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });


export const getDeck = (deck: string) : Promise<Element[]> => {
      return client
        .query({
            query: gql`
            query Query {
              getDeck(deck: "${deck}") {
                element
                translation
                group
                }
              }              
            `
        })
        .then(result => {
          
          const returnedVerbs = result?.data.getDeck;

          return returnedVerbs.filter((element: Element) => {
            return element.element !== "deck#details"
          }) ;
        });
  }


  export type Deck = {
    deck: string,
    description: string
  }

  export const getDecks = () : Promise<Deck[]> => {
    return client
        .query({
            query: gql`
            query Query {
                getDetails(element: "deck#details") {
                deck
                description
                }
              }              
            `
        })
        .then(result => {
          
          const returnedVerbs = result?.data.getDetails;
          return returnedVerbs;
        });
  }