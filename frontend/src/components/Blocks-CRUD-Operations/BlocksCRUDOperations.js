import React from 'react';
import PropTypes from 'prop-types';
import { GetData, QueryBlocks, ServerErrorsString, QueryPorts } from '../../common';
import SnackMessage from '../SnackMessage';
import { Box, CircularProgress, Grid } from '@mui/material';
import { TabelBlocks, ViewerBlocks } from './components';

class BlocksCRUDOperations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: '',
            blocks: [],
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
            QueryBlocks()
                .then((res) => {
                    const data = GetData(res);
                    const { ok, blocks, errors } = data.allBlocks;
                    if (ok) this.setState({ loading: false, blocks });
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
        const { error, loading, blocks } = this.state;
        let Component = (
            <Grid item>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            </Grid>
        );
        if (!loading) {
            Component = <Grid item xs={12}>{`Total blocks: ${blocks.length}`}</Grid>;
        }
        return (
            <React.Fragment>
                <Grid container spacing={1}>
                    <Grid item>
                        <ViewerBlocks
                            holder={this.holder}
                            setState={(state) => this.setState(state)}
                            handleReload={this.handleUsers}
                        />
                    </Grid>
                    {Component}
                    <Grid item>
                        <TabelBlocks
                            rows={loading ? [] : blocks}
                            handleReload={this.handleUsers}
                        />
                    </Grid>
                </Grid>
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

BlocksCRUDOperations.propTypes = {
    classes: PropTypes.object,
};

export default BlocksCRUDOperations;
