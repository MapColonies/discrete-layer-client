import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { get } from 'lodash';
import { ITooltipParams } from 'ag-grid-community';
import './name.tooltip-renderer.css'
import { ILayerImage } from '../../../models/layerImage';

export default forwardRef((props: ITooltipParams, ref) => {
  // eslint-disable-next-line 
  const [data, setData] = useState<ILayerImage>(props.api.getDisplayedRowAtIndex(props.rowIndex).data);
  const color = get(props, 'color', 'white') as string;

  useImperativeHandle(ref, () => {
    return {
      // eslint-disable-next-line
      getReactContainerClasses() {
        return ['layers-result-custom-tooltip'];
      },
    };
  });

  return (
    <div
      className="layers-result-custom-tooltip"
      style={{ backgroundColor: color}}
    >
      <p>
        <span>{data.productName}</span>
      </p>
      {/* <p>
        <span>Country: </span> {data.country}
      </p>
      <p>
        <span>Total: </span> {data.total}
      </p> */}
    </div>
  );
});