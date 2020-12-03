<template>
  <div>
    <label>{{ label }}</label>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  inject,
  reactive,
  provide,
  ref,
  computed,
} from 'vue'
import mitt from 'mitt'
import AsyncValidator from 'async-validator'

import {
  formContext,
  formItemKey,
  formKey,
  RuleContext,
  ValidateFn,
} from './token'

enum ValidateStatus {
  validating = 'validting',
  success = 'success',
  error = 'error',
}

export default defineComponent({
  name: 'AppFormItem',
  props: {
    prop: String,
    label: String,
  },
  setup(props) {
    const form = inject(formKey, {} as formContext)

    const formItemMitt = mitt()

    const isRequired = ref(false)
    const validateStatus = ref('')
    const validateMessage = ref('')
    const fieldValue = computed(() => {
      return form.model[props.prop]
    })

    const initValue = ref('')

    function setRules() {
      formItemMitt.on('app.input.input', onFieldChange)
      formItemMitt.on('app.input.blur', onFieldBlur)
    }
    function onFieldChange() {
      validate('change')
    }
    function onFieldBlur() {
      validate('blur')
    }
    function validate(trigger, callback: ValidateFn = (str: string) => {}) {
      let rules = getFilterRules(trigger)
      if (!rules || rules.length === 0) {
        return true
      }

      validateStatus.value = ValidateStatus.validating

      let descriptor = {}
      descriptor[props.prop] = rules
      const validator = new AsyncValidator(descriptor)

      let model = {}
      model[props.prop] = fieldValue.value

      validator.validate(model, { firstFields: true }, (errors) => {
        validateStatus.value = !errors
          ? ValidateStatus.success
          : ValidateStatus.error
        validateMessage.value = errors ? errors[0].message : ''

        callback(validateMessage.value)
      })

      function getRules() {
        let formRules = form.rules
        formRules = formRules ? formRules[props.prop] : []
        const result: RuleContext[] = [].concat(formRules || [])

        // 设置必填
        isRequired.value = result.some((rule) => rule.required)

        return result
      }
      function getFilterRules(trigger: string) {
        const rules = getRules()
        return rules.filter(
          (rule) => !rule.trigger || rule.trigger.indexOf(trigger) !== -1,
        )
      }
    }

    function resetField() {
      validateStatus.value = ''
      validateMessage.value = ''
      form.model[props.prop] = initValue.value
    }

    const formItem = reactive({
      formItemMitt,
      validate,
      resetField,
    })

    onMounted(() => {
      if (props.prop) {
        initValue.value = fieldValue.value
        form.formMitt.emit('app.formItem.add', formItem)
        setRules()
      }
    })

    provide(formItemKey, formItem)
    return {
      isRequired,
      validateStatus,
      validateMessage,
      resetField,
      validate,
    }
  },
})
</script>

<style lang="scss" scoped></style>
