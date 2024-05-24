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
        this.lastProcessedParent = null;
        this.lastProcessedBlock = null;
        this.lastPaintedActor = null;
        this.lastPaintedActorColor = null;
        this.renderer = renderer;
        this.diagram = diagram;
        this.picker = vtkPicker.newInstance();
        this.currentLine = null;
        this.selectedLine = null;
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
        this.currentLine = new PolyLine(this.renderer, this.lastProcessedParent.color2);
        this.diagram.relation.set(this.currentLine.multiPrimitiveActor, this.currentLine)
        return this.currentLine;
    }
    destroyLine(line) {
        this.renderer.removeActor(line.multiPrimitiveActor);
        if (line.inputPort) line.inputPort.connection = line.inputPort.connection.filter(item => item !== line);
        if (line.outputPort) line.outputPort.connection = line.outputPort.connection.filter(item => item !== line);
        this.diagram.lines = this.diagram.lines.filter(item => item !== line)
        this.diagram.relation.delete(line.multiPrimitiveActor)
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
            this.lastProcessedParent.moveBlock(worldCoords[0],worldCoords[1]);
            this.renderer.getRenderWindow().render()
            return;
        } else if (this.dragging == 'port') {
            this.picker.pick([x,y,0], this.renderer);
            const worldCoords = this.picker.getPickPosition();
            this.currentLine.drawLine(this.lastProcessedActor.getPosition(), worldCoords);
            this.renderer.getRenderWindow().render()
            return;
        } else if (this.dragging == 'neutral') {
            return;
        } /*else {
            this.hardwareSelector.getSourceDataAsync(this.renderer,x,y,x,y).then((result) => {
                if (result) {
                    this.processSelections(result.generateSelection(x,y,x,y), x,y);
                } else {
                    this.processSelections(null);
                }
            });      
        }*/
    }

    handleMouseDown(event) {
        const x = event.position.x;
        const y = event.position.y;
        //selects props at current mouse position
        this.hardwareSelector.getSourceDataAsync(this.renderer,x,y,x,y).then((result) => {
            const r = result.generateSelection(x,y,x,y);
            if (r[0]) {
                this.lastProcessedActor = r[0].getProperties().prop
                const lpaType = this.diagram.actors.get(this.lastProcessedActor)
                this.lastProcessedParent = this.diagram.relation.get(this.lastProcessedActor)
                //if mouse clicking on a block-actor -> move block
                if (lpaType == 'block') {
                    this.dragging = 'block';
                    this.disablePan();
                    this.lastProcessedParent.showOutline();
                    const x = event.position.x;
                    const y = event.position.y;
                    this.picker.pick([x,y,0], this.renderer);
                    const worldCoords = this.picker.getPickPosition();
                    this.lastProcessedParent.prevX = worldCoords[0];
                    this.lastProcessedParent.prevY = worldCoords[1];
                    return;
                //if mouse clicking on a port-actor -> create or remove line
                } else if (lpaType == 'port') {
                    this.dragging = 'port';
                    this.disablePan();
                    let validSelectedLine = false;
                    if (this.selectedLine) {
                        validSelectedLine = (this.selectedLine.inputPort === this.lastProcessedParent || this.selectedLine.outputPort === this.lastProcessedParent)
                    } 
                    if (this.lastProcessedParent.connection.length === 0 || (this.lastProcessedParent.multi && !validSelectedLine)) {
                        this.lastProcessedParent.increase()
                        this.createLine(this.renderer, this.lastProcessedActor);
                        return;
                    } else {
                        //needs fixing for multiple connection
                        this.currentLine = validSelectedLine ? this.selectedLine : this.lastProcessedParent.connection[0]
                        this.lastProcessedActor = this.lastProcessedParent.type === "input" ? this.currentLine.outputPort.portActor : this.currentLine.inputPort.portActor;
                        this.lastProcessedParent = this.diagram.relation.get(this.lastProcessedActor);
                        this.lastProcessedParent.increase();
                        this.currentLine.inputPort.connection = this.currentLine.inputPort.connection.filter(item => item !== this.currentLine);
                        this.currentLine.outputPort.connection = this.currentLine.outputPort.connection.filter(item => item !== this.currentLine);
                    }
                //mouse clicking on a line?
                } else {
                    this.lastProcessedActor.getProperty().setColor([0,1,0])
                    if (this.selectedLine) {
                        this.selectedLine.multiPrimitiveActor.getProperty().setColor(this.selectedLine.color)
                    }
                    this.selectedLine = this.diagram.relation.get(this.lastProcessedActor)
                }
            } else {
                this.dragging = 'neutral';
                this.lastProcessedActor = null;
                this.lastProcessedParent = null;
            }
        });
    }

    handleMouseUp(event) {
        this.dragging = null;
        if (this.interactorStyle.getNumberOfMouseManipulators() < 2) {
            this.enablePan();
        }
        if (this.diagram.actors.get(this.lastProcessedActor) === "block") {
            this.lastProcessedParent.hideOutline()
            this.renderer.getRenderWindow().render()
            this.lastProcessedActor = null;
            this.lastProcessedParent = null;
        }
        //logic: if currentline -> use hardwareSelector to check if theres a port, if not, destroy line else connect
        if (this.currentLine) {
            const x = event.position.x;
            const y = event.position.y;
            this.lastProcessedParent.decrease()
            const selection = this.hardwareSelector.getSourceDataAsync(this.renderer,x,y,x,y).then((result) => {
                const r = result.generateSelection(x,y,x,y);
                if (r[0]) {
                    this.handleConnect(r[0].getProperties().prop);
                } else {
                    this.destroyLine(this.currentLine);
                }
                this.lastProcessedActor = null;
                this.lastProcessedParent = null;
                this.renderer.getRenderWindow().render()
            });
        }
    }
    
    processSelections(selections, x, y) {
        //resets the color of the last highlighted actor
        if (this.lastPaintedActor) {
           // this.lastPaintedActor.getProperty().setColor(this.lastPaintedActorColor);
           this.diagram.relation.get(this.lastPaintedActor).hideOutline()

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
            this.diagram.relation.get(prop).showOutline()
            this.lastPaintedActor = prop;
        }
        this.renderer.getRenderWindow().render()

    }

    handleConnect(prop){
        if (this.diagram.actors.get(prop) === 'port') {
            const propParent = this.diagram.relation.get(prop);
            if (propParent.type === this.lastProcessedParent.type || propParent.block === this.lastProcessedParent.block) {
                this.destroyLine(this.currentLine);
            } else {
                //handle connection
                const port1 = this.diagram.relation.get(prop)
                const port2 = this.diagram.relation.get(this.lastProcessedActor)
                let outputPort;
                let inputPort;
                if (port1.type === "output") {
                    outputPort = port1;
                    inputPort = port2;
                } else {
                    outputPort = port2;
                    inputPort = port1;
                }
                this.currentLine.drawLine(outputPort.portActor.getPosition(),inputPort.portActor.getPosition());
                this.renderer.getRenderWindow().render();
                this.currentLine.outputPort = outputPort;
                this.currentLine.inputPort = inputPort;
                this.currentLine.multiPrimitiveActor.getProperty().setColor(outputPort.color2)
                port1.connection.push(this.currentLine);
                port2.connection.push(this.currentLine);
                this.diagram.lines.push(this.currentLine);
                this.currentLine = null;
            }
        } else {
            this.destroyLine(this.currentLine);
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