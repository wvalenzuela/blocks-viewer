import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballZoomToMouseManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomToMouseManipulator';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkGestureCameraManipulator from '@kitware/vtk.js/Interaction/Manipulators/GestureCameraManipulator';
import { throttle } from '@kitware/vtk.js/macros';
import { FieldAssociations } from '@kitware/vtk.js/Common/DataModel/DataSet/Constants';
import vtkPicker from '@kitware/vtk.js/Rendering/Core/Picker';
import Line from './Line';
import PolyLine from './PolyLine';


const WHITE = [1, 1, 1];
const GREEN = [0.1, 0.8, 0.1];
const RED = [1.0,0,0];

class Interactor {
    constructor(view, container, renderer, diagram) {
        this.dragging = null;
        this.lastProcessedActor = null;
        this.lastProcessedBlock = null;
        this.lastPaintedActor = null;
        this.lastPaintedActorColor = null;
        this.renderer = renderer;
        this.diagram = diagram;
        this.picker = vtkPicker.newInstance();
        this.currentLine = null;

        this.interactor = vtkRenderWindowInteractor.newInstance();
        this.interactor.setView(view);
        this.hardwareSelector = this.interactor.getView().getSelector();
        this.hardwareSelector.setCaptureZValues(true);
        this.hardwareSelector.setFieldAssociation(FieldAssociations.FIELD_ASSOCIATION_CELLS);
        this.interactor.setContainer(container);
        this.interactorStyle = vtkInteractorStyleManipulator.newInstance();
        this.interactorStyle.removeAllManipulators();
        this.interactor.setInteractorStyle(this.interactorStyle);
        this.panManipulator = vtkMouseCameraTrackballPanManipulator.newInstance();
        this.panManipulator.setButton(1);
        this.zoomManipulator = vtkMouseCameraTrackballZoomToMouseManipulator.newInstance();
        this.zoomManipulator.setScrollEnabled(true);
        this.zoomManipulator.setDragEnabled(false);
        this.gestureManipulator = vtkGestureCameraManipulator.newInstance();
        this.interactorStyle.addMouseManipulator(this.zoomManipulator);
        this.interactorStyle.addMouseManipulator(this.panManipulator);
        this.interactorStyle.addGestureManipulator(this.gestureManipulator);
        this.interactor.initialize();

        //gets called everytime the mouse is moved but throtteled down to once every 20 ms
        this.interactor.onMouseMove((event) => {
            throttle(this.handleMouseMove(event), 20);
            //this.handleMouseMove(event);
        });
      
          //event listener for left mouse button press
        this.interactor.onLeftButtonPress((event) => {
            this.handleMouseDown(event);
        });

        //event listener for left mouse button release
        this.interactor.onLeftButtonRelease((event) => {
            this.handleMouseUp(event);
        });

    }
    createLine(output) {
        this.currentLine = new PolyLine(this.renderer, output);
        return this.currentLine;
    }
    destroyLine(line) {
        console.log("destroyed line")
        this.renderer.removeActor(line.multiPrimitiveActor);
        if (line.inputPort) line.inputPort.connection = line.inputPort.connection.filter(item => item !== line);
        if (line.outputPort) line.outputPort.connection = line.outputPort.connection.filter(item => item !== line);
        this.diagram.lines = this.diagram.lines.filter(item => item !== line)
        line = null;
        this.currentLine = null;
    }

    //handles the mouse move event
    handleMouseMove(event) {
        //current position of the mouse inside the canvas, bottom right is 0,0 and top right is width,heigth
        const x = event.position.x;
        const y = event.position.y;
        //if the mouse is being moved while the left button is pressed and we are currently hovering a block    
        if (this.dragging == 'block') {
            this.picker.pick([x,y,0], this.renderer);
            const worldCoords = this.picker.getPickPosition();
            this.lastProcessedBlock.moveBlock(worldCoords[0],worldCoords[1]);
            this.renderer.getRenderWindow().render()
            return;
        } else if (this.dragging == 'port') {
            //handle port interaction - tbd
            this.picker.pick([x,y,0], this.renderer);
            const worldCoords = this.picker.getPickPosition();
            this.currentLine.drawLine(this.lastProcessedActor.getPosition(), worldCoords);
            this.renderer.getRenderWindow().render()
            return;
        } else if (this.dragging == 'neutral') {
            return;
        } else { 
            this.hardwareSelector.getSourceDataAsync(this.renderer,x,y,x,y).then((result) => {
                if (result) {
                    this.processSelections(result.generateSelection(x,y,x,y), x,y);
                } else {
                    this.processSelections(null);
                }
            });      
        }
    }

