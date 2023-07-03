import { KeepAlive, defineComponent } from 'vue'
import type { DefineComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import type { RouteLocation } from 'vue-router'
import { useMainStore } from '@/stores/index'

interface RouterViewDefaultSlotScope {
  route: RouteLocation
  Component: DefineComponent<{}, {}, any> | undefined
}

export default defineComponent(() => {
  const store = useMainStore()

  const add = (): void => {
    store.add(1)
  }

  const sub = (): void => {
    store.sub(1)
  }

  return () => {
    return (
      <>
        <div>Count: {store.count} * 2 = {store.computedCount}</div>
        <div><button onClick={add}>ADD</button><button onClick={sub}>SUB</button></div>
        <div>
          <RouterLink to="/temperature">Temperature</RouterLink> | <RouterLink to="/yen">Yen</RouterLink>
        </div>
        <RouterView
          v-slots={{
            default: (slotProps: RouterViewDefaultSlotScope) => {
              const { Component } = slotProps
              return <KeepAlive>{Component ? <Component /> : null}</KeepAlive>
            },
          }} />
      </>
    )
  }
})
