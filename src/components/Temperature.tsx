import { useConverter } from '@/composables/converter'
import { defineComponent } from 'vue'

export default defineComponent(() => {
  const {
    left: c,
    right: f,
    onLeftChange: setC,
    onRightChange: setF,
  } = useConverter(
    v => v * (9 / 5) + 32,
    v => (v - 32) * (5 / 9),
  )

  return () => {
    return (
      <>
        <input type="number" value={c.value} onChange={setC} /> 摄氏度 = 
        <input type="number" value={f.value} onChange={setF} /> 华氏度
      </>
    )
  }
})
