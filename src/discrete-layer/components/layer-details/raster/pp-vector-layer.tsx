
import { useEffect, useState } from 'react';
import { BBox, Feature } from 'geojson';
import { MapEvent } from 'ol';
import bboxPolygon from '@turf/bbox-polygon';
import squareGrid from '@turf/square-grid';
import { GeoJSONFeature, useMap, VectorLayer, VectorSource } from '@map-colonies/react-components';
import { useStore } from '../../../models/RootStore';
import { Fill, Stroke, Style, Text } from 'ol/style';

interface PolygonPartsVectorLayerProps {
  
}



export const PolygonPartsVectorLayer: React.FC<PolygonPartsVectorLayerProps> = ({
  
}) => {
  const store = useStore();
  const mapOl = useMap();

  const [existingPolygoParts, setExistingPolygoParts] = useState<Feature[]>([]);
  
  useEffect(() => {
    const handleMoveEndEvent = (e: MapEvent): void => {
      getExistingPolygoParts(mapOl.getView().calculateExtent() as BBox);
      
      console.log(mapOl.getView().calculateExtent(), bboxPolygon(mapOl.getView().calculateExtent() as BBox))
    };

    mapOl.on('moveend', handleMoveEndEvent);

    return (): void => {
      try {
        mapOl.un('moveend', handleMoveEndEvent);
      } catch (e) {
        console.log('OL "moveEnd" remove listener failed', e);
      }
    };
  },[]);
  
  const getExistingPolygoParts = (bbox: BBox) => {
    const fakePP = squareGrid(bbox, 10, {units: 'miles'});
    console.log(fakePP);
    setExistingPolygoParts(fakePP.features);
  };

  // Inspired by https://openlayers.org/en/latest/examples/vector-labels.html
  const featureLabelConfig = {
    // points: {
    //   text: document.getElementById('points-text'),
    //   align: document.getElementById('points-align'),
    //   baseline: document.getElementById('points-baseline'),
    //   rotation: document.getElementById('points-rotation'),
    //   font: document.getElementById('points-font'),
    //   weight: document.getElementById('points-weight'),
    //   size: document.getElementById('points-size'),
    //   height: document.getElementById('points-height'),
    //   offsetX: document.getElementById('points-offset-x'),
    //   offsetY: document.getElementById('points-offset-y'),
    //   color: document.getElementById('points-color'),
    //   outline: document.getElementById('points-outline'),
    //   outlineWidth: document.getElementById('points-outline-width'),
    //   maxreso: document.getElementById('points-maxreso'),
    // },
    // lines: {
    //   text: document.getElementById('lines-text'),
    //   align: document.getElementById('lines-align'),
    //   baseline: document.getElementById('lines-baseline'),
    //   rotation: document.getElementById('lines-rotation'),
    //   font: document.getElementById('lines-font'),
    //   weight: document.getElementById('lines-weight'),
    //   placement: document.getElementById('lines-placement'),
    //   maxangle: document.getElementById('lines-maxangle'),
    //   overflow: document.getElementById('lines-overflow'),
    //   size: document.getElementById('lines-size'),
    //   height: document.getElementById('lines-height'),
    //   offsetX: document.getElementById('lines-offset-x'),
    //   offsetY: document.getElementById('lines-offset-y'),
    //   color: document.getElementById('lines-color'),
    //   outline: document.getElementById('lines-outline'),
    //   outlineWidth: document.getElementById('lines-outline-width'),
    //   maxreso: document.getElementById('lines-maxreso'),
    // },
    polygons: {
      text: 'normal',
      align: 'center',
      baseline: 'middle',
      rotation: '0',
      font: 'Roboto',
      weight: 'bold',
      placement: 'point',
      maxangle: '0.7853981633974483',
      overflow: 'false',
      size: '10px',
      height: '1',
      offsetX: '0',
      offsetY: '0',
      color: '#00ff00',
      // outline: '#ffffff',
      outlineWidth: '3',
      maxreso: '1200',
    },
  };
  
  function stringDivider(str:string, width:number, spaceReplacer: string):string {
    if (str.length > width) {
      let p = width;
      while (p > 0 && str[p] != ' ' && str[p] != '-') {
        p--;
      }
      if (p > 0) {
        let left;
        if (str.substring(p, p + 1) == '-') {
          left = str.substring(0, p + 1);
        } else {
          left = str.substring(0, p);
        }
        const right = str.substring(p + 1);
        return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
      }
    }
    return str;
  }

  const getText = function (feature, resolution, dom) {
    const type = dom.text;
    const maxResolution = dom.maxreso;
    let text = '14 21/04/2023'; //feature.get('name');
  
    if (resolution > maxResolution) {
      text = '';
    } else if (type == 'hide') {
      text = '';
    } else if (type == 'shorten') {
      text = text.substring(12); //text.trunc(12);
    } else if (
      type == 'wrap' &&
      (!dom.placement || dom.placement != 'line')
    ) {
      text = stringDivider(text, 16, '\n');
    }
  
    return text;
  };

  const createTextStyle = function (feature, resolution, dom) {
    const align = dom.align;
    const baseline = dom.baseline;
    const size = dom.size;
    const height = dom.height;
    const offsetX = parseInt(dom.offsetX, 10);
    const offsetY = parseInt(dom.offsetY, 10);
    const weight = dom.weight;
    const placement = dom.placement ? dom.placement : undefined;
    const maxAngle = dom.maxangle ? parseFloat(dom.maxangle) : undefined;
    const overflow = dom.overflow ? dom.overflow == 'true' : undefined;
    const rotation = parseFloat(dom.rotation);
    // if (dom.font == "'Open Sans'" && !openSansAdded) {
    //   const openSans = document.createElement('link');
    //   openSans.href = 'https://fonts.googleapis.com/css?family=Open+Sans';
    //   openSans.rel = 'stylesheet';
    //   document.head.appendChild(openSans);
    //   openSansAdded = true;
    // }
    const font = weight + ' ' + size + '/' + height + ' ' + dom.font;
    const fillColor = dom.color;
    const outlineColor = dom.outline;
    const outlineWidth = parseInt(dom.outlineWidth, 10);
    console.log({
      textAlign: align == '' ? undefined : align,
      textBaseline: baseline,
      font: font,
      text: getText(feature, resolution, dom),
      fill: new Fill({color: fillColor}),
      stroke: new Stroke({color: outlineColor, width: outlineWidth}),
      offsetX: offsetX,
      offsetY: offsetY,
      placement: placement,
      maxAngle: maxAngle,
      overflow: overflow,
      rotation: rotation,
    });
    return new Text({
      textAlign: align == '' ? undefined : align,
      textBaseline: baseline,
      font: font,
      text: getText(feature, resolution, dom),
      fill: new Fill({color: fillColor}),
      stroke: new Stroke({color: outlineColor, width: outlineWidth}),
      offsetX: offsetX,
      offsetY: offsetY,
      placement: placement,
      maxAngle: maxAngle,
      overflow: overflow,
      rotation: rotation,
    });
    // return new Text({
    //   font: "bold 10px/1 Roboto",
    //   "rotation": 0,
    //   "text": "Parc de la Colline",
    //   "textBaseline": "middle",
    //   "fill": new Fill({color: '#0000ff'}),
    //   "maxAngle": 0.7853981633974483,
    //   "placement": "point",
    //   "overflow": false,
    //   "stroke": new Stroke({color: "#ffffff", width: 3}),
    //   "offsetX": 0,
    //   "offsetY": 0,
    // });
  };

  return (
    <VectorLayer>
      <VectorSource>
        {existingPolygoParts.map((feat, idx) => {
            const greenStyle = new Style({
              text: createTextStyle(feat, 4, featureLabelConfig.polygons),
              stroke: new Stroke({
                width: 2,
                color: "#00ff00"
              }),
              // fill: new Fill({
              //   color: "#aa2727"
              // })
            });

            return feat ? <GeoJSONFeature 
              geometry={{...feat.geometry}} 
              fit={false}
              featureStyle={greenStyle}
            /> : <></>
          }
        )}
      </VectorSource>
    </VectorLayer>
  );
}