import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import Port from "./Port";
import vtkPolydata from "@kitware/vtk.js/Common/DataModel/PolyData";
import vtkCellArray from "@kitware/vtk.js/Common/Core/CellArray";
import vtkDataArray from "@kitware/vtk.js/Common/Core/DataArray";
import Text from "./Text";

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
    this.colors = []
    this.renderer = renderer;
    this.polydata = vtkPolydata.newInstance();
    this.shadow = vtkPolydata.newInstance();
    this.mapper = vtkMapper.newInstance();
    this.mapper.setScalarModeToUseCellData();
    this.mapper.setColorModeToDirectScalars();    
    this.planeActor = vtkActor.newInstance({ position: [x, y, 0] });
    this.planeActor.setMapper(this.mapper);
    this.planeActor.setDragable(false)
    this.mapper.setInputData(this.polydata);
    const segments = Math.max(1, ports.filter(obj => obj.type === "in").length, ports.filter(obj => obj.type === "out").length);
    this.text = new Text(x,y,0.25,0.25+((segments-1)*0.8),this.name,0.3)
    this.createPoints(x, y, segments);
    this.shadowMapper = vtkMapper.newInstance();
    this.shadowMapper.setColorModeToDirectScalars()
    this.shadowMapper.setScalarModeToUsePointData()
    this.shadowMapper.setInputData(this.shadow)
    this.shadowActor = vtkActor.newInstance({position: [x,y,0]})
    this.shadowActor.setMapper(this.shadowMapper);
    this.shadowActor.setPickable(false)
    this.renderer.addActor(this.shadowActor)
    this.renderer.addActor(this.planeActor);
    this.diagram.relation.set(this.planeActor, this);
    this.createPorts(ports, segments);
    this.renderer.addActor(this.text.actor)
  }
  createPorts(ports, segments) {
    const counts = ports.reduce(
      (acc, port) => {
        acc[port.type]++;
        return acc;
      },
      { in: 0, out: 0 }
    );
    let inputSpacing = (1.5 + 2 * 0.15) / (counts.in + 1);
    let outputSpacing = (1.5 + 2 * 0.15) / (counts.out + 1);
    let ii = segments -1;
    let io = segments -1;
    ports.forEach((port) => {
      const bpid = port.id;
      const id = port.port.id; //placeholder to give "Multi" and "datatype" and so on
      if (port.type === "in") {
        new Port(
          this.x,
          this.y + 0.4 + (0.8 * ii),
          "input",
          this,
          id,
          bpid,
          this.color
        );
        ii--;
      } else if (port.type === "out") {
        new Port(
          this.x + 5,
          this.y + 0.4 + (0.8 * io),
          "output",
          this,
          id,
          bpid,
          this.color
        );
        io--;
      }
    });
  }
  createPoints(x,y,segments=1) {
    const length = 5;
    const segmentWidth = 0.8;
    const width = segmentWidth*segments;
    const shadowThickness = 0.04
    const outlineThickness = 0.04
    const dividerThickness = 0.02;

    const cornerPoints = [
      { x: x, y: y }, // unten links
      { x: x + length, y: y }, //unten rechts
      { x: x + length, y: y + width }, //obern rechts
      { x: x, y: y + width }, // oben links
    ];
    const cornerPointsShadow = [
        { x: x-shadowThickness, y: y-shadowThickness }, // unten links
        { x: x + length+shadowThickness, y: y-shadowThickness }, //unten rechts
        { x: x + length+shadowThickness, y: y + width }, //obern rechts
        { x: x-shadowThickness, y: y + width }, // oben links
      ];
      const cornerPointsOutline = [
        { x: x+outlineThickness, y: y+outlineThickness }, // unten links
        { x: x + length-outlineThickness, y: y+outlineThickness }, //unten rechts
        { x: x + length-outlineThickness, y: y + width-outlineThickness }, //obern rechts
        { x: x+outlineThickness, y: y + width-outlineThickness }, // oben links
      ];
    const cornerRadius = 0.2;
    const points = [];
    const pointsShadow = [];
    const pointsOutline = [];
    const pointIds = vtkCellArray.newInstance();
    const shadowArray = vtkCellArray.newInstance();
    const shadowPoints = []
    const shadowColors = []

    // Calculate control points for Bezier curve
    const controlPoints = [];
    const controlPointsShadow = [];
    const controlPointsOutline = [];
    for (let i = 0; i < 4; i++) {
      const nextIndex = (i + 1) % 4;
      const prevIndex = (i - 1 + 4) % 4;
      const currentPoint = cornerPoints[i];
      const nextPoint = cornerPoints[nextIndex];
      const prevPoint = cornerPoints[prevIndex];
      const currentPointShadow = cornerPointsShadow[i];
      const nextPointShadow = cornerPointsShadow[nextIndex];
      const prevPointShadow = cornerPointsShadow[prevIndex];
      const currentPointOutline = cornerPointsOutline[i];
      const nextPointOutline = cornerPointsOutline[nextIndex];
      const prevPointOutline = cornerPointsOutline[prevIndex];

      const prevVector = {
        x: currentPoint.x - prevPoint.x,
        y: currentPoint.y - prevPoint.y,
      };
      const prevVectorShadow = {
        x: currentPointShadow.x - prevPointShadow.x,
        y: currentPointShadow.y - prevPointShadow.y,
      };
      const prevVectorOutline = {
        x: currentPointOutline.x - prevPointOutline.x,
        y: currentPointOutline.y - prevPointOutline.y,
      };
      const nextVector = {
        x: nextPoint.x - currentPoint.x,
        y: nextPoint.y - currentPoint.y,
      };
      const nextVectorShadow = {
        x: nextPointShadow.x - currentPointShadow.x,
        y: nextPointShadow.y - currentPointShadow.y,
      };
      const nextVectorOutline = {
        x: nextPointOutline.x - currentPointOutline.x,
        y: nextPointOutline.y - currentPointOutline.y,
      };
      const prevLength = Math.sqrt(
        prevVector.x * prevVector.x + prevVector.y * prevVector.y
      );
      const prevLengthShadow = Math.sqrt(
        prevVectorShadow.x * prevVectorShadow.x + prevVectorShadow.y * prevVectorShadow.y
      );
      const prevLengthOutline = Math.sqrt(
        prevVectorOutline.x * prevVectorOutline.x + prevVectorOutline.y * prevVectorOutline.y
      );
      const nextLength = Math.sqrt(
        nextVector.x * nextVector.x + nextVector.y * nextVector.y
      );
      const nextLengthShadow = Math.sqrt(
        nextVectorShadow.x * nextVectorShadow.x + nextVectorShadow.y * nextVectorShadow.y
      );
      const nextLengthOutline = Math.sqrt(
        nextVectorOutline.x * nextVectorOutline.x + nextVectorOutline.y * nextVectorOutline.y
      );

      const prevControlPoint = {
        x: currentPoint.x - (cornerRadius / prevLength) * prevVector.x,
        y: currentPoint.y - (cornerRadius / prevLength) * prevVector.y,
      };
      const prevControlPointShadow = {
        x: currentPointShadow.x - ((cornerRadius+shadowThickness) / prevLengthShadow) * prevVectorShadow.x,
        y: currentPointShadow.y - ((cornerRadius+shadowThickness) / prevLengthShadow) * prevVectorShadow.y,
      };
      const prevControlPointOutline = {
        x: currentPointOutline.x - ((cornerRadius-outlineThickness) / prevLengthOutline) * prevVectorOutline.x,
        y: currentPointOutline.y - ((cornerRadius-outlineThickness) / prevLengthOutline) * prevVectorOutline.y,
      };

      const nextControlPoint = {
        x: currentPoint.x + ((cornerRadius) / nextLength) * nextVector.x,
        y: currentPoint.y + ((cornerRadius) / nextLength) * nextVector.y,
      };
      const nextControlPointShadow = {
        x: currentPointShadow.x + ((cornerRadius+outlineThickness) / nextLengthShadow) * nextVectorShadow.x,
        y: currentPointShadow.y + ((cornerRadius+outlineThickness) / nextLengthShadow) * nextVectorShadow.y,
      };
      const nextControlPointOutline = {
        x: currentPointOutline.x + ((cornerRadius-outlineThickness) / nextLengthOutline) * nextVectorOutline.x,
        y: currentPointOutline.y + ((cornerRadius-outlineThickness) / nextLengthOutline) * nextVectorOutline.y,
      };

      controlPoints.push({
        prev: prevControlPoint,
        current: currentPoint,
        next: nextControlPoint,
      });
      controlPointsShadow.push({
        prev: prevControlPointShadow,
        current: currentPointShadow,
        next: nextControlPointShadow,
      });
      controlPointsOutline.push({
        prev: prevControlPointOutline,
        current: currentPointOutline,
        next: nextControlPointOutline,
      });
    }
    
    // Interpolate points along Bezier curves
    for (let i = 0; i < 4; i++) {
      const nextIndex = (i + 1) % 4;
      const currentPoint = cornerPoints[i];
      const controlPoint = controlPoints[i];
      const currentPointShadow = cornerPointsShadow[i];
      const controlPointShadow = controlPointsShadow[i];
      const currentPointOutline = cornerPointsOutline[i];
      const controlPointOutline = controlPointsOutline[i];

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
        const xShadow =
          Math.pow(1 - t, 2) * controlPointShadow.prev.x +
          2 * (1 - t) * t * currentPointShadow.x +
          Math.pow(t, 2) * controlPointShadow.next.x;
        const yShadow =
          Math.pow(1 - t, 2) * controlPointShadow.prev.y +
          2 * (1 - t) * t * currentPointShadow.y +
          Math.pow(t, 2) * controlPointShadow.next.y;
        pointsShadow.push({ xShadow, yShadow, z: 0 });
        const xOutline =
          Math.pow(1 - t, 2) * controlPointOutline.prev.x +
          2 * (1 - t) * t * currentPointOutline.x +
          Math.pow(t, 2) * controlPointOutline.next.x;
        const yOutline =
          Math.pow(1 - t, 2) * controlPointOutline.prev.y +
          2 * (1 - t) * t * currentPointOutline.y +
          Math.pow(t, 2) * controlPointOutline.next.y;
          pointsOutline.push({ xOutline, yOutline, z: 0 });
      } 
    }
    const polyPoints = [];
    polyPoints.push(...points.flatMap((obj) => [obj.x, obj.y, obj.z]));
    polyPoints.push(...pointsOutline.flatMap((obj) => [obj.xOutline, obj.yOutline, obj.z]));
    
    const tempPoints = [];
    const tempPointsOutline = [];
    const pointsLength = polyPoints.length / 6; //divided by 3 for coordinates
    for (let i = 0; i < pointsLength; i++) {
        tempPointsOutline.push(i);
        tempPoints.push(i+pointsLength)
    }
    pointIds.insertNextCell(tempPointsOutline)
    pointIds.insertNextCell(tempPoints)
    this.colors.push(1,1,1) //white color to both inside
    if (segments > 1) {
        for (let i = 0; i < segments; i++) {
            polyPoints.push(x,y+(segmentWidth*i)+(dividerThickness/2),0,x+length,y+(segmentWidth*i)+(dividerThickness/2),0)
            polyPoints.push(x,y+(segmentWidth*i)-(dividerThickness/2),0,x+length,y+(segmentWidth*i)-(dividerThickness/2),0)
            const index = polyPoints.length/3
            pointIds.insertNextCell([index,index+1,index+3,index+2])
            this.colors.push(0.8,0.8,0.8)
        }
    }
    this.polydata.getPoints().setData(Float32Array.from(polyPoints), 3);
    this.polydata.setPolys(pointIds)

    const colorDataArray = vtkDataArray.newInstance({
        values: Float32Array.from([1,1,1,...this.colors]), //white outline
        numberOfComponents: 3,
    });
    this.polydata.getCellData().setScalars(colorDataArray);

    pointsShadow.forEach((p, index) => {
        shadowPoints.push(points[index].x,points[index].y,points[index].z,p.xShadow,p.yShadow,p.z);
        shadowColors.push(0,0,0,0.1,0,0,0,0);
        if (index === pointsShadow.length-1) { //if last points, connect it to the first points
            shadowArray.insertNextCell([index*2,index*2+1,1,0])
        } else {
            shadowArray.insertNextCell([index*2,index*2+1,index*2+3,index*2+2])
        }
    })
    this.shadow.getPoints().setData(Float32Array.from(shadowPoints), 3);
    this.shadow.setPolys(shadowArray)
    const shadowScalars = vtkDataArray.newInstance({
        numberOfComponents: 4,
        values: Float32Array.from(shadowColors),
     });
     this.shadow.getPointData().setScalars(shadowScalars)
    
  }
  showOutline(){
    const colorDataArray = vtkDataArray.newInstance({
        values: Float32Array.from([...this.color,...this.colors]), //block color outline + colors
        numberOfComponents: 3,
    });
    this.polydata.getCellData().setScalars(colorDataArray);
    this.polydata.modified()
    this.mapper.setInputData(this.polydata)
  }
  hideOutline(){
    const colorDataArray = vtkDataArray.newInstance({
        values: Float32Array.from([1,1,1,...this.colors]), //white outline + colors
        numberOfComponents: 3,
    });
    this.polydata.getCellData().setScalars(colorDataArray);
    this.polydata.modified()
    this.mapper.setInputData(this.polydata)

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
    this.shadowActor.setPosition(pos[0] + deltaX, pos[1] + deltaY, 0);
    this.text.actor.setPosition(pos[0] + deltaX, pos[1] + deltaY, 0);
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
    /*this.renderer.removeActor(this.planeActor);
    this.renderer.addActor(this.planeActor);
    this.ports.forEach((port) => {
      this.renderer.removeActor(port.circleActor);
      this.renderer.addActor(port.circleActor);
    });*/
  }
}

export default StyledBlock;
