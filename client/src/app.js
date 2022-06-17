import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Auth from './utils/auth';

import publicRoutes from './views/public';
import playerRoutes from './views/player';
import adminRoutes from './views/admin';

const client = new ApolloClient({
  request: async (operation) => {
    operation.setContext({ headers: { JWT: Auth.jwtToken } });
  },
  cache: new InMemoryCache({
    dataIdFromObject: obj => {
      switch (obj.__typename) {
        case 'ServerConfigFile':
          return obj.name;
        case 'Item':
          return obj.id;
        default:
          return obj._id;
      }
    }
  })
});

client.defaultOptions = {
  watchQuery: {
    errorPolicy: 'all',
  },
  query: {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  },
  mutate: {
    errorPolicy: 'all',
  }
};

class App extends React.Component {
  state = {
    initialSetup: false
  };

  componentDidMount(){
    Auth.restoreAuth();
    this.setState({ initialSetup: true });
  }

  render(){
    if(this.state.initialSetup === false) return null; // dont render app until initial setup is completed
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Switch>
            {publicRoutes}
            {playerRoutes}
            {adminRoutes}
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default App;