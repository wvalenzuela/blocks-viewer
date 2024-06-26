import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPolydata from '@kitware/vtk.js/Common/DataModel/PolyData';

/**
* <draws a line between given points the cornes are rounded >
* @method drawLine - draws a line between two points
* @method calculateRoundedLinePoints - calculates the points for the rounded corners
* @param renderer current renderer
* @param color color of the line
*/
class PolyLine{
    constructor(renderer,color) {
        this.color = color
        this.renderer = renderer;
        this.inputPort = null;
        this.outputPort = null;
        this.start = null;
        this.end = null;
        this.multiPrimitiveData = vtkPolydata.newInstance();
        this.multiPrimitiveMapper = vtkMapper.newInstance();
        this.multiPrimitiveActor = vtkActor.newInstance();
        this.multiPrimitiveActor.getProperty().setColor(...this.color);
        this.multiPrimitiveActor.getProperty().setLineWidth(3);//width of the line
        this.multiPrimitiveMapper.setInputData(this.multiPrimitiveData);
        this.multiPrimitiveActor.setMapper(this.multiPrimitiveMapper);
        this.renderer.addActor(this.multiPrimitiveActor);
    }

    /**
     * <draws a runded (if corners) line between start --> p1 --> p2 -->pn --> end>
     * @param start start point of the line
     * @param end end point of the line
     */
    drawLine(start, end){
        this.start = start;
        this.end = end;
        const p1 = start;
        const temp = (start[0]+end[0])/2
        const p2 = [temp,start[1]];
        const p3 = [temp, end[1]];
        const p4 = end;
        const pointsArray = [
            { x: p1[0], y: p1[1] },
            { x: p2[0], y: p2[1] },
            { x: p3[0], y: p3[1] },
            { x: p4[0], y: p4[1] },
          ];
        const roundedLinePoints = this.calculateRoundedLinePoints(pointsArray)
        const multiPrimitiveData = vtkPolydata.newInstance();//makes 3 points to one coordinate

        multiPrimitiveData.getPoints().setData(Float32Array.from(roundedLinePoints),3)
        multiPrimitiveData
        .getLines()
        .setData(Uint16Array.from([roundedLinePoints.length / 3, ...Array.from({ length: roundedLinePoints.length / 3 }, (_, i) => i)]));
        this.multiPrimitiveMapper.setInputData(multiPrimitiveData);
      }


      /**
     * <Creates points that the corners of the line are rounded>
     * @param pointsArray point of the line without rounded corners
     */
    calculateRoundedLinePoints(pointsArray) {
        const points = [];
        const controlPoints = [];
        const cornerRadius = 0.1;
      
        // Calculate control points for Bezier curves for all points except the first and last
        for (let i = 1; i < pointsArray.length - 1; i++) {
          const prevIndex = i - 1;
          const nextIndex = i + 1;
          const currentPoint = pointsArray[i];
          const nextPoint = pointsArray[nextIndex];
          const prevPoint = pointsArray[prevIndex];
      
          const prevVector = { x: currentPoint.x - prevPoint.x, y: currentPoint.y - prevPoint.y };
          const nextVector = { x: nextPoint.x - currentPoint.x, y: nextPoint.y - currentPoint.y };
      
          const prevLength = Math.sqrt(prevVector.x * prevVector.x + prevVector.y * prevVector.y);
          const nextLength = Math.sqrt(nextVector.x * nextVector.x + nextVector.y * nextVector.y);
      
          const prevControlPoint = {
            x: currentPoint.x - (cornerRadius / prevLength) * prevVector.x,
            y: currentPoint.y - (cornerRadius / prevLength) * prevVector.y
          };
      
          const nextControlPoint = {
            x: currentPoint.x + (cornerRadius / nextLength) * nextVector.x,
            y: currentPoint.y + (cornerRadius / nextLength) * nextVector.y
          };
      
          controlPoints.push({ prev: prevControlPoint, current: currentPoint, next: nextControlPoint });
        }
      
        // Interpolate points along Bezier curves for all points except the first and last
        for (let i = 0; i < pointsArray.length; i++) {
          if (i === 0 || i === pointsArray.length - 1) {
            // For the first and last point, push directly without interpolation
            points.push({ x: pointsArray[i].x, y: pointsArray[i].y, z: 0 });
            continue;
          }
          const nextIndex = i + 1;
          const currentPoint = pointsArray[i];
          const nextPoint = pointsArray[nextIndex];
          const controlPoint = controlPoints[i - 1];
      
          for (let t = 0; t <= 1; t += 0.1) {
            const x = Math.pow(1 - t, 2) * controlPoint.prev.x + 2 * (1 - t) * t * currentPoint.x + Math.pow(t, 2) * controlPoint.next.x;
            const y = Math.pow(1 - t, 2) * controlPoint.prev.y + 2 * (1 - t) * t * currentPoint.y + Math.pow(t, 2) * controlPoint.next.y;
            points.push({ x, y, z: 0 });
          }
        }
      
        // Remap points for polydata
        const pointsRemapped = points.flatMap(obj => [obj.x, obj.y, obj.z]);
        return pointsRemapped;
      }
}

export default PolyLine;