import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkPlaneSource from "@kitware/vtk.js/Filters/Sources/PlaneSource";
import vtkCircleSource from "@kitware/vtk.js/Filters/Sources/CircleSource";
//import { ContextReplacementPlugin } from 'webpack';
import Port from "./Port";
import { QueryPorts } from "../../../../common";
import vtkPolydata from "@kitware/vtk.js/Common/DataModel/PolyData";
import vtkCellArray from "@kitware/vtk.js/Common/Core/CellArray";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkDataArray from "@kitware/vtk.js/Common/Core/DataArray";

class StyledBlock {
  constructor(renderer, x, y, ports, color, diagram, id, dbid, name) {
    this.name = name;
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
    this.polydata = vtkPolydata.newInstance();
    this.points = []
    this.temp = []
    this.pointIds = vtkCellArray.newInstance();
    this.createPoints(x, y);
    this.polydata.getPoints().setData(Float32Array.from(this.points), 3);
    //this.polydata
      //.getPolys()
      //.setData(Uint32Array.from([this.pointIds.length, ...this.pointIds]));
    this.polydata.setPolys(this.pointIds)
    this.mapper = vtkMapper.newInstance();
    this.mapper.setScalarModeToUseCellData();
    this.mapper.setColorModeToMapScalars()
    this.mapper.setScalarRange(0,256);
    this.lut = vtkColorTransferFunction.newInstance();
    for (let i = 0; i < 256; i++) {
        const c = 1-i/255
        this.lut.addRGBPoint(i, c,c,c,1)
    }
    this.mapper.setLookupTable(this.lut)
    this.planeActor = vtkActor.newInstance({ position: [x, y, 0] });
    this.planeActor.setMapper(this.mapper);
    this.mapper.setInputData(this.polydata);
    this.outline = vtkPolydata.newInstance();
    this.outline.getPoints().setData(Float32Array.from(this.points), 3);
    this.outline
    .getLines()
    .setData(Uint16Array.from([this.temp.length+1, ...this.temp, 0]));
    this.outlineMapper = vtkMapper.newInstance();
    this.outlineMapper.setInputData(this.outline);
    this.outlineActor = vtkActor.newInstance({ position: [x, y, 0] });
    this.outlineActor.setMapper(this.outlineMapper)
    this.outlineActor.getProperty().setColor(...this.color);
    this.outlineActor.getProperty().setLineWidth(3);
    this.renderer.addActor(this.planeActor);
    this.renderer.addActor(this.outlineActor);
    this.outlineActor.setVisibility(false);
    this.diagram.relation.set(this.planeActor, this);
    this.createPorts(ports);
  }
  createPoints(x,y) {
    const lenght = 4;
    const width = 1.5;

    const cornerPoints = [
      { x: x, y: y }, // unten links
      { x: x + lenght, y: y }, //unten rechts
      { x: x + lenght, y: y + width }, //obern rechts
      { x: x, y: y + width }, // oben links
    ];
    const cornerRadius = 0.2;
    const points = [];

    // Calculate control points for Bezier curve
    const controlPoints = [];
    for (let i = 0; i < 4; i++) {
      const nextIndex = (i + 1) % 4;
      const prevIndex = (i - 1 + 4) % 4;
      const currentPoint = cornerPoints[i];
      const nextPoint = cornerPoints[nextIndex];
      const prevPoint = cornerPoints[prevIndex];

      const prevVector = {
        x: currentPoint.x - prevPoint.x,
        y: currentPoint.y - prevPoint.y,
      };
      const nextVector = {
        x: nextPoint.x - currentPoint.x,
        y: nextPoint.y - currentPoint.y,
      };

      const prevLength = Math.sqrt(
        prevVector.x * prevVector.x + prevVector.y * prevVector.y
      );
      const nextLength = Math.sqrt(
        nextVector.x * nextVector.x + nextVector.y * nextVector.y
      );

      const prevControlPoint = {
        x: currentPoint.x - (cornerRadius / prevLength) * prevVector.x,
        y: currentPoint.y - (cornerRadius / prevLength) * prevVector.y,
      };

      const nextControlPoint = {
        x: currentPoint.x + (cornerRadius / nextLength) * nextVector.x,
        y: currentPoint.y + (cornerRadius / nextLength) * nextVector.y,
      };

      controlPoints.push({
        prev: prevControlPoint,
        current: currentPoint,
        next: nextControlPoint,
      });
    }

    // Interpolate points along Bezier curves
    for (let i = 0; i < 4; i++) {
      const nextIndex = (i + 1) % 4;
      const currentPoint = cornerPoints[i];
      const nextPoint = cornerPoints[nextIndex];
      const controlPoint = controlPoints[i];

      for (let t = 0; t <= 1; t += 0.1) {
        const x =
          Math.pow(1 - t, 2) * controlPoint.prev.x +
          2 * (1 - t) * t * currentPoint.x +
          Math.pow(t, 2) * controlPoint.next.x;
        const y =
          Math.pow(1 - t, 2) * controlPoint.prev.y +
          2 * (1 - t) * t * currentPoint.y +
          Math.pow(t, 2) * controlPoint.next.y;
        points.push({ x, y, z: 0 });
      }
    }

    //remap points for polydata
    this.points = points.flatMap((obj) => [obj.x, obj.y, obj.z]);
    console.log(this.points.length)
    for (let i = 0; i < this.points.length / 3; i++) {
        //3 element == one point
        //this.pointIds.push(i);
        //this.cellArray.insertNextCell([i, i+1,i+2,i+3])
        this.temp.push(i);
      }

    //create text
    // Create a canvas element
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');

    // Set font properties
    const fontSize = 128;
    const fontFamily = 'Segoe UI';
    const fontStyle = 'normal';
    const fontWeight = 'normal';
    textCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // Measure text dimensions
    const textMetrics = textCtx.measureText(this.name);
    const textWidth = Math.ceil(textMetrics.width);
    const textHeight = fontSize; // approximate height

    // Resize canvas to fit text
    textCanvas.width = textWidth;
    textCanvas.height = textHeight;

    // Clear canvas
    textCtx.clearRect(0, 0, textWidth, textHeight);

    // Set text properties
    textCtx.fillStyle = 'white';
    textCtx.textBaseline = 'top';
    textCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // Draw text
    textCtx.fillText(this.name, 0, 0);

    // Convert canvas to ImageData
    const imageData = textCtx.getImageData(0, 0, textWidth, textHeight);

    this.pointIds.insertNextCell(this.temp)

    const scalars = [];
    scalars.push(0)

    let cellIndex = this.temp.length;
    for (let y = 0; y < textHeight; y++) {
        for (let x = 0; x < textWidth; x++) {
            const idx = (y * textWidth + x) * 4; // RGBA
            const alpha = imageData.data[idx + 3];
            if (alpha > 0) {
                this.pointIds.insertNextCell([cellIndex, cellIndex+1,cellIndex+2,cellIndex+3])
                scalars.push(alpha)
                const scale = (0.5/textHeight)
                const xx = this.x + 0.2 + (x*scale)//128, 1.5, 1, 128->0.5
                const yy = this.y + 0.8 + ((textHeight-y)*scale)
                this.points.push(xx, yy, 0, xx+scale, yy,0,xx+scale,yy+scale,0,xx,yy+scale,0)
                cellIndex = cellIndex + 4;
            }
        }
    }

    const colorDataArray = vtkDataArray.newInstance({
         values: Float32Array.from(scalars),
    });
    this.polydata.getCellData().setScalars(colorDataArray);




    //return pointsRemapped;
  }

