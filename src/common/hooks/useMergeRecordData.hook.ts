import { IMaybe, IStateTreeNode, IType } from "mobx-state-tree";
import { LayersImagesResponse } from "../../discrete-layer/models/discreteLayersStore";
import _ from "lodash";

type LayerImages = (LayersImagesResponse & IStateTreeNode<IMaybe<IType<LayersImagesResponse | null | undefined, LayersImagesResponse, LayersImagesResponse>>>) | undefined;

export const useMergeRecordData = (partialRecordData: any[], layersImages: LayerImages) => {
	if (_.isEmpty(layersImages)) {
		return partialRecordData === undefined ? [] : partialRecordData;
	} else if (!_.isEmpty(partialRecordData)) {
		let mergedData: any[] = [];
		partialRecordData.map((partialData: {footprint: any, id: string, _typename: string}) =>
			layersImages?.map((data) => {
				if (partialData.id === data.id) {
					mergedData.push({ ...data, footprint: partialData.footprint })
				}
			}
			)
		);
		// console.log('mergedData: ', mergedData)
		return mergedData;
	}

};
