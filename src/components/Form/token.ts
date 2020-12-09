import type { InjectionKey } from 'vue'
import type { Emitter } from 'mitt'
import type { RuleItem } from 'async-validator'
import { CheckBoxGroupInstance } from '../CheckBox/checkBox'

export interface formContext {
  formMitt: Emitter
  model?: Record<string, unknown>
  rules?: Record<string, RuleContext | RuleContext[]>
}

export interface formItemContext {
  formItemMitt?: Emitter
  validate: (trigger: string, callback: ValidateFn) => void
  resetField(): void
}

export const formKey: InjectionKey<formContext> = 'formKey' as any
export const formItemKey: InjectionKey<formItemContext> = 'formItemKey' as any
export const checkGroupKey: InjectionKey<CheckBoxGroupInstance> = 'checkGroupKey' as any

export interface ValidateFn {
  (message: string): unknown
}

export interface ValidateCallback {
  (isOk: boolean): void
}

export interface RuleContext extends RuleItem {
  trigger?: string
}
