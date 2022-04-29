import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    createHttpLink
  } from "@apollo/client";

  import { setContext } from '@apollo/client/link/context';

const Query = () => {

    const httpLink = createHttpLink({
        uri: 'https://opdezv66u5gb3aqmtpvqcfhvuy.appsync-api.eu-west-2.amazonaws.com/graphql',
      });
      
      const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        // const token = localStorage.getItem('token');
        const token = ""
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
            query MyQuery {
                getVerbs
              }              
            `
        })
        .then(result => console.log(result));

        return (<></>)
} 

export default Query;

