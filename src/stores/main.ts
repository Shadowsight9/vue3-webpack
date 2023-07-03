import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    computedCount(state) {
      return state.count * 2
    },
  },
  actions: {
    add(value: number) {
      this.count += value
    },
    sub(value: number) {
      this.count -= value
    },
  },
})
