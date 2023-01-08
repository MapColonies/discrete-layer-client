import { observer } from 'mobx-react';
import React, { useContext, useEffect } from 'react';
import lookupTablesContext, { ILookupTableData } from '../../../../common/contexts/lookupTables.context';
import { useQuery, useStore } from '../../../models/RootStore';

export const LookupTablesFetcher: React.FC = observer(() => {
  const store = useStore();
  const { data, loading } = useQuery((store) => store.queryGetLookupTablesData({}, `dictionary`));

  const { setLookupTablesData } = useContext(lookupTablesContext);

  useEffect(() => {
    if (!loading) {
      setLookupTablesData(data?.getLookupTablesData as ILookupTableData);
    }
  }, [data, loading, store.discreteLayersStore]);

  return (
    <></>
  );
});
