import React from 'react';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash';
import { Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../common/models/mode.enum';
import { BestRecordModelType } from '../../models';
import { BestRecordModelKeys } from '../layer-details/layer-details.field-info';

const DEFAULT_ID = 'DEFAULT_ID';

interface BestDetailsComponentProps {
  best?: BestRecordModelType | null;
}

export const BestDetailsComponent: React.FC<BestDetailsComponentProps> = observer((props: BestDetailsComponentProps) => {
  const { best } = props;

  const buildRecord = (): BestRecordModelType => {
    const record = {} as Record<string, any>;
    BestRecordModelKeys.forEach(key => {
      record[key as string] = undefined;
    });
    record.id = DEFAULT_ID;
    return record as BestRecordModelType;
  };

  let mode = Mode.EDIT;
  if (best === undefined){
    mode = Mode.NEW;
    // best = buildRecord();
  }

  return (
    <>
      {
        BestRecordModelKeys.map((key) => {
          let value = get(best, key);
          if (value && typeof value !== 'boolean') {
            return (
              <Box key={key.toString()} className="categoryFullWidthField">
                <Box className="detailsFieldLabel">{key}:</Box>
                <Typography use="body2" tag="div">{best?.[key] ? best[key] : ''}</Typography>
              </Box>
            );
          }
        })
      }
    </>
  )
});