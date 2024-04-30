import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";
import {
  GetData,
  QueryBlocks,
  ServerErrorsString,
  QueryDiagrams,
  QueryFullDiagram
} from "../../../../../common";

export default function Interface({ addBlock, loadDiagram, saveDiagram }) {
  const [selectedBlock, setSelectedBlock] = React.useState('');
  const [selectedDiagram, setSelectedDiagram] = React.useState('');
  let blocks = [];
  let diagrams = [];
  const handleChangeBlock = (event) => {
    setSelectedBlock(blocks.find(block => block.id === event.target.value));
  };
  const handleChangeDiagram = (event) => {
    setSelectedDiagram(event.target.value);
  };
  const handleButtonBlock = () => {
    addBlock(selectedBlock);
  };
  const handleButtonLoadDiagram = () => {
    QueryFullDiagram(null,null,null,1).then((res) => {
      const data = GetData(res);
      const { ok, diagramBlocks, errors } = data.fullDiagram;
      if (ok) loadDiagram(diagramBlocks);
      else throw errors;
    });
    return;
  };
  const buildDiagram = (diagram) => {
    diagram.forEach(block => {
      console.log(block.id)
      console.log(block.xPos)
      console.log(block.block.color)
      block.block.port.forEach(port => {
        console.log(port.name)
      })
    })
  }
  const handleButtonSaveDiagram = () => {
    return;
  };
  /*
  QueryBlocks().then((res) => {
    const data = GetData(res);
    const { ok, blocks, errors } = data.allBlocks;
    if (ok) setBlocks(blocks);
    else throw errors;
  });
  QueryDiagrams().then((res) => {
    const data = GetData(res);
    const { ok, diagrams, errors } = data.allDiagrams;
    if (ok) setDiagrams(diagrams);
    else throw errors;
  });*/
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
  

  return (
    <div>
      <button onClick={handleButtonBlock}>ADD BLOCK</button>
      <FormControl>
        <InputLabel id="dropdown-blocks">Select a Block</InputLabel>
        <Select
          labelId="dropdown-blocks"
          id="dropdown-select-blocks"
          value={selectedBlock ? selectedBlock.id : ''}
          onChange={handleChangeBlock}
          style={{ minWidth: "200px" }}
        >
          {blocks.map((block, index) => (
            <MenuItem key={index} value={block.id}>
              {block.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button onClick={handleButtonLoadDiagram}>LOAD DIAGRAM</button>
      <FormControl>
        <InputLabel id="dropdown-diagrams">Select a Diagram</InputLabel>
        <Select
          labelId="dropdown-diagrams"
          id="dropdown-select-diagrams"
          value={selectedDiagram}
          onChange={handleChangeDiagram}
          style={{ minWidth: "200px" }}
        >
          {diagrams.map((diagram, index) => (
            <MenuItem key={index} value={diagram}>
              {diagram.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button onClick={handleButtonSaveDiagram}>LOAD DIAGRAM</button>
    </div>
  );
}
