import React from 'react';
import PropTypes from 'prop-types';
import {Grid, TextField, MenuItem} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    GetData,
    MutationRegisterBlock,
    ServerErrorsString,
    MutationRegisterBlockPorts,
    MutationCreateBlock,
    QueryPorts,
} from '../../../../common';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

class ViewerBlocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ports: [],
            loading: false,
            inputs: {},
            data: [],
            inputData: [],
            outputData: [],
            idInput:0,
            idOutput:0,
        };
        const {holder} = props;
        if (holder) {
            holder.getInputs = () => {
                if (Object.keys(this.state.inputs).length !== 1) return null;
                return this.state.inputs;
            };
        }
        this.outputports = [
            {value: 0, label: 'string'}, 
            {value: 1, label: 'boolean'}, 
            {value: 2, label: 'int'}
        ];
        this.inputports = [
            {value: 0, label: 'string'}, 
            {value: 1, label: 'boolean'}, 
            {value: 2, label: 'int'}
        ];
    }
    
    componentDidMount() {
            QueryPorts().then((res) => {
              const data = GetData(res);
              const { ok, ports, errors } = data.allPorts;
              if (ok) this.setState({ports: ports});
              else throw errors;
            });
    }


    handleChange = (event) => {
        event.preventDefault();
        const {inputs} = this.state;
        this.setState({
            inputs: {...inputs, [event.target.name]: event.target.value},
        });
    };
    handleRegister = () => {
        const {loading, inputs, inputData, outputData} = this.state;
        const ports = inputData.map(port => port.queryInput).concat(outputData.map(port => port.queryInput));
        if (loading) return;
        this.setState({loading: true});

        (async () => {
            MutationCreateBlock({"name": inputs.name, "color": inputs.color, "ports": ports})
                .then((res) => {
                    const data = GetData(res);
                    const {createBlock} = data.createBlock;
                    this.setState({loading: false});
                    this.props.handleReload();
                    })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    });
                    this.props.setState({error: ServerErrorsString(error)});
                });
        this.setState({inputData: [], outputData: [], inputs: {}})
    })();
    };

    addInput = () => {
        const { inputs, inputData, idInput, ports} = this.state;
        const { input} = inputs;
        
        // Find the selected input port object from inputports array
        const selectedInputPort = ports.find(port => port.id === inputs.input);

        const newDataItem = {
            idInput: idInput,
            column1: idInput,
            column2: selectedInputPort.name,
            column3: selectedInputPort.color,
            queryInput: {portId: selectedInputPort.id, type: "in", multi: false, position: 0},
        };
        this.setState({
            inputData: [...inputData, newDataItem],
            idInput: idInput + 1,
        });
        
    };
    addOutput = () => {
        const { inputs, outputData, idOutput, ports } = this.state;
        const { output } = inputs;

        // Find the selected output port object from outputports array
        const selectedOutputPort = ports.find(port => port.id === inputs.output);    

        const newDataItem = {
            idInput: idOutput,
            column1: idOutput,
            column2: selectedOutputPort.name,
            column3: selectedOutputPort.color,
            queryInput: {portId: selectedOutputPort.id, type: "out", multi: false, position: 0},
        };
        this.setState({
            outputData: [...outputData, newDataItem],
            idOutput: idOutput + 1,
        });
        
    };

    removeInputPort = (idToRemove) => {
        this.setState(prevState => ({
            inputData: prevState.inputData.filter(item => item.idInput !== idToRemove)
        }));
    };

    removeOutputPort = (idToRemove) => {
        this.setState(prevState => ({
            outputData: prevState.outputData.filter(item => item.idOutput !== idToRemove)
        }));
    };

    render() {
        const {loading, data, inputData, outputData} = this.state;
        const disabled = Object.keys(this.state.inputs).length !== 4;
        const color = [{value: 0, label: 'red'}, {value: 1, label: 'blue'}, {value: 2, label: 'green'}]
        //const inputports = [{value: 0, label: 'No Inputs'}, {value: 1, label: 'One Input'}, {value: 2, label: 'Two Inputs'}]
        //const outputports = [{value: 0, label: 'No Output'}, {value: 1, label: 'One Output'}, {value: 2, label: 'Two Outputs'}]
        return (

            
            
            //Name, Color
            <Grid
                container
                spacing={1}
                direction='row'
                justifyContent='flex-start'
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
                </Grid>
                {<Grid item>
                    <TextField
                        value={this.state.inputs.color ? this.state.inputs.color : ''}
                        name='color'
                        select
                        label='Color'
                        variant='standard'
                        onChange={this.handleChange}>
                        {
                            color.map((option) => (
                                <MenuItem key={option.value} value={option.label}>
                                    {option.label}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                </Grid>}

                
                

                {/* InputPort */}
                <Grid item xs={12}>
                    <TextField
                        value={this.state.inputs.input ? this.state.inputs.input : ''}
                        name='input'
                        select
                        label='Input Port'
                        variant='standard'
                        onChange={this.handleChange}
                    >
                        {
                            this.state.ports.map((port, index) => (
                                <MenuItem key={index} value={port.id}>
                                    {port.name}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                   
                        
                        <LoadingButton
                            size='small'
                            onClick={this.addInput}
                            loading={loading}
                            loadingPosition='end'
                            variant='contained'
                        >
                            Add Input Port
                        </LoadingButton>
                </Grid>


                {/* OututPort */}
                <Grid item xs={12}>
                   
                    <TextField
                        value={this.state.inputs.output ? this.state.inputs.output : ''}
                        name='output'
                        select
                        label='Output Ports'
                        variant='standard'
                        onChange={this.handleChange}
                    >
                        {
                            this.state.ports.map((port, index) => (
                                <MenuItem key={index} value={port.id}>
                                    {port.name}
                                </MenuItem>
                            ))
                        }
                    </TextField>     

                    <LoadingButton
                            size='small'
                            onClick={this.addOutput}
                            loading={loading}
                            loadingPosition='end'
                            variant='contained'
                        >
                            Add Output Port
                        </LoadingButton>                      

                </Grid>

                {/* Table */}
                <Grid container spacing={2}>
                {/* Input Table */}
                <Grid item xs={6}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Input Port</TableCell>
                                        <TableCell>Color</TableCell>
                                        {/* Add more table headers as needed */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inputData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4}>No ports selected</TableCell>
                                        </TableRow>
                                    ) : (
                                        inputData.map((row) => (
                                            <TableRow key={row.idInput}>
                                                <>
                                                    <TableCell>{row.column1}</TableCell>
                                                    <TableCell>{row.column2}</TableCell>
                                                    <TableCell>{row.column3}</TableCell>
                                                    <TableCell>
                                                        <LoadingButton
                                                            size='small'
                                                            onClick={() => this.removeInputPort(row.idInput)}
                                                            loading={loading}
                                                            loadingPosition='end'
                                                            variant='contained'
                                                            sx={{ mr: 1 }}
                                                        >
                                                            Remove Port
                                                        </LoadingButton>  
                                                    </TableCell>
                                                </>  
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    
                </Grid>

                {/* Output Table */}
                <Grid item xs={6}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Output Port</TableCell>
                                    <TableCell>Color</TableCell>
                                    {/* Add more table headers as needed */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {outputData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>No ports selected</TableCell>
                                </TableRow>
                            ) : (
                                outputData.map((row) => (
                                    <TableRow key={row.idOutput}>
                                        <>
                                            <TableCell>{row.column1}</TableCell>
                                            <TableCell>{row.column2}</TableCell>
                                            <TableCell>{row.column3}</TableCell>
                                            <TableCell>
                                                <LoadingButton
                                                    size='small'
                                                    onClick={() => this.removeOutputPort(row.idOutput)}
                                                    loading={loading}
                                                    loadingPosition='end'
                                                    variant='contained'
                                                    sx={{ mr: 1 }}
                                                >
                                                    Remove Port
                                                </LoadingButton>  
                                            </TableCell>
                                        </>  
                                    </TableRow>
                                ))
                            )}
                            
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

                {/* RegisterBlock Button*/}
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
