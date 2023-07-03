import { ref } from 'vue'
import type { Ref } from 'vue'

interface ComposeConverter {
  left: Ref<number>
  right: Ref<number>
  onLeftChange: (e: Event) => void
  onRightChange: (e: Event) => void
}

export function useConverter(leftToRight: (left: number) => number, rightToLeft: (right: number) => number): ComposeConverter {
  const left = ref(0)
  const right = ref(leftToRight(left.value))

  const onLeftChange = (e: Event): void => {
    left.value = Number((e.target as HTMLInputElement).value)
    right.value = leftToRight(left.value)
  }

  const onRightChange = (e: Event): void => {
    right.value = Number((e.target as HTMLInputElement).value)
    left.value = rightToLeft(right.value)
  }

  return {
    left,
    right,
    onLeftChange,
    onRightChange,
  }
}
