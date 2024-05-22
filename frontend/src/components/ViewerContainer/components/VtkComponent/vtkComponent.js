import { useRef, useEffect, useState, useCallback } from "react";
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import StyledBlock from "./StyledBlock";
import Diagram from "./Diagram";
import Interactor from "./Interactor";
import Interface from "./Interface/Interface";
import React from "react";
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkPolydata from '@kitware/vtk.js/Common/DataModel/PolyData';


function VtkComponent() {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const flexContainer = useRef(null);
  const diagramRef = useRef(null);
  let yBlock = 0; //increase y-coordinate so that blocks dont get added on top of eachother

  // This is an example of how you can use states
  // See the code commented below
  // const [coneResolution, setConeResolution] = useState(6);
  const addBlock = (block) => {
    diagramRef.current.createBlock(
      0,
      yBlock,
      block.ports,
      block.color,
      block.id,
      null,
      block.name,
    );
    yBlock += 5
  };
  const loadDiagram = (diagramData) => {
    diagramRef.current.renderer.removeAllActors();
    //const temprenderer = diagramRef.current.renderer;
    //diagramRef.current = new Diagram(temprenderer, diagramData.name)
    diagramRef.current.buildDiagram(diagramData);
  };
  const saveDiagram = () => {
    return diagramRef.current.saveDiagram();
  };
  const handleClear = () => {
    diagramRef.current.clear()
  }

  useEffect(() => {
    if (context.current) return;

    console.log("start")

    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    //background color light gray
    renderer.setBackground(0.949, 0.957, 0.961);
    renderWindow.addRenderer(renderer);

    const openGlRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openGlRenderWindow);

    const container = vtkContainerRef.current;
    openGlRenderWindow.setContainer(container);
    console.log("added renderer")

    //create a new diagram and create a block
    
    
    const gridPoints = [];
    const gridSpacing = 0.375;
    const gridSize = 100;
    for (let i = -gridSize; i <= gridSize; i += gridSpacing) {
      for (let j = -gridSize; j <= gridSize; j += gridSpacing) {
        gridPoints.push(i, j, -0.01);
      }
    }
    // mit grid array
    const gridMapper = vtkMapper.newInstance();
    const grid = vtkPolydata.newInstance();
    const gridCircles = []
    const radius = 0.02;
    const numPointsAround = 10;

  // Iterate over each input point
  for (let i = 0; i < gridPoints.length; i += 3) {
    const x = gridPoints[i];
    const y = gridPoints[i + 1];
    const z = gridPoints[i + 2];

    // Calculate points around the given point to form a circle
    for (let j = 0; j < numPointsAround; j++) {
      const angle = (2 * Math.PI * j) / numPointsAround; // Angle between each point
      const newX = x + radius * Math.cos(angle);
      const newY = y + radius * Math.sin(angle);
      gridCircles.push(newX, newY, z); // Push coordinates directly into the array
  }
}

    const connectionArray = []; //0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,...,multiPrimitiveCirclePoints.length/3
    for (let i = 0; i < gridCircles.length; i += 3) {
      connectionArray.push(i / 3);
    }

    const circlePolyDataArray = []; //multiPrimitiveCircleData.getPolys().setData(Uint32Array.from(
    for (let i = 0; i < connectionArray.length; i += 10) {
      circlePolyDataArray.push(
        10,
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9
      );
    }

    //create polydata
    grid
      .getPoints()
      .setData(Float32Array.from(gridCircles), 3);
    grid
      .getPolys()
      .setData(Uint32Array.from([...circlePolyDataArray]));
    gridMapper.setInputData(grid);

    const gridActor = vtkActor.newInstance();
    gridActor.setMapper(gridMapper);

    gridActor.setDragable(false);
    gridActor.setPickable(false);
    gridActor.getProperty().setColor(0.863,0.871,0.878)

    renderer.addActor(gridActor);
    console.log("created grid")
    const diagram = new Diagram(renderer, "new diagram 4",gridActor);
    diagramRef.current = diagram;
    console.log("created diagram")
/*
    const bb = new StyledBlock(
      renderer,
      5,
      5,
      [],
      "red",
      diagram,
      1,
      1,
      "This is a very long text"
    );
    console.log("created block")*/

    //interactor Class to set up interactor and manipulators
    const interactor = new Interactor(
      openGlRenderWindow,
      container,
      renderer,
      diagram,
    );
    openGlRenderWindow.setSize(container.clientWidth, container.clientHeight);
    console.log("added interactor")

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
    //const lmfao = createTextPolydata("Block 44");
   //renderer.addActor(lmfao[0])
   //renderer.addActor(lmfao[1])  
  //renderer.resetCamera();
  //renderWindow.render();
  diagram.renderRoutine();
  renderer.getActiveCamera().setPosition(0,0,10);
  renderWindow.render();
  console.log("rendered")

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
              handleClear={handleClear}
          ></Interface>
        </div>
        <div ref={vtkContainerRef} style={{width: "100%", height: "100%", border: "1px black solid", marginTop: '20px'}}/>

      </div>

  );
}

export default VtkComponent;
