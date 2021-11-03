export interface LenderGetResponse {
  name: string;
  fields: Array<
    | 'first_name'
    | 'last_name'
    | 'email'
    | 'date_of_birth'
    | 'monthly_income'
    | 'gender'
    | 'address'
  >;
}

export interface LenderGetResponseExtended {
  name: string;
  fields: Array<LenderFields>;
}

export interface LenderFields {
  name: string;
  type: string;
  required: boolean;
  options?: Array<string>;
}

export interface LenderPostResponse {
  decision: 'accepted' | 'declined';
}

export interface IFieldProps {
  type: string;
  details: CustomLenderFields | LenderFields;
}

export interface IFieldType {
  1: string;
  2: string;
}

export type CustomLenderFields =
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'date_of_birth'
  | 'monthly_income'
  | 'gender'
  | 'address'
  | 'contractor';
