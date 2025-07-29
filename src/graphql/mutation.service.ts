import { gql } from '@apollo/client';
import { client } from './graphql';

export const MUTATION_TYPE_CREATE = 'create';
export const MUTATION_TYPE_UPDATE = 'update';
export const DEFAULT_RESPONSE = `
response {
    success
    messages {
        message
        type
        show
        }}
      }`;

// convertObjectToString
export const sanitizeStringValues = (object: any) => {
  if (object === null || object === undefined) return '';
  let data: string = '';
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'string') {
      data = data + `${key}:"""${value}""",`;
    } else if (Array.isArray(value) && value.length >= 0) {
      data = data + `${key}:[${value}],`;
    } else {
      data = data + `${key}:${value},`;
    }
  }
  return data.slice(0, -1);
};

export const mutateFromFormData = (
  formData: any,
  objectName: string,
  type: string,
  responseAttribute?: string[]
) => {
  const mutation = buildMutationFromJson(formData, objectName, type, responseAttribute);
  const response = postMutation(mutation);
  return handelMutationResponse(response);
};

const buildMutationFromJson = (
  formData: any,
  objectName: string,
  type: string,
  responseAttribute?: string[]
) => {
  const response = responseAttribute ? responseAttribute.join(',') : '';
  const mutation = gql`
        mutation  {
            ${type + objectName}(
                ${type + objectName}Input: {${sanitizeStringValues(formData)}}
            )
           { 
            ${response}
            ${DEFAULT_RESPONSE}
        }
        `;
  return mutation;
};

export const postMutation = (mutation: any) => {
  return client.mutate({
    mutation: mutation,
  });
};

export const handelMutationResponse = async (response: any) => {
  const res = await response;
  const newResponse: any = Object.values(res)[0];
  if (Object.keys(res).includes('errors')) {
    return {
      success: res.errors[0].extensions.originalError.success,
      response: res,
    };
  } else {
    return {
      success: (Object.values(newResponse)[0] as any).response?.success as boolean,
      response: Object.values(newResponse)[0],
    };
  }
};

export const deleteObject = (id: number, objectName: string) => {
  const mutation = gql`
    mutation  {
      remove${objectName}(id:${id})
      { 
        ${DEFAULT_RESPONSE}
      }
    `;

  const response = postMutation(mutation);
  return handelMutationResponse(response);
};
