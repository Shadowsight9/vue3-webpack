<script setup lang="ts">
import { useConverter } from '@/composables/converter'

const {
  left: yen,
  right: rmb,
  onLeftChange: onYenChange,
  onRightChange: onRmbChange,
} = useConverter(
  v => v * 0.06,
  v => v / 0.06,
)
</script>

<template>
  <input type="number" :value="yen" @change="onYenChange"> 円 =
  <input type="number" :value="rmb" @change="onRmbChange"> 元
</template>
