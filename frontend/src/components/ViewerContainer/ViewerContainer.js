import React from 'react';
import PropTypes from 'prop-types';
import { GetData, QueryUsers, ServerErrorsString } from '../../common';
import SnackMessage from '../SnackMessage';
import { Box, CircularProgress, Grid } from '@mui/material';
import { TableUsers, ViewerUsers } from './components';
import VtkComponent from './components/VtkComponent/vtkComponent';

class ViewerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      users: [],
    };
    this.holder = { getInputs: null };
  }
  componentDidMount() {
    this.handleUsers();
  }
  handleUsers = () => {
    const { loading } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    (async () => {
      QueryUsers()
        .then((res) => {
          const data = GetData(res);
          const { ok, users, errors } = data.allUsers;
          if (ok) this.setState({ loading: false, users });
          else throw errors;
        })
        .catch((error) => {
          this.setState({ loading: false, error: ServerErrorsString(error) });
        });
    })();
  };
  handleCloseSnak = () => {
    this.setState({ error: '' });
  };
  render() {
    const { error, loading, users } = this.state;
    let Component = (
      <Grid item>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </Grid>
    );
    if (!loading) {
      Component = <Grid item xs={12}>{`Total users: ${users.length}`}</Grid>;
    }
    return (
      <React.Fragment>
        <Box sx={{ display: 'flex', width: 800, height: 400 }}>
          <VtkComponent />
        </Box>
        {/*<Grid container spacing={1}>
          <Grid item>
            <ViewerUsers
              holder={this.holder}
              setState={(state) => this.setState(state)}
            />
          </Grid>
          {Component}
          <Grid item>
            <TableUsers
              rows={loading ? [] : users}
              handleReload={this.handleUsers}
            />
          </Grid>
        </Grid> */}
        <SnackMessage
          handleClose={this.handleCloseSnak}
          message_text={error !== '' ? error : 'Unknown warning'}
          open={error && error !== '' ? true : false}
          type='error'
        />
      </React.Fragment>
    );
  }
}

ViewerContainer.propTypes = {
  classes: PropTypes.object,
};

export default ViewerContainer;
