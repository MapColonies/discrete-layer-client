import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useStore } from '../../../models/RootStore';
import { McEnumsModelType } from '../../../models';

export const MCEnumsFetcher: React.FC = observer(() => {
  const store = useStore();
  const mcEnumsQuery = useQuery((store) => store.queryGetMcEnums());
  
  useEffect(() => {
    if (!mcEnumsQuery.loading) {
      const enums = mcEnumsQuery.data?.getMcEnums;
      store.discreteLayersStore.setMCENums((enums as McEnumsModelType).enums);
    }
  }, [mcEnumsQuery.data, mcEnumsQuery.loading, store.discreteLayersStore]);
  
  return (
    <></>
  );
});
