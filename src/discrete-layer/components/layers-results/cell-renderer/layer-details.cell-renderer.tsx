import React from 'react';
import moment from 'moment';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import './layer-details.cell-renderer.css';

interface FormatterFunc {
  (source: string | Date | undefined): string 
}

interface DetailsProp {
  propName: string,
  propLabelId: string,
  formater: FormatterFunc
}

const stringRenderer: FormatterFunc = (val): string => val !== undefined ? val.toString() : '';
const dateRenderer: FormatterFunc = (date): string => {
  // eslint-disable-next-line
  return (date !== undefined && ("toISOString" in (date as any)))
    ? moment(date).format('DD/MM/YYYY HH:mm')
    : '-';
}

const detailsPropsLayout = new Array<DetailsProp[]>(
  [
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringRenderer,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringRenderer,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringRenderer,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringRenderer,
    },
    {
      propName: 'name',
      propLabelId: 'results.fields.name.label',
      formater: stringRenderer,
    },
  ],
  [
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateRenderer,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateRenderer,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateRenderer,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateRenderer,
    },
    {
      propName: 'creationDate',
      propLabelId: 'results.fields.creation-date.label',
      formater: dateRenderer,
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
