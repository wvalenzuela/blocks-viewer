import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';

import apollo_client from './apollo_client';

class ApolloClientProvider extends Component {
  render() {
    const { children } = this.props;
    return <ApolloProvider client={apollo_client}>{children}</ApolloProvider>;
  }
}

ApolloClientProvider.propTypes = {
  classes: PropTypes.object,
};

export default ApolloClientProvider;
