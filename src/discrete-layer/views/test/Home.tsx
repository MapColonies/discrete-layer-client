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
    // store.queryTodos()

    // store.queryTodos({},`
    // ... on Todo {
    //   __typename
    //   id
    //   text
    //   complete
    // }
    // ... on TodoWithAlex {
    //   __typename
    //   id
    //   text
    //   complete
    //   alex
    // }`)
  );

  const store = useStore();

  const getTodos = () => {
    const comps: any[] = [];
    
    // store.discreteLayersStore.showLayer('id', true, null);
    
    store.layerMetadata.data_.forEach((layer)=> {
      // @ts-ignore
      comps.push(<Layer key={layer.get().value.id} layer={layer.get().value as LayerMetadataMixedUnion} />)
    })
    return comps;
  }

  // const getTodosWithAlexes = () => {
  //   let comps: string = '';
  //   store.todoWithAlexes.data_.forEach((todo, key)=> {
  //     // @ts-ignore
  //     comps += key + '  ' + todo.get().value.complete
  //   })
  //   return comps;
  // }

  if (error) return <Error>{error.message}</Error>
  if (data){
    return (
      <>
        {/* <h1>WITH ALEX[0] {getTodosWithAlexes()}</h1> */}
        <ul>
          {
            // getTodos()
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

// export const Home = () => {
//   return <h1>HERE</h1>
// }
