import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { getLinkUrlWithToken } from '../../../../discrete-layer/components/helpers/layersUtils';
import { RecordStatus } from '../../../../discrete-layer/models';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { LinkType } from '../../../models/link-type.enum';
import { TypeIcon } from '../../general/type-icon';

const STATUS = 'productStatus';
const UNPUBLISHED_COLOR = 'orange';

interface IEntityTypeCellRendererParams extends ICellRendererParams {
  style?: Record<string, unknown>;
}

export const ProductTypeRenderer: React.FC<IEntityTypeCellRendererParams> = (props) => {

  const data = props.data as ILayerImage;
  let style = {...props.style ?? {}};
  if (STATUS in data && Object.values(data).includes(RecordStatus.UNPUBLISHED)) {
    style = { ...style, color: UNPUBLISHED_COLOR };
  }

  return (
    <TypeIcon
      typeName={data.productType as string}
      thumbnailUrl={data.links ? getLinkUrlWithToken(data.links, LinkType.THUMBNAIL_S) : undefined}
      style={style}
    />
  );
  
};
