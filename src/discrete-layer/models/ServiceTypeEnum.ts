/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum ServiceType {
  PYCSW="PYCSW",
MAP_SERVER="MAP_SERVER"
}

/**
* ServiceType
*/
export const ServiceTypeEnumType = types.enumeration("ServiceType", [
        "PYCSW",
  "MAP_SERVER",
      ])
