export interface CheckBoxGroupInstance {
  name: string
  change: (chekced: boolean, label: string) => void
  modelValue: unknown[]
}
