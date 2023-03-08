import { useContext, useEffect, useState } from 'react';
import { Feature } from "geojson";
import { EstimatedSizeModelType, RecordType, useQuery, useStore } from '../../../models';
import EnumsMapContext, { IEnumDescriptor, IEnumsMapType } from '../../../../common/contexts/enumsMap.context';
import { get } from 'lodash';
import { GeojsonFeatureCollectionInput } from '../../../models/RootStore.base';

export const useEstimatedSize = (initSelection: Feature): {
    setSelection: (selection: Feature) => void;
    data: number | null | undefined,
    loading: boolean,
    error?: string,
} => {
    const store = useStore();
    const { exportStore: { layerToExport } } = store;
    const { enumsMap } = useContext(EnumsMapContext);
    const enums = enumsMap as IEnumsMapType;
    const layerRecordType = (get(enums, layerToExport?.productType as string) as IEnumDescriptor | undefined)?.parentDomain as RecordType;
     
    const [selection, setSelection] = useState(initSelection);
    
    const { data, loading, setQuery, query} = useQuery<{ getEstimatedSize: EstimatedSizeModelType}>();


    useEffect(() => {
        const selectionFeatureCollection: GeojsonFeatureCollectionInput = {
            type: 'FeatureCollection',
            features: [{ ...selection, id: `${get(selection.properties, 'id') as string | undefined ?? ''}` }]
        };

        setQuery(
            store.queryGetEstimatedSize({
                data: {
                    type: layerRecordType,
                    selections: selectionFeatureCollection
                }
            })
        );
    }, [selection])

    return {setSelection, data: data?.getEstimatedSize.estimatedSizeInMb, loading , error: get(query?.error, 'response.errors[0].message') as string}
};