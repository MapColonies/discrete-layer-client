/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum ProductType {
  ORTHOPHOTO="ORTHOPHOTO",
RASTER_MAP="RASTER_MAP",
VECTOR_MAP="VECTOR_MAP",
VECTOR="VECTOR",
DEM="DEM",
MODEL_3D="MODEL_3D",
PHOTO_BLOCK="PHOTO_BLOCK",
PHOTOSPHERA="PHOTOSPHERA",
BEST_ORTHOPHOTO="BEST_ORTHOPHOTO",
BEST_RASTER_MAP="BEST_RASTER_MAP"
}

/**
* ProductType
*/
export const ProductTypeEnumType = types.enumeration("ProductType", [
        "ORTHOPHOTO",
  "RASTER_MAP",
  "VECTOR_MAP",
  "VECTOR",
  "DEM",
  "MODEL_3D",
  "PHOTO_BLOCK",
  "PHOTOSPHERA",
  "BEST_ORTHOPHOTO",
  "BEST_RASTER_MAP",
      ])
