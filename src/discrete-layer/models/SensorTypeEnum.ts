/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum SensorType {
  VIS="VIS",
RGB="RGB",
Pan_Sharpen="Pan_Sharpen",
OTHER="OTHER",
UNDEFINED="UNDEFINED"
}

/**
* SensorType
*/
export const SensorTypeEnumType = types.enumeration("SensorType", [
        "VIS",
  "RGB",
  "Pan_Sharpen",
  "OTHER",
  "UNDEFINED",
      ])
