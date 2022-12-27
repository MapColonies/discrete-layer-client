import { createContext } from 'react';
import { LookupTablesDataModelType } from '../../discrete-layer/models';

interface ILookupTablesContext {
  lookupTablesData: LookupTablesDataModelType | null;
  setLookupTablesData: (lookupTablesData: LookupTablesDataModelType) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const LookupContext = createContext<ILookupTablesContext>({
  lookupTablesData: null,
  setLookupTablesData: () => { return }
});

export default LookupContext;