    handleMouseDown(event) {
        if (this.lastProcessedActor) {
            //if mouse clicking on a block-actor
            if (this.diagram.actors.get(this.lastProcessedActor) == 'block') {
                this.dragging = 'block';
                this.disablePan();
                this.lastProcessedActor.setDragable(false);
                this.lastProcessedBlock = this.diagram.blocks.find((element) => element.planeActor == this.lastProcessedActor);
                const x = event.position.x;
                const y = event.position.y;
                this.picker.pick([x,y,0], this.renderer);
                const worldCoords = this.picker.getPickPosition();
                this.lastProcessedBlock.prevX = worldCoords[0];
                this.lastProcessedBlock.prevY = worldCoords[1];
                return;
            //if mouse clicking on a port-actor
            } else if (this.diagram.actors.get(this.lastProcessedActor) == 'port') {
                this.dragging = 'port';
                this.disablePan();
                if (this.diagram.relation.get(this.lastProcessedActor).connection.length === 0) {
                    this.createLine(this.renderer, this.lastProcessedActor);
                    return;
                } else {
                    //needs fixing for multiple connection
                    this.currentLine = this.diagram.relation.get(this.lastProcessedActor).connection[0]
                    this.lastProcessedActor = this.diagram.relation.get(this.lastProcessedActor).type === "input" ? this.currentLine.outputPort.circleActor : this.currentLine.inputPort.circleActor;
                    this.currentLine.inputPort.connection = this.currentLine.inputPort.connection.filter(item => item !== this.currentLine);
                    this.currentLine.outputPort.connection = this.currentLine.outputPort.connection.filter(item => item !== this.currentLine);
                }
                
            //if mouse not clicking on an actor
            } else {
                this.dragging = 'neutral';
                return;
            }
        }
    }

    handleMouseUp(event) {
        this.dragging = null;
        this.lastProcessedBlock = null;
        if (this.interactorStyle.getNumberOfMouseManipulators() < 2) {
            this.enablePan();
        }
        //logic: if currentline -> use hardwareSelector to check if theres a port, if not, destroy line else connect
        //if (this.currentLine && this.diagram.actors.get(this.lastProcessedActor) == 'port') {
        if (this.currentLine) {
            const x = event.position.x;
            const y = event.position.y;
            const selection = this.hardwareSelector.getSourceDataAsync(this.renderer,x,y,x,y).then((result) => {
                const r = result.generateSelection(x,y,x,y);
                if (r[0]) {
                    this.handleConnect(r[0].getProperties().prop);
                } else {
                    this.destroyLine(this.currentLine);
                }
            });
        }
    }
    
    processSelections(selections, x, y) {
        //resets the color of the last highlighted actor
        if (this.lastPaintedActor) {
           // this.lastPaintedActor.getProperty().setColor(this.lastPaintedActorColor);
           this.diagram.relation.get(this.lastPaintedActor).outlineActor.setVisibility(false);

        }
        //if no actor is selected set lastProcessedActor 
        if ((!selections || selections.length === 0) && !this.dragging) {
            this.lastProcessedActor = null;
            this.renderer.getRenderWindow().render()
            return;
        }
        //get the prop from the hardwareSelector
        const {
            worldPosition: rayHitWorldPosition,
            compositeID,
            prop,
            propID,
            attributeID,
        } = selections[0].getProperties();
        //set lastProcessedActor
        this.lastProcessedActor = prop;
        //paint the selected actor green
        if (this.lastPaintedActor !== prop) {
            this.lastPaintedActorColor = prop.getProperty().getColor();
        }
        //prop.getProperty().setColor(...GREEN);
        if (this.diagram.actors.get(prop) === 'block') {
            this.diagram.relation.get(prop).outlineActor.setVisibility(true);
            this.lastPaintedActor = prop;
        }
        this.renderer.getRenderWindow().render()

    }

    handleConnect(prop){
        if (this.diagram.actors.get(prop) === 'port') {
            if (this.diagram.relation.get(prop).type === this.diagram.relation.get(this.lastProcessedActor).type || this.diagram.relation.get(prop).block === this.diagram.relation.get(this.lastProcessedActor).block) {
                this.destroyLine(this.currentLine);
                return;
            } else {
                //handle connection
                //this.currentLine.drawLine(this.lastProcessedActor.getPosition(), prop.getPosition());
                //this.renderer.getRenderWindow().render()
                const port1 = this.diagram.relation.get(prop)
                const port2 = this.diagram.relation.get(this.lastProcessedActor)
                let outputPort;
                let inputPort;
                if (port1.type === "output") {
                    //const start = this.currentLine.start;
                    //const end = this.currentLine.end;
                    //this.currentLine.start = end;
                    //this.currentLine.end = start;
                    outputPort = port1;
                    inputPort = port2;
                } else {
                    outputPort = port2;
                    inputPort = port1;
                }
                this.currentLine.drawLine(outputPort.circleActor.getPosition(),inputPort.circleActor.getPosition());
                this.renderer.getRenderWindow().render();
                this.currentLine.outputPort = outputPort;
                this.currentLine.inputPort = inputPort;
                port1.connection.push(this.currentLine);
                port2.connection.push(this.currentLine);
                console.log(port1)
                //const connection = {"idBlockOut": port1.block, "idPortOut": port1.bpid, "idBlockIn": port2.block, "idPortIn": port2.bpid}
                //this.diagram.connections.push(connection)
                this.diagram.lines.push(this.currentLine);
                this.currentLine = null;
                return
            }
        } else {
            this.destroyLine(this.currentLine);
            return;
        }
    }

    //enables panning of the canvas, adds the manipulators for panning
    enablePan() {
        this.interactorStyle.addMouseManipulator(this.panManipulator);
        this.interactorStyle.addGestureManipulator(this.gestureManipulator);
    }
    //disables panning of the canvas, removes the manipulators for panning
    disablePan() {
        this.interactorStyle.removeAllManipulators();
        this.interactorStyle.resetCurrentManipulator()
        this.interactorStyle.addMouseManipulator(this.zoomManipulator);
    }
   
}

export default Interactor;