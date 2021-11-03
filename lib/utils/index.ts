import { CustomLenderFields, IFieldType, LenderFields, LenderGetResponse, LenderGetResponseExtended } from "lib/types";

export const isLenderField = (
    field: CustomLenderFields | LenderFields,
): field is LenderFields => (field as LenderFields).name !== undefined;
export const isExtendedResponse = (
    response: LenderGetResponse | LenderGetResponseExtended | undefined,
): response is LenderGetResponseExtended =>
    (response as LenderGetResponseExtended).fields[0].name !== undefined;

export const getControlTypeByFieldName = (
    fieldName: CustomLenderFields | LenderFields,
) => {
    if (!isLenderField(fieldName)) {
        return getType(fieldName);
    } else {
        return getType(fieldName.name);
    }
};

export const getType = (fieldName: string): IFieldType | undefined => {
    switch (fieldName) {
        case 'first_name':
            return { 1: 'text', 2: 'text' };
        case 'last_name':
            return { 1: 'text', 2: 'text' };
        case 'gender':
            return { 1: 'radio', 2: 'radio' };
        case 'contractor':
            return { 1: 'checkbox', 2: 'checkbox' };
        case 'email':
            return { 1: 'text', 2: 'email' };
        case 'monthly_income':
            return { 1: 'text', 2: 'number' };
        case 'date_of_birth':
            return { 1: 'text', 2: 'text' };
    }
    return undefined;
};

export const getValueByType = (type: string) => {
    switch (type) {
        case 'text':
        case 'select':
            return '';
        case 'checkbox':
            return false;
    }
    return '';
};

export const getValueByName = (name: string) => {
    switch (name) {
        case 'first_name':
        case 'last_name':
        case 'email':
        case 'date_of_birth':
        case 'monthly_income':
        case 'gender':
        case 'address':
            return '';
        case 'contractor':
            return false;
    }
    return '';
};
