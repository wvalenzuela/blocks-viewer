import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPlaneSource from '@kitware/vtk.js/Filters/Sources/PlaneSource';
import vtkCircleSource from '@kitware/vtk.js/Filters/Sources/CircleSource';
//import { ContextReplacementPlugin } from 'webpack';
import Port from './Port';


class Block {
    constructor(renderer, x, y, inputs, outputs, color) {
        this.ports = [];
        this.color = color;
        this.x = x;
        this.y = y;
        this.prevX = null;
        this.prevY = null;
        this.renderer = renderer;
        this.plane = vtkPlaneSource.newInstance({ xResolution: 1, yResolution: 1 });
        this.plane.setOrigin(0, 0, 0);

        this.plane.setPoint1(4.0, 0, 0); 
        this.plane.setPoint2(0, 1.5, 0);

        this.planeMapper = vtkMapper.newInstance();
        this.planeActor = vtkActor.newInstance({ position: [x, y, 0]});
        this.planeActor.setMapper(this.planeMapper);
        this.planeActor.getProperty().setEdgeVisibility(true);
        this.planeActor.getProperty().setColor(...color);
        this.planeMapper.setInputConnection(this.plane.getOutputData);
        this.renderer.addActor(this.planeActor);

        this.createPorts(inputs, outputs);
    }

    createPorts(inputs, outputs) {
        //var spacing = ((1.5-(num*0.15*2))/(num+1))+0.15//1.5/(num+1); 
        let inputSpacing = (1.5+2*0.15)/(inputs.length + 1);
        let outputSpacing = (1.5+2*0.15)/(outputs.length + 1);
        let i = 1;
        inputs.forEach(element => {
            //this.createCircle(inputSpacing*(i)-r, 0);
            new Port(this.x, this.y+inputSpacing*(i)-0.15,'input',this)
            i++;
        });
        let j = 1;
        outputs.forEach(element => {
            //this.createCircle(outputSpacing*(j)-r, 4);
            new Port(this.x+4,this.y+outputSpacing*(j)-0.15,'output',this);
            j++;
        });
    } 
 
    moveBlock(eventX, eventY){
       // console.log("x= " + eventX + ", y= " + eventY)
        const deltaX = eventX - this.prevX;
        const deltaY = eventY - this.prevY;
        this.prevX = eventX;
        this.prevY = eventY;
        const pos = this.planeActor.getPosition();
        this.planeActor.setPosition(pos[0] + deltaX, pos[1] + deltaY, 0);
        this.ports.forEach(circle => {
            const oCP = circle.getPosition();
            circle.setPosition(oCP[0]+deltaX, oCP[1]+deltaY,0);
          })
        this.renderer.removeActor(this.planeActor);
        this.renderer.addActor(this.planeActor)
        this.ports.forEach(circle => {
            this.renderer.removeActor(circle)
            this.renderer.addActor(circle)
        })
    }

}

export default Block;