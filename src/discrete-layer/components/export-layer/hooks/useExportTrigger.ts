import { get } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import EnumsMapContext, { IEnumDescriptor, IEnumsMapType } from "../../../../common/contexts/enumsMap.context";
import { RecordType, useStore } from "../../../models";

export interface ExportTriggerParams {
    catalogRecordID: string;
    domain: RecordType;
    parameters: Record<string, unknown>;
}

const EXTERNAL_FIELDS_ID = 0;
const EXTERNAL_FIELDS_IDX = 0;

export const useExportTrigger = (): { setFormValues: (values: Record<string, unknown>) => void } => {
    const { exportStore: { geometrySelectionsCollection, layerToExport } } = useStore();
    const [formValues, setFormValues] = useState<Record<string, unknown>>({});
    const { enumsMap } = useContext(EnumsMapContext);
    const enums = enumsMap as IEnumsMapType;
    const layerRecordType = (get(enums, layerToExport?.productType as string) as IEnumDescriptor | undefined)?.parentDomain as RecordType;

    const exportPayload = useMemo(() => {
        const externalFields = Object.entries(formValues).filter(([key,]) => {
            const [selectionIdx ,, selectionId] = key.split('_'); // selectionIdx_fieldName_selectionId;
            
            return +selectionIdx === EXTERNAL_FIELDS_IDX && +selectionId === EXTERNAL_FIELDS_ID;
        });

        const payload = externalFields.reduce((payloadObj, [key, value]) => {
            const [,fieldName,] = key.split('_');
            return ({
                ...payloadObj,
                parameters: {
                    ...payloadObj.parameters,
                    [fieldName]: value
                }
            })
        }, {
            catalogRecordID: layerToExport?.id,
            domain: layerRecordType,
            parameters: {
                roi: geometrySelectionsCollection
            }
        } as ExportTriggerParams)

        return payload;

    }, [formValues]);

    useEffect(() => {
        console.log(exportPayload);
    }, [exportPayload]);

    return {setFormValues}

}