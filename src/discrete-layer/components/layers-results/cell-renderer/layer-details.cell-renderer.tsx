import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { dateFormatter, FormatterFunc, stringFormatter } from '../type-formatters/type-formatters';
import './layer-details.cell-renderer.css';

interface DetailsProp {
  propName: string,
  propLabelId: string,
  formater: FormatterFunc
}

const detailsPropsLayout = new Array<DetailsProp[]>(
  [
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringFormatter,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringFormatter,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringFormatter,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringFormatter,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringFormatter,
    },
  ],
  [
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateFormatter,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateFormatter,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateFormatter,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateFormatter,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateFormatter,
    },
  ]
);

export const LayerDetailsRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  return (
    <Box className="layerDetailsContainer">
    {
      detailsPropsLayout.map((layoutColumn,i) => {
        return (
          <Box  key={i} className="detailsColumn">
            {
              layoutColumn.map((item:DetailsProp, ii) => {
                return(
                  <Box key={`${i}_${ii}`}>
                    <span style={{fontWeight:600}}>
                      <FormattedMessage id={item.propLabelId} />:&nbsp;
                    </span>
                    <span>
                      {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        item.formater(props.data[item.propName])
                      }
                    </span>
                  </Box>
                )
              })
            }
          </Box>
        )
      })
    }
  </Box>
  );

};
