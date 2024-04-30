import React from 'react';
import PropTypes from 'prop-types';
import {Grid, TextField, MenuItem} from '@mui/material';
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
        const {holder} = props;
        if (holder) {
            holder.getInputs = () => {
                if (Object.keys(this.state.inputs).length !== 1) return null;
                return this.state.inputs;
            };
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        // console.log({ value: event.target.value, key: event.target.name });
        const {inputs} = this.state;
        this.setState({
            inputs: {...inputs, [event.target.name]: event.target.value},
        });
    };
    handleRegister = () => {
        const {loading, inputs} = this.state;
        console.log(inputs);
        if (loading) return;
        this.setState({loading: true});
        (async () => {
            MutationRegisterBlock(inputs)
                .then((res) => {
                    const data = GetData(res);
                    console.log(data)
                    const {ok, block, errors} = data.registerBlocks;
                    if (ok) {
                        this.setState({loading: false, block, inputs: {}});
                        this.props.handleReload();
                    } else throw errors;
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    });
                    this.props.setState({error: ServerErrorsString(error)});
                });
        })();
    };

    render() {
        const {loading} = this.state;
        const disabled = Object.keys(this.state.inputs).length !== 4;
        const inputports = [{value: 0, label: 'No Inputs'}, {value: 1, label: 'One Input'}, {value: 2, label: 'Two Inputs'}]
        const outputports = [{value: 0, label: 'No Output'}, {value: 1, label: 'One Output'}, {value: 2, label: 'Two Outputs'}]
        return (
            <Grid
                container
                spacing={1}
                direction='row'
                justifyContent='center'
                alignItems='center'
                sx={{'& .MuiTextField-root': {m: 1, width: '15ch'}}}
            >
                <Grid item>
                    <TextField
                        name='name'
                        label='Block Name'
                        variant='standard'
                        onChange={this.handleChange}
                    />
                    <TextField
                        name='color'
                        label='Block Color'
                        variant='standard'
                        onChange={this.handleChange}
                    />
                </Grid>
                {/**<Grid item>
                    <TextField
                        name='inputs'
                        select
                        label='Input Ports'
                        variant='standard'
                        onChange={this.handleChange}>
                        {
                            inputports.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                </Grid>*/}
                {/**<Grid item>
                    <TextField
                        name='outputs'
                        select
                        label='Output Ports'
                        variant='standard'
                        onChange={this.handleChange}
                    >
                        {
                            outputports.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                </Grid>*/}

                <Grid>
                    <LoadingButton
                        size='small'
                        onClick={this.handleRegister}
                        endIcon={<SaveIcon/>}
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
