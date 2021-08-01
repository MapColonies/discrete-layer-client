import React from 'react';
import { get, isString } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { Mode } from '../../../../common/models/mode.enum';
import { FieldLabelComponent } from '../../../../common/components/form/field-label';
import { LinkModelType } from '../../../models';
import { IRecordFieldInfo } from '../layer-details.field-info';
import { getValuePresentor } from '../layer-details';

import './links.value-presentors.css';

interface LinksValuePresentorProps {
  value?: LinkModelType[];
  fieldInfo?: IRecordFieldInfo;
}

export const LinksValuePresentorComponent: React.FC<LinksValuePresentorProps> = ({ value, fieldInfo }) => {
  return (
    <Box className="detailsFieldValue detailsLinksFieldValue">
      <Box className="linksFieldsContainer">
      {
        value?.map((link, index) => {
          return(
            <>
              {
                fieldInfo?.subFields.map((subFieldInfo: IRecordFieldInfo) => {
                  return (
                    isString(get(link,subFieldInfo.fieldName as string)) && <Box key={`${subFieldInfo.fieldName as string}_${link.url as string}`} className={(subFieldInfo.fullWidth === true) ? 'categoryFullWidthField' : 'categoryField'}>
                      <FieldLabelComponent value={subFieldInfo.label}></FieldLabelComponent>
                      {
                        getValuePresentor(link, subFieldInfo, get(link,subFieldInfo.fieldName as string), Mode.VIEW)
                      }
                    </Box>
                  )
                })
              }
              {
                index < (value.length-1) && <Box className="linkFieldsSeparator"></Box>
              }
            </>
            )
          }
        )
      }
      </Box>
    </Box>
  );
}
