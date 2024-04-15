import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballZoomToMouseManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomToMouseManipulator';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkGestureCameraManipulator from '@kitware/vtk.js/Interaction/Manipulators/GestureCameraManipulator';
import { throttle } from '@kitware/vtk.js/macros';
import { FieldAssociations } from '@kitware/vtk.js/Common/DataModel/DataSet/Constants';
import vtkPicker from '@kitware/vtk.js/Rendering/Core/Picker';
import Line from './Line';


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
        this.currentLine = new Line(this.renderer, this.output);
        return this.currentLine;
    }
    destroyLine(line) {
        this.renderer.removeActor(line.lineActor);
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
                 //handle port interaction - tbd
                this.disablePan();
                this.createLine(this.renderer, this.lastProcessedActor);
                return;
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
      //  if (this.currentLine && this.diagram.actors.get(this.lastProcessedActor) == 'port') {
        if (false) {
            if (this.lastProcessedActor == this.currentLine.lineActor) {
                this.destroyLine(this.currentLine);
                return;
            } else {
                this.currentLine.drawLine(this.currentLine.output.getPosition(), this.lastProcessedActor.getPosition());
                return;
            }
        } else if (this.currentLine) {
            this.destroyLine(this.currentLine);
        }
    }
    
    processSelections(selections, x, y) {
        //resets the color of the last highlighted actor
        if (this.lastPaintedActor) {
            this.lastPaintedActor.getProperty().setColor(this.lastPaintedActorColor);
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
        if (this.lastPaintedActor != prop) {
            this.lastPaintedActorColor = prop.getProperty().getColor();
        }
        prop.getProperty().setColor(...GREEN);
        this.lastPaintedActor = prop;
        this.renderer.getRenderWindow().render()

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