import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    GetData,
    MutationRegisterBlock,
    ServerErrorsString,
} from '../../../../common';

class ViewerBlocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            inputs: {},
        };
        const { holder } = props;
        if (holder) {
            holder.getInputs = () => {
                if (Object.keys(this.state.inputs).length !== 4) return null;
                return this.state.inputs;
            };
        }
    }
    handleChange = (event) => {
        event.preventDefault();
        // console.log({ value: event.target.value, key: event.target.name });
        const { inputs } = this.state;
        this.setState({
            inputs: { ...inputs, [event.target.name]: event.target.value },
        });
    };
    handleRegister = () => {
        const { loading, inputs } = this.state;
        if (loading) return;
        this.setState({ loading: true });
        (async () => {
            MutationRegisterBlock(inputs)
                .then((res) => {
                    const data = GetData(res);
                    const { ok, user, errors } = data.register;
                    if (ok) this.setState({ loading: false, user, inputs: {} });
                    else throw errors;
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    });
                    this.props.setState({ error: ServerErrorsString(error) });
                });
        })();
    };
    render() {
        const { loading } = this.state;
        const disabled = Object.keys(this.state.inputs).length !== 4;
        return (
            <Grid
                container
                spacing={1}
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Grid item>
                    <TextField
                        name='name'
                        label='Block Name'
                        variant='standard'
                        onChange={this.handleChange}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name='name'
                        label='Input Ports'
                        varaint='standard'
                        onChange={this.handleChange}
                        />
                </Grid>
                <Grid item>
                    <TextField
                        name='name'
                        label='Output Ports'
                        varaint='standard'
                        onChange={this.handleChange}
                    />
                </Grid>

                <Grid>
                    <LoadingButton

                        size='small'
                        onClick={this.handleRegister}
                        endIcon={<SaveIcon />}
                        loading={loading}
                        loadingPosition='end'
                        variant='contained'
                    >
                        RegisterBlocks
                    </LoadingButton>
                </Grid>
            </Grid>
        );
    }
}

ViewerBlocks.propTypes = {
    classes: PropTypes.object,
};

export default ViewerBlocks;
