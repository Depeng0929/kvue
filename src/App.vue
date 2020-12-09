<template>
  <app-form :model="form" :rules="rules" ref="fromRef">
    <app-form-item prop="name">
      <app-input v-model="form.name"></app-input>
    </app-form-item>
    <app-button @click="onClick">点我</app-button>
  </app-form>

  <app-check-box-group v-model="current">
    <app-check-box label="kdp" />
    <app-check-box label="kkk" />
    <app-check-box label="ccc" />
  </app-check-box-group>

  <li v-for="i in current" :key="i">{{ i }}</li>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import type { RuleItem } from 'async-validator'

import AppButton from '/@/components/Button/index.vue'
import AppInput from '/@/components/Input/index.vue'
import AppForm from '/@/components/Form/index.vue'
import AppFormItem from '/@/components/Form/item.vue'
import AppChecked from '/@/components/CheckBox/CheckBox.vue'
import AppCheckBoxGroup from '/@/components/CheckBox/CheckBoxGroup.vue'
import AppCheckBox from './components/CheckBox/CheckBox.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppCheckBox,
    AppButton,
    AppInput,
    AppForm,
    AppFormItem,
    AppChecked,
    AppCheckBoxGroup,
  },
  setup() {
    const value = ref('123')
    const form = reactive({
      name: '',
    })

    const current = ref(['kkk'])
    const rules: Record<string, RuleItem[]> = {
      name: [{ required: true }],
    }
    const fromRef = ref(null)

    function onClick() {
      fromRef.value.validate((valid) => {
        console.log(valid)
      })
    }
    return {
      current,
      form,
      rules,
      fromRef,
      onClick,
      value,
    }
  },
})
</script>

<style lang="scss" scoped></style>
