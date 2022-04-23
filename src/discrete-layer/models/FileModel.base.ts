/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * FileBase
 * auto generated base class for the model FileModel.
 */
export const FileModelBase = ModelBase
  .named('File')
  .props({
    __typename: types.optional(types.literal("File"), "File"),
    //id: types.union(types.undefined, types.string),
    id: types.identifier, //Alex change till proper deffs
    name: types.union(types.undefined, types.string),
    parentId: types.union(types.undefined, types.string),
    isDir: types.union(types.undefined, types.null, types.boolean),
    selectable: types.union(types.undefined, types.null, types.boolean),
    modDate: types.union(types.undefined, types.null, types.frozen()),
    ext: types.union(types.undefined, types.null, types.string),
    size: types.union(types.undefined, types.null, types.number),
    childrenIds: types.union(types.undefined, types.null, types.array(types.string)),
    childrenCount: types.union(types.undefined, types.null, types.number),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class FileModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get name() { return this.__attr(`name`) }
  get parentId() { return this.__attr(`parentId`) }
  get isDir() { return this.__attr(`isDir`) }
  get selectable() { return this.__attr(`selectable`) }
  get modDate() { return this.__attr(`modDate`) }
  get ext() { return this.__attr(`ext`) }
  get size() { return this.__attr(`size`) }
  get childrenIds() { return this.__attr(`childrenIds`) }
  get childrenCount() { return this.__attr(`childrenCount`) }
}
export function selectFromFile() {
  return new FileModelSelector()
}

export const fileModelPrimitives = selectFromFile().name.parentId.isDir.selectable.modDate.ext.size.childrenIds.childrenCount.id
