import { forwardRef, useImperativeHandle, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { ITooltipParams } from 'ag-grid-community';
import { Typography } from '@map-colonies/react-core';
import { LayerRecordTypes } from '../../../../discrete-layer/components/layer-details/entity-types-keys';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { dateFormatter } from '../../../helpers/formatters';

import './name.tooltip-renderer.css';

export default forwardRef((props: ITooltipParams, ref) => {
  const [data] = useState<ILayerImage>(props.api.getDisplayedRowAtIndex(props.rowIndex).data);
  const [layerRecordTypename] = useState(data.__typename);
  const [color] = useState<string>(get(props, 'color', 'white'));
  const [infoTooltipMap] = useState<Map<LayerRecordTypes, string[]>>(get(props, 'infoTooltipMap'));

  useImperativeHandle(ref, () => {
    return {
      // eslint-disable-next-line
      getReactContainerClasses() {
        return ['layers-result-custom-tooltip'];
      },
    };
  });

  const isDate = (value: string): boolean => {
    const regex = /date/i;
    return regex.test(value);
  };

  const isValidDate = (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  return (
    <div className="layers-result-custom-tooltip" style={{ backgroundColor: color }}>
      <>
      {
        infoTooltipMap?.get(layerRecordTypename)?.map((item: string, index: number) => {
          const value = `${get(data,item)}`;
          return (
            <Typography tag="p" key={`${item}${index}`}>
              <Typography tag="span"><FormattedMessage id={`field-names.raster.${item}`} />: </Typography>{isDate(item) && isValidDate(value) ? dateFormatter(value) : value}
            </Typography>
          );
        })
      }
      </>
    </div>
  );
});