import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPlaneSource from '@kitware/vtk.js/Filters/Sources/PlaneSource';
import vtkCircleSource from '@kitware/vtk.js/Filters/Sources/CircleSource';
//import { ContextReplacementPlugin } from 'webpack';
import Port from './Port';
import { QueryPorts } from '../../../../common';


class Block {
    constructor(renderer, x, y, ports, color, diagram, id, dbid) {
        console.log(dbid)
        this.diagram = diagram;
        this.ports = [];
        this.id = id;
        this.dbid = dbid;
        if (color === "red") {
            this.color = [0.8, 0.0, 0.0];
        } else if (color === "blue") {
            this.color = [0.0, 0.0, 0.8];
        } else if (color === "green") {
            this.color = [0.0, 0.8, 0.0];
        } else {
            this.color = [0.8, 0.0, 0.0];
        }
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
        this.planeActor.getProperty().setColor(...this.color);
        this.planeMapper.setInputConnection(this.plane.getOutputData);
        this.renderer.addActor(this.planeActor);
        this.diagram.relation.set(this.planeActor, this);
        this.createPorts(ports);
    }

    createPorts(ports) {
        const counts = ports.reduce((acc, port) => {
            acc[port.type]++;
            return acc;
          }, { in: 0, out: 0 });
        console.log(counts);
        let inputSpacing = (1.5+2*0.15)/(counts.in + 1);
        let outputSpacing = (1.5+2*0.15)/(counts.out + 1);
        let ii = 1;
        let io = 1;
        ports.forEach(port => {
            const bpid = (port.id);
            const id = (port.port.id); //placeholder to give "Multi" and "datatype" and so on
            if (port.type === "in") {
                new Port(this.x, this.y+inputSpacing*(ii)-0.15,'input',this, id,bpid)
                ii++;
            } else if (port.type === "out") {
                new Port(this.x+4,this.y+outputSpacing*(io)-0.15,'output',this,id,bpid);
                io++;
            }
        });
    } 
 
    moveBlock(eventX, eventY){
       // console.log("x= " + eventX + ", y= " + eventY)
        const deltaX = eventX - this.prevX;
        const deltaY = eventY - this.prevY;
        this.prevX = eventX;
        this.prevY = eventY;
        this.x = eventX;
        this.y = eventY;
        const pos = this.planeActor.getPosition();
        this.planeActor.setPosition(pos[0] + deltaX, pos[1] + deltaY, 0);
        this.ports.forEach(port => {
            const oCP = port.circleActor.getPosition();
            port.circleActor.setPosition(oCP[0]+deltaX, oCP[1]+deltaY,0);
            if (port.connection) {
                if (port.type === "input") {
                    port.connection.drawLine(port.connection.start, [port.connection.end[0]+deltaX, port.connection.end[1]+deltaY, 0])
                } else {
                    port.connection.drawLine([port.connection.start[0]+deltaX, port.connection.start[1]+deltaY, 0], port.connection.end)
                }
            }
          })
        this.renderer.removeActor(this.planeActor);
        this.renderer.addActor(this.planeActor)
        this.ports.forEach(port => {
            this.renderer.removeActor(port.circleActor)
            this.renderer.addActor(port.circleActor)
        })
    }

}

export default Block;