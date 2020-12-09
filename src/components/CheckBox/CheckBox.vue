<template>
  <label>
    {{ label }}
    <input
      v-if="isGroup"
      type="checkbox"
      :value="label"
      :disabled="disabled"
      v-model="model"
      @change="onChange"
    />
    <input
      v-else
      type="checkbox"
      :checked="current"
      :disabled="disabled"
      @change="onChange"
    />
  </label>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  watch,
  unref,
  inject,
  computed,
  onMounted,
} from 'vue'
import {
  checkGroupKey,
  formItemContext,
  formItemKey,
} from '/@/components/Form/token.ts'
import { CheckBoxGroupInstance } from './checkBox'

export default defineComponent({
  name: 'AppCheckBox',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const formItem = inject(formItemKey, {} as formItemContext)
    const current = ref(props.modelValue === props.trueValue)
    const { trueValue, falseValue } = toRefs(props)

    const checkGroup = inject<CheckBoxGroupInstance>(checkGroupKey, {} as any)
    const model = checkGroup.modelValue
    const isGroup = computed(() => {
      return checkGroup && checkGroup.name === 'CheckBoxGroup'
    })
    onMounted(() => {
      updateModelValue()
    })

    watch(
      () => props.modelValue,
      (val) => {
        if (val === unref(trueValue) || val === unref(falseValue)) {
          updateModelValue()
        } else {
          console.error('ModelValue must be trueValue or falseValue')
        }
      },
    )

    function onChange(e: InputEvent) {
      if (props.disabled) {
        return false
      }

      const checked = (e.target as HTMLInputElement).checked
      current.value = checked
      const value = checked ? props.trueValue : props.falseValue
      emit('update:modelValue', value)

      if (unref(isGroup)) {
        checkGroup.change(checked, props.label)
      } else {
        emit('change', value)
        formItem.formItemMitt?.emit('app.input.input', value)
      }
    }

    function updateModelValue() {
      current.value = props.modelValue === props.trueValue
    }
    return {
      current,
      isGroup,
      model,
      onChange,
    }
  },
})
</script>

<style lang="scss" scoped></style>
