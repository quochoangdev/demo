declare interface IUserLogin {
  id?: string
}
declare interface IRecord {
  id?: string
  key?: string
}

declare interface IListQuery extends IRecord {
  page: number
  pageSize: number
  total?: number
  tz?: string
}

declare interface IListDto {
  data: Array<IRecord>
  pagination: IListQuery
}

interface IGoogleAuth {
  email: string
  email_verified: string
  name: string
  picture: string
  locale: string
  iss: string
  aud: string
}

declare interface InputProps {
  name?: string
  type?: 'select' | 'number' | 'input' | 'switch'
  label?: string
  placeholder?: string
  maxLength?: string | number
  minLength?: string | number
  max?: string | number
  min?: string | number
  pattern?: string
  disabled?: boolean
  required?: boolean
  // ONLY SELECT INPUT
  data?: { code: string; label: string }[]
}
