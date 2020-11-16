import { ILayerImage } from "../discrete-layer/models/layerImage";

export const createMockData = (count: number, prefix: string): ILayerImage[] => {
  const rowData: ILayerImage[] = [];
  for (let i = 0; i < count; i++) {
    rowData.push({
      id: i.toString(),
      name: `${prefix}  ("name",${i})`,
      creationDate: new Date(),
      description: '',
      geojson: {
        type: 'Polygon',
        coordinates: [[[]]],
      },
      referenceSystem: '',
      imagingTimeStart: new Date(),
      imagingTimeEnd: new Date(),
      type: '',
      source: '',
      category: '',
      thumbnail: '',
    });
  }
  return rowData;
};
