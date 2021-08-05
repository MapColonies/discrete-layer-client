import React from 'react';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { BestRecordModelType } from '../../models';
import { BestRecordModelKeys } from '../layer-details/layer-details.field-info';

import './best-details.css';

// const DEFAULT_ID = 'DEFAULT_ID';

interface BestDetailsComponentProps {
  best?: BestRecordModelType | null;
}

export const BestDetailsComponent: React.FC<BestDetailsComponentProps> = observer((props: BestDetailsComponentProps) => {
  const { best } = props;

  // const buildRecord = (): BestRecordModelType => {
  //   const record = {} as Record<string, any>;
  //   BestRecordModelKeys.forEach(key => {
  //     record[key as string] = undefined;
  //   });
  //   record.id = DEFAULT_ID;
  //   return record as BestRecordModelType;
  // };

  let mode = Mode.EDIT;
  if (best === undefined){
    mode = Mode.NEW;
    // best = buildRecord();
  }

  return (
    <Box className="bestDetails">
      {
        BestRecordModelKeys.map(key => {
          const value = get(best, key) as unknown;
          if (value !== undefined && typeof value !== 'boolean' && typeof value !== 'object') {
            return (
              <Box key={key.toString()} className="categoryFullWidthField">
                <Box className="detailsFieldLabel">{key}:</Box>
                <Typography use="body2" tag="div">{value}</Typography>
              </Box>
            );
          }
        })
      }
    </Box>
  );
});