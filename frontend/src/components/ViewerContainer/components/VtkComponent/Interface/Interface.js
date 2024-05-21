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

export default function Interface({addBlock, loadDiagram, saveDiagram}) {
    const [selectedBlock, setSelectedBlock] = React.useState('');
    const [selectedDiagram, setSelectedDiagram] = React.useState('');
    const [blocks, setBlocks] = React.useState([]);
    const [diagrams, setDiagrams] = React.useState([]);
    const [diagramName, setDiagramName] = React.useState("New Diagram")
    //let blocks = [];
    //let diagrams = [];
    const handleChangeBlock = (event) => {
        setSelectedBlock(blocks.find(block => block.id === event.target.value));
    };
    const handleChangeDiagram = (event) => {
        setSelectedDiagram(diagrams.find(diagram => diagram.id === event.target.value));
    };
    const handleDiagramNameChange = (event) => {
        setDiagramName(event.target.value);
    }

    const handleButtonBlock = () => {
        QueryBlock(selectedBlock.id).then((res) => {
            const block = GetData(res).block;
            addBlock(block)
        })
    };

    const handleButtonLoadDiagram = () => {
        QueryDiagram(selectedDiagram.id).then((res) => {
            const diagram = GetData(res).diagram;
            console.log(diagram);
            loadDiagram(diagram);
        })
        /*
        QueryFullDiagram(null,null,null,selectedDiagram.id).then((res) => {
          const data = GetData(res);
          const { ok, diagramBlocks, errors } = data.fullDiagram;
          if (ok) {
            loadDiagram(selectedDiagram.id, diagramBlocks);
            QueryDiagramLines(null,null,null,selectedDiagram.id).then((res) => {
              const data = GetData(res);
              const { ok, diagramLines, errors } = data.allDiagramLines;
              if (ok) loadLines(diagramLines);
              else throw errors;
            });
          }
          else throw errors;
        });*/
        return;
    };

    const handleButtonSaveDiagram = () => {
        const diagramData = saveDiagram();
        const blocks = [];
        diagramData.blocks.forEach(block => {
            const input = {
                blockId: block.id,
                xPos: block.x,
                yPos: block.y,
            }
            blocks.push(input);
        })
        MutationCreateDiagram({"name": diagramName, "blocks": blocks}).then((res) => {
            const diagram = GetData(res).createDiagram
            diagramData.blocks.map((block, index) => {
                block.dbid = diagram.blocks[index].id;
            })
            const lines = [];
            diagramData.lines.forEach(line => {
                console.log(line);
                const input = {
                    idBlockIn: line.inputPort.block.dbid,
                    idBlockOut: line.outputPort.block.dbid,
                    idPortIn: line.inputPort.bpid,
                    idPortOut: line.outputPort.bpid,
                }
                lines.push(input)
            })
            if (lines) {
                MutationCreateDiagramLines({"diagramId": diagram.id, "lines": lines}).then((res) => {
                    const data = GetData(res);
                    console.log(data)
                })
            }
        })
        /*
        MutationRegisterDiagram({"name": diagramName}).then((res) => {
          const data = GetData(res);
          const { ok, diagram, errors } = data.registerDiagrams;
          console.log(data)
          const promises = diagramData.blocks.map(block => {
            return MutationRegisterDiagramBlock({"idDiagram": diagram.id, "idBlock": block.id, "xPos": block.x, "yPos": block.y}).then((res) => {
              const data = GetData(res);
              console.log(data)
              const {diagramBlock } = data.registerDiagramBlocks;
              block.dbid = diagramBlock.id
              //diagram line with block.dbid and connections
            });
          })
          Promise.all(promises).then(()=> {
            diagramData.connections.forEach(connection => {
              MutationRegisterDiagramLine({"idDiagram": diagram.id, "idBlockOut": connection.idBlockOut.dbid, "idPortOut": connection.idPortOut, "idBlockIn": connection.idBlockIn.dbid, "idPortIn":connection.idPortIn}).then((res) => {
                const data = GetData(res);
                const { ok, diagramLine, errors } = data.registerDiagramLines;
                console.log(diagramLine)
              })
            })
          })

        });*/


        return;
    };
    React.useEffect(() => {
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
    /*
    const tempblock = {
      id: 0,
      name: "Test Block"
    }
    const tempblock2 = {
      id: 1,
      name: "Test Block 2"
    }
    //setBlocks([tempblock])
    blocks = [tempblock, tempblock2];
    const tempdiagram = {
      id: 0,
      name: "Test Diagram"
    }
    //setDiagrams([tempdiagram]);
    diagrams = [tempdiagram];
    */

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'flex-end', width: '100%'}}>
                <Button sx={{mr: 1}} variant='contained' onClick={handleButtonBlock}>ADD BLOCK</Button>
                <FormControl sx={{mr: 1}}>
                    <InputLabel id="dropdown-blocks">Select a Block</InputLabel>
                    <Select
                        labelId="dropdown-blocks"
                        id="dropdown-select-blocks"
                        value={selectedBlock ? selectedBlock.id : ''}
                        onChange={handleChangeBlock}
                        style={{minWidth: "200px"}}
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
                        style={{minWidth: "200px"}}
                    >
                        {diagrams.map((diagram, index) => (
                            <MenuItem key={index} value={diagram.id}>
                                {diagram.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button sx={{mr: 1}} variant='contained' onClick={handleButtonSaveDiagram}>SAVE DIAGRAM</Button>

                <TextField
                    name='diagramName'
                    label='Diagram Name'
                    variant='standard'
                    onChange={handleDiagramNameChange}
                />
            </div>
        </div>
    );
}
