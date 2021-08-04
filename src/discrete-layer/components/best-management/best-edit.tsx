import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { isEmpty, get } from 'lodash';
import { BestRecordModelType, LayerRasterRecordModelType, useStore } from '../../models';
import { DiscreteOrder } from '../../models/DiscreteOrder';
import { BestDiscretesComponent } from './best-discretes';
import { BestDetailsComponent } from './best-details';

interface BestEditComponentProps {
  best?: BestRecordModelType | undefined;
}

export const BestEditComponent: React.FC<BestEditComponentProps> = observer((props) => {
  const { best } = props;
  const store = useStore();
  //@ts-ignore
  const discretesOrder = best?.discretes as DiscreteOrder[];
  const ids = discretesOrder.map((item: DiscreteOrder) => item.id);
  const discretesListRef = useRef();
  const [discretes, setDiscretes] = useState<LayerRasterRecordModelType[]>([]);
  
  useEffect(() => {
    void store.bestStore.getLayersById(ids);
  }, []);

  useEffect(() => {
    if (store.bestStore.layersList) {
      setDiscretes(store.bestStore.layersList);
    }
  }, [store.bestStore.layersList]);

  //  const discretes = store.bestStore.layersList;
//   const discretes = [
//     {
//       id: '6ac605c4-da38-11eb-8d19-0242ac130003',
//       name: `Weizmann Institute of Science (Rehovot, Israel)`,
//       creationDate: new Date('2018-02-13T13:39:55.400Z'),
//       description: '',
//       geojson: {
//         type: 'Polygon',
//         coordinates: [[
//           [34.8076891807199, 31.9042863434239],
//           [34.816135996859, 31.9042863434239],
//           [34.816135996859,31.9118071956932],
//           [34.8076891807199,31.9118071956932],
//           [34.8076891807199,31.9042863434239],
//         ]],
//       },
//       referenceSystem: '',
//       imagingTimeStart: new Date(),
//       imagingTimeEnd: new Date(),
//       type: '',
//       source: '',
//       category: '',
//       thumbnail: '',
//       properties: {
//         protocol: 'XYZ_LAYER',
//         url: 'https://tiles.openaerialmap.org/5a852c072553e6000ce5ac8d/0/7950e2de-5d9e-49aa-adec-6e92384be0b9/{z}/{x}/{y}.png',
//         meta: 'http://oin-hotosm.s3.amazonaws.com/5a852c072553e6000ce5ac8d/0/7950e2de-5d9e-49aa-adec-6e92384be0b9_meta.json'
//       },
//       order: 0,
//     },
//     {
//       id: '7c6dfeb2-da38-11eb-8d19-0242ac130003',
//       name: `Weizmann Institute of Science`,
//       creationDate: new Date('2018-03-06T13:39:55.400Z'),
//       description: '',
//       geojson: {
//         type: 'Polygon',
//         coordinates: [[
//           [34.8099445223518, 31.9061345394902],
//           [34.8200994167574, 31.9061345394902],
//           [34.8200994167574, 31.9106311613979],
//           [34.8099445223518, 31.9106311613979],
//           [34.8099445223518, 31.9061345394902],
//         ]],
//       },
//       referenceSystem: '',
//       imagingTimeStart: new Date(),
//       imagingTimeEnd: new Date(),
//       type: '',
//       source: '',
//       category: '',
//       thumbnail: '',
//       properties: {
//         protocol: 'XYZ_LAYER',
//         url: 'https://tiles.openaerialmap.org/5a9f90c42553e6000ce5ad6c/0/eee1a570-128e-4947-9ffa-1e69c1efab7c/{z}/{x}/{y}.png',
//         meta: 'http://oin-hotosm.s3.amazonaws.com/5a9f90c42553e6000ce5ad6c/0/eee1a570-128e-4947-9ffa-1e69c1efab7c_meta.json'
//       },
//       order: 1,
//     },
// ];
  
  if (!isEmpty(discretesOrder) && !isEmpty(discretes)) {
    discretes?.forEach(discrete => {
      const layer = discretesOrder.find(item => discrete.id === item.id);
      if (layer){
        discrete.order = layer.zOrder;
      }
    });
  }

  return (
    <>
      <BestDetailsComponent best={best}/>
      {/* <MyObserverComponent ref={discretesListRef}></MyObserverComponent> */}
      <BestDiscretesComponent
        //@ts-ignore
        ref={discretesListRef}
        discretes={discretes}
        style={{ height: 'calc(100% - 200px)', width: 'calc(100% - 8px)' }}/>
      <button onClick={() => {
        const kuku = get(discretesListRef,'current');
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if( kuku !== undefined ) {
          //@ts-ignore
          console.log(kuku.getOrderedDiscretes())
        }
      }}>ALEX CLICK</button>
    </>
  );
})