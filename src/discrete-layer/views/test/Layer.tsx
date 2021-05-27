/* eslint-disable */
/* tslint:disable */
import * as React from "react"
import { observer } from "mobx-react"

import { LayerMetadataMixedUnion } from "../../models/LayerMetadataMixedModelSelector"
import { useQuery} from "../../models/RootStore"


export const Layer = observer(({ layer }: { layer: LayerMetadataMixedUnion  }) => {
  const { setQuery, loading, error } = useQuery();

  return (
    <li>
      <p>{layer.productName} || {(layer as any).accuracyLE90}</p>
      <span>{layer.description || layer.type}</span>
      {error && <span>Failed to update</span>}
      {loading && <span>(updating)</span>}
    </li>

    // <li onClick={() => setQuery(todo.toggle())}>
    //   <p className={`${todo.complete ? "strikethrough" : ""}`}>{todo.text} || {(todo as any).alex}</p>
    //   {error && <span>Failed to update</span>}
    //   {loading && <span>(updating)</span>}
    // </li>
  )
})
