<template>
  <form>
    <slot></slot>
  </form>
</template>

<script lang="ts">
import { defineComponent, provide, reactive, toRefs } from 'vue'
import mitt from 'mitt'
import { formItemContext, formKey, ValidateCallback } from './token'

export default defineComponent({
  name: 'AppForm',
  props: {
    model: Object,
    rules: Object,
  },
  setup(props) {
    const formMitt = mitt()
    const fields: formItemContext[] = []

    formMitt.on<formItemContext>('app.formItem.add', (field) => {
      if (field) {
        fields.push(field)
      }
    })
    formMitt.on<formItemContext>('app.formItem.remove', (field) => {
      if (field) {
        fields.splice(fields.indexOf(field), 1)
      }
    })

    function resetField() {
      fields.forEach((field) => {
        field.resetField()
      })
    }
    function validate(callback: ValidateCallback) {
      return new Promise((resolve) => {
        let valid = true
        let count = 0
        fields.forEach((field) => {
          field.validate('', (errors) => {
            if (errors) {
              valid = false
            }
            if (++count === fields.length) {
              resolve(valid)
              if (typeof callback === 'function') {
                callback(valid)
              }
            }
          })
        })
      })
    }

    const form = reactive({
      ...toRefs(props),
      formMitt,
    })
    provide(formKey, form)

    return {
      validate,
      resetField,
    }
  },
})
</script>

<style lang="scss" scoped></style>
