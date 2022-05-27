import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    createHttpLink
  } from "@apollo/client";

  import { setContext } from '@apollo/client/link/context';
import { useEffect, useState } from "react";

const Query = () => {

    const [verbs, setVerbs] = useState<string>();

    useEffect(() => {
        const httpLink = createHttpLink({
            uri: 'https://25sro6ugqjhslkekpc4ozezqx4.appsync-api.eu-west-2.amazonaws.com/graphql',
        });

        const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('access_token');
        
        
        // return the headers to the context so httpLink can read them
        return {
            headers: {
            ...headers,
            authorization: token ? token : "",
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
            .then(result => setVerbs(JSON.stringify(result)));
    }, []);

    return (<>{verbs}</>)
} 

export default Query;

