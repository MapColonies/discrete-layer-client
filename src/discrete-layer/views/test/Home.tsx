import React from "react"
import { observer } from "mobx-react"
import { useQuery, useStore } from "../../models/RootStore"
import { LayerMetadataMixedUnion } from "../../models/LayerMetadataMixedModelSelector"

import { Error } from "./Error"
import { Loading } from "./Loading"
import { Layer } from "./Layer"


export const Home = observer(() => {
  const { loading, error, data, query } = useQuery((store) =>
    store.queryCatalogItems()

    // store.queryCatalogItems({},`
    // ... on LayerRasterRecord {
    //   __typename
    //   sourceName
    //   creationDate
    //   geometry 
    //   type
    //   links {
    //     __typename
    //     name
    //     description
    //     protocol
    //     url
    //   }
    // }
    // ... on Layer3DRecord {
    //    __typename
    //   sourceName
    //   creationDate
    //   geometry
    //   type
    //   links {
    //     __typename
    //     name
    //     description
    //     protocol
    //     url
    //   }
    //   accuracyLE90
    // }
    // }`)
  );

  const store = useStore();

  if (error) return <Error>{error.message}</Error>
  if (data){
    return (
      <>
        <ul>
          {
            data.catalogItems.map((layer) => (
              <Layer key={layer.id} layer={layer} />
            ))
          }
        </ul>
        {loading ? (
          <Loading />
        ) : (
          <button onClick={query!.refetch}>Refetch</button>
        )}
      </>
    )
  }
  return (<><Loading /></>)
})
