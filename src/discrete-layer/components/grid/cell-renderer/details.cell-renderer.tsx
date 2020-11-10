import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Icon } from '@map-colonies/react-core';
import { useTheme } from '@map-colonies/react-core';
import './details.cell-renderer.css';

export const DetailsRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: boolean = (props.data as any).isVisible; 
  const theme = useTheme();
  
  if (!value) {
    return <></>;//''; // not null!
  }
  return (
    <Box>
      {/* <div> */}
      <table>
      {
        Object.keys(props.data).map((key, i) => {
          return(
            <tr key={i}>
              <td>{key}</td>
              <td>{props.data[key].toString()}</td>
            </tr>
            // <div>
            //   <span>{key}:</span>
            //   <span>{props.data[key].toString()}</span>
            // </div>
          )
        })
      }
      </table>
      {/* </div> */}
    </Box>
  );

};
