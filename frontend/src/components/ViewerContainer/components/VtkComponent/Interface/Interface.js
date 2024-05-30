import {FormControl, InputLabel, Select, MenuItem, TextField, Button} from "@mui/material";
import React from "react";
import {
    GetData,
    QueryBlocks,
    QueryFullBlock,
    ServerErrorsString,
    QueryDiagrams,
    QueryFullDiagram,
    MutationRegisterDiagram,
    MutationRegisterDiagramBlock,
    QueryBlockPorts,
    MutationRegisterDiagramLine,
    QueryDiagramLines,
    QueryBlock,
    MutationCreateDiagram,
    MutationCreateDiagramLines,
    QueryDiagram,
} from "../../../../../common";

/**
* <The Interactor class is a react component to implement the user interface to load and save blocks and diagrams from the database>
@param {function} addBlock function handled in the parent component to create a block with the data from database
@param {function} loadDiagram function handled in the parent component to create a diagram with the data from database
@param {function} saveDiagram function handled in the parent component to save a diagram to the database
@param {function} handleClear function handled in the parent componenten to clear the viewer
*/

export default function Interface({addBlock, loadDiagram, saveDiagram, handleClear}) {
    const [selectedBlock, setSelectedBlock] = React.useState(''); //state of the block dropdown menu
    const [selectedDiagram, setSelectedDiagram] = React.useState(''); //state of the diagram dropdown menu
    const [blocks, setBlocks] = React.useState([]); //state of the blocks queried from the database
    const [diagrams, setDiagrams] = React.useState([]); //state of the diagrams queried from the database
    const [diagramName, setDiagramName] = React.useState("New Diagram") //state of the textfield for the diagram name
    //handle block dropdown change
    const handleChangeBlock = (event) => {
        setSelectedBlock(blocks.find(block => block.id === event.target.value));
    };
    //handle diagram dropdown change
    const handleChangeDiagram = (event) => {
        setSelectedDiagram(diagrams.find(diagram => diagram.id === event.target.value));
    };
    //handle diagram name textfield change
    const handleDiagramNameChange = (event) => {
        setDiagramName(event.target.value);
    }
    //handles "Add Block" button, queries the database for the block and its ports
    const handleButtonBlock = () => {
        QueryBlock(selectedBlock.id).then((res) => {
            const block = GetData(res).block;
            addBlock(block)
        })
    };
    //handles the "Clear" button
    const handleButtonClear = () => {
      handleClear()
    }
    //handles the "Load Diagram" button, queries the database for the diagram and its blocks
    const handleButtonLoadDiagram = () => {
        QueryDiagram(selectedDiagram.id).then((res) => {
        const diagram = GetData(res).diagram;
        loadDiagram(diagram);
        })
    return;
  };
    //handles the "Save Diagram" button, mutates the database with the diagram and its blocks and lines
    const handleButtonSaveDiagram = () => {
        const diagramData = saveDiagram(); //gets the Diagram object
        const blocks = [];
        diagramData.blocks.forEach(block => { //creates mutation input from the blocks of the diagram
            const input = {
                blockId: block.id,
                xPos: block.x,
                yPos: block.y,
            }
            blocks.push(input);
        })
        MutationCreateDiagram({"name": diagramName, "blocks": blocks}).then((res) => {
            const diagram = GetData(res).createDiagram //creates a diagram in the database
            diagramData.blocks.map((block, index) => {
                block.dbid = diagram.blocks[index].id; //mutation returns dbid of each block, sets the dbid for each block object
            })
            const lines = [];
            diagramData.lines.forEach(line => { //creates the mutation input for each line
                console.log(line);
                const input = {
                    idBlockIn: line.inputPort.block.dbid,
                    idBlockOut: line.outputPort.block.dbid,
                    idPortIn: line.inputPort.bpid,
                    idPortOut: line.outputPort.bpid,
                }
                lines.push(input)
            })
            if (lines) { //creates the lines in the database
                MutationCreateDiagramLines({"diagramId": diagram.id, "lines": lines}).then((res) => {
                    const data = GetData(res);
                })
            }
        })
        return;
    };
    React.useEffect(() => { //queries the blocks and diagrams from the database for the dropdown menus
        QueryBlocks().then((res) => {
            const data = GetData(res);
            const {ok, blocks, errors} = data.allBlocks;
            if (ok) setBlocks(blocks);
            else throw errors;
        });
        QueryDiagrams().then((res) => {
            const data = GetData(res);
            const {ok, diagrams, errors} = data.allDiagrams;
            if (ok) setDiagrams(diagrams);
            else throw errors;
        });
    }, []);

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'flex-end', width: '100%'}}>
                <Button sx={{mr: 1}} variant='contained' onClick={handleButtonBlock}>ADD BLOCK</Button>
                <FormControl sx={{mr: 1}} style={{}}>
                    <InputLabel id="dropdown-blocks">Select a Block</InputLabel>
                    <Select
                        labelId="dropdown-blocks"
                        id="dropdown-select-blocks"
                        value={selectedBlock ? selectedBlock.id : ''}
                        onChange={handleChangeBlock}
                        style={{minWidth: "175px"}}
                    >
                        {blocks.map((block, index) => (
                            <MenuItem key={index} value={block.id}>
                                {block.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button sx={{mr: 1}} variant='contained' onClick={handleButtonLoadDiagram}>LOAD DIAGRAM</Button>
                <FormControl >
                    <InputLabel sx={{mr: 1}} id="dropdown-diagrams">Select a Diagram</InputLabel>
                    <Select
                        labelId="dropdown-diagrams"
                        id="dropdown-select-diagrams"
                        value={selectedDiagram ? selectedDiagram.id : ''}
                        onChange={handleChangeDiagram}
                        style={{minWidth: "175px"}}
                    >
                        {diagrams.map((diagram, index) => (
                            <MenuItem key={index} value={diagram.id}>
                                {diagram.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button sx={{mr: 1}} style={{marginLeft:'10px', backgroundColor:'green'}} variant='contained' onClick={handleButtonSaveDiagram}>SAVE DIAGRAM</Button>

                <TextField
                    name='diagramName'
                    label='Diagram Name'
                    variant='standard'
                    onChange={handleDiagramNameChange}
                />
                <Button sx={{mr: 1}} style={{marginLeft:'10px', backgroundColor:'red'}} variant='contained' onClick={handleButtonClear}>CLEAR</Button>

            </div>
        </div>
    );
}
