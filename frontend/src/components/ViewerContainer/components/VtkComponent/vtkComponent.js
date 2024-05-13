import { useRef, useEffect, useState, useCallback } from "react";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkPicker from "@kitware/vtk.js/Rendering/Core/Picker";
import Block from "./Block";
import Diagram from "./Diagram";
import Interactor from "./Interactor";
import Interface from "./Interface/Interface"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";
import {
  GetData,
  QueryBlocks,
  ServerErrorsString,
  QueryDiagrams,
} from "../../../../common";


function VtkComponent() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const flexContainer = useRef(null);
  const diagramRef = useRef(null);

  // This is an example of how you can use states
  // See the code commented below
  // const [coneResolution, setConeResolution] = useState(6);
  const addBlock = (block) => {
    diagramRef.current.createBlock(0,0,block.ports,block.color,block.id,null);
  }
  const loadDiagram = (diagramData) => {
    //diagramRef.current.renderer.removeAllActors();
    //const temprenderer = diagramRef.current.renderer;
    //diagramRef.current = new Diagram(temprenderer, diagramData.name)
    diagramRef.current.buildDiagram(diagramData);
  }
  const saveDiagram = () => {
    return diagramRef.current.saveDiagram();
  }

  useEffect(() => {
    if (context.current) return;
    //replace with diagram class tbd

    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    //background color light gray
    renderer.setBackground(0.8, 0.8, 0.8);
    renderWindow.addRenderer(renderer);

    const openGlRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openGlRenderWindow);

    const container = vtkContainerRef.current;
    openGlRenderWindow.setContainer(container);

    //create a new diagram and create a block
    const diagram = new Diagram(renderer, "new diagram 4");
    diagramRef.current = diagram;
    //diagram.createBlock(5, 5, ["integer", "boolean"], ["integer", "double","string"], [1.0,0.5,0.0])
   /* diagram.createBlock(
      5,
      0,
      ["integer", "boolean"],
      ["integer", "double", "string"],
      [0.8, 1.0, 0.0]
    ); */

    //interactor Class to set up interactor and manipulators
    const interactor = new Interactor(
      openGlRenderWindow,
      container,
      renderer,
      diagram
    );
    openGlRenderWindow.setSize(container.clientWidth, container.clientHeight);

    // window.addEventListener('resize', () => {
    // 	const boundingRect = container.getBoundingClientRect();
    // 	openGlRenderWindow.setSize(boundingRect.width, boundingRect.height);
    // });

    // const observer = new ResizeObserver((entries) => {
    // 	console.log('ResizeObserver', entries);
    // 	const boundingRect = container.getBoundingClientRect();
    // 	openGlRenderWindow.setSize(boundingRect.width, boundingRect.height);
    // });
    // observer.observe(container);

    const handleResize = () => {
      openGlRenderWindow.setSize(window.innerWidth, window.innerHeight);
    };

    //tbd
    //window.addEventListener('resize', handleResize);

    renderer.resetCamera();
    renderWindow.render();

    context.current = {
      renderWindow,
      renderer,
      openGlRenderWindow,
    };
  }, [vtkContainerRef]);

  return (
      <div
          style={{flex: "1 0 auto"}}
          ref={flexContainer}
      >
        <div style={{width:'100%'}}>
          <Interface
              addBlock={addBlock}
              loadDiagram={loadDiagram}
              saveDiagram={saveDiagram}
          ></Interface>
        </div>
        <div ref={vtkContainerRef} style={{width: "100%", height: "100%", border: "1px black solid"}}/>

      </div>

  );
}

export default VtkComponent;