  createPorts(ports) {
    const counts = ports.reduce(
      (acc, port) => {
        acc[port.type]++;
        return acc;
      },
      { in: 0, out: 0 }
    );
    console.log(counts);
    let inputSpacing = (1.5 + 2 * 0.15) / (counts.in + 1);
    let outputSpacing = (1.5 + 2 * 0.15) / (counts.out + 1);
    let ii = 1;
    let io = 1;
    ports.forEach((port) => {
      const bpid = port.id;
      const id = port.port.id; //placeholder to give "Multi" and "datatype" and so on
      if (port.type === "in") {
        new Port(
          this.x,
          this.y + inputSpacing * ii - 0.15,
          "input",
          this,
          id,
          bpid
        );
        ii++;
      } else if (port.type === "out") {
        new Port(
          this.x + 4,
          this.y + outputSpacing * io - 0.15,
          "output",
          this,
          id,
          bpid
        );
        io++;
      }
    });
  }

  moveBlock(eventX, eventY) {
    // console.log("x= " + eventX + ", y= " + eventY)
    const deltaX = eventX - this.prevX;
    const deltaY = eventY - this.prevY;
    this.prevX = eventX;
    this.prevY = eventY;
    this.x = eventX;
    this.y = eventY;
    const pos = this.planeActor.getPosition();
    this.planeActor.setPosition(pos[0] + deltaX, pos[1] + deltaY, 0);
    this.outlineActor.setPosition(pos[0] + deltaX, pos[1] + deltaY, 0);
    this.ports.forEach((port) => {
      const oCP = port.circleActor.getPosition();
      port.circleActor.setPosition(oCP[0] + deltaX, oCP[1] + deltaY, 0);
      if (port.connection.length !== 0) {
        port.connection.forEach((line) => {
          if (port.type === "input") {
            line.drawLine(line.start, [
              line.end[0] + deltaX,
              line.end[1] + deltaY,
              0,
            ]);
          } else {
            line.drawLine(
              [line.start[0] + deltaX, line.start[1] + deltaY, 0],
              line.end
            );
          }
        });
      }
    });
    this.renderer.removeActor(this.planeActor);
    this.renderer.addActor(this.planeActor);
    this.ports.forEach((port) => {
      this.renderer.removeActor(port.circleActor);
      this.renderer.addActor(port.circleActor);
    });
  }
}

export default StyledBlock;
