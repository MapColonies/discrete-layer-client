import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { getLinkUrlWithToken } from '../../../../discrete-layer/components/helpers/layersUtils';
import { ILayerImage } from '../../../../discrete-layer/models/layerImage';
import { isUnpublished } from '../../../helpers/style';
import { LinkType } from '../../../models/link-type.enum';
import { TypeIcon } from '../../general/type-icon';

interface IEntityTypeCellRendererParams extends ICellRendererParams {
  style?: Record<string, unknown>;
}

export const ProductTypeRenderer: React.FC<IEntityTypeCellRendererParams> = (props) => {

  const data = props.data as ILayerImage;

  return (
    <TypeIcon
      typeName={data.productType as string}
      thumbnailUrl={data.links ? getLinkUrlWithToken(data.links, LinkType.THUMBNAIL_S) : undefined}
      style={{ ...(props.style ?? {}), ...(isUnpublished(data) ?? {}) }}
    />
  );
  
};
