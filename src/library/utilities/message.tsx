import Toast from 'react-native-toast-message';
import { capitalizeFirstLetter, keyExists } from './helperFunction';

const TOAST_LIFE: { [key: string]: number } = {
  error: 2000,
  success: 2000,
  warn: 4000,
  info: 3000,
};
type ToastSeverity = 'error' | 'success' | 'warn' | 'info';
export const pushMessage = (data: any) => {
  const toastArray: { severity: ToastSeverity; detail: string }[] = [];

  if (data?.response?.messages) {
    data.response.messages
      .filter((item: any) => item.show)
      .forEach((item: any) => {
        if (item.message) {
          toastArray.push({ severity: item.type, detail: item.message });
        }
      });
  }

  if (data.errors && Array.isArray(data.errors)) {
    const errorResponse = data.errors[0];
    const originalMessage = errorResponse?.extensions?.originalError?.message;

    if (typeof originalMessage === 'string') {
      toastArray.push({ severity: 'error', detail: originalMessage });
    } else if (Array.isArray(originalMessage)) {
      originalMessage.forEach((item: any) => {
        if (item.message) {
          toastArray.push({ severity: item.type || 'error', detail: item.message });
        }
      });
    }
  }

  if (Array.isArray(data?.message)) {
    data.message
      .filter((item: any) => item.show)
      .forEach((item: any) => {
        if (item.message) {
          toastArray.push({ severity: item.type, detail: item.message });
        }
      });
  }

  if (toastArray.length > 0) {
    showGroupedMessages(toastArray);
  }
};

function showGroupedMessages(messageArray: any[]) {
  const groupedMessages: { [key: string]: string[] } = {
    error: [],
    success: [],
    warn: [],
    info: [],
  };

  if (messageArray.length > 0) {
    messageArray.forEach((message) => {
      const messageText = message.detail || message.content;
      switch (message.severity) {
        case 'error':
          if (!groupedMessages.error.includes(messageText)) {
            groupedMessages.error.push(messageText);
          }
          break;
        case 'success':
          if (!groupedMessages.success.includes(messageText)) {
            groupedMessages.success.push(messageText);
          }
          break;
        case 'warn':
          if (!groupedMessages.warn.includes(messageText)) {
            groupedMessages.warn.push(messageText);
          }
          break;
        case 'info':
          if (!groupedMessages.info.includes(messageText)) {
            groupedMessages.info.push(messageText);
          }
          break;
      }
    });
  }

  // Now show the messages grouped
  for (const type in groupedMessages) {
    groupedMessages[type].forEach((msg) => {
      Toast.show({
        type: mapSeverityToToastType(type),
        text1: msg,
        visibilityTime: TOAST_LIFE[type],
      });
    });
  }
}

// Helper to map severity (warn => info, etc)
function mapSeverityToToastType(severity: string) {
  switch (severity) {
    case 'error':
      return 'error';
    case 'success':
      return 'success';
    case 'info':
      return 'info';
    case 'warn':
      return 'info'; // no direct 'warn' in react-native-toast-message
    default:
      return 'info';
  }
}

export function setApiErrorsToForm(
  data: any,
  methods?: any,
  moreFieldName?: string,
  index?: number
) {
  const messages: any = data?.data?.message;
  let errors: any = {};
  messages.map((message: any) => Object.assign(errors, message.error));
  const getAllFields = methods.getValues();
  let toastArray = [];
  // Set error message for each field
  for (const [key, value] of Object.entries(errors)) {
    methods.setError(moreFieldName ? `${moreFieldName}.${index}.${key}` : key, {
      message: `${capitalizeFirstLetter(value)}`,
    });
    // Check if field is already present in the form
    !keyExists(getAllFields, key) &&
      toastArray.push({
        severity: 'error',
        detail: value,
        life: TOAST_LIFE.error,
      });
  }
  // Show toast only if there is any error
  if (toastArray.length > 0) {
    showGroupedMessages(toastArray);
  }
}

export function setErrorsToForm(
  data: any,
  methods: any,
  moreFieldName: string | null = null,
  index: number | null = null,
  extraName: string = ''
) {
  const response: any = Object.values(data)[0];
  let responseData: Record<string, string> = {};
  let toastArray: any[] = [];

  if (Array.isArray(response)) {
    response.forEach((res: any) => {
      if (Array.isArray(res?.extensions?.originalError?.message)) {
        const fieldErrors = res.extensions.originalError.message;

        fieldErrors.forEach((message: any) => {
          Object.assign(responseData, message.error);
        });

        const getAllFields = methods.getValues();

        Object.entries(responseData).forEach(([key, value]) => {
          const errorMessage = capitalizeFirstLetter(value);

          if (extraName && moreFieldName && index !== null) {
            // For nested array (e.g. form.sections[0].fields.name)
            const fullPath = `${moreFieldName}.${index}.${extraName}.${key}`;
            if (formFieldExists(getAllFields, index, extraName, key)) {
              methods.setError(fullPath, { message: errorMessage });
            }
          } else {
            const fullPath =
              moreFieldName && index !== null ? `${moreFieldName}.${index}.${key}` : key;
            methods.setError(fullPath, { message: errorMessage });
          }

          // If the key doesn't exist in form, push to toast
          if (!keyExists(getAllFields, key)) {
            toastArray.push({
              severity: 'error',
              detail: errorMessage,
              life: 4000,
            });
          }
        });
      }
    });

    if (toastArray.length > 0) {
      showGroupedMessages(toastArray);
    }
  }
}

/**
 * if array of object add (nested) more field  then use this function with moreFieldName and extraName
 * check the key exists in form fields key means form field name
 * @param getAllFields : form methods getValues()
 * @param index : index of object array
 * @param extraName : attribute name of object
 * @param key  : form field name
 * @returns  boolean
 */

export function formFieldExists(getAllFields: any, index: number, extraName: string, key: string) {
  const dataArray: any = Object.values(getAllFields)[0];
  const dataObject = dataArray[index][`${extraName}`];
  return Object.keys(dataObject).includes(key);
}

export const GraphQLQueryFailPopUp = (error: any) => {
  let toastArray = [];
  const messageText = `This ${error[0]?.path[0]} query failed, Please reload the page and try again.`;
  toastArray.push({
    severity: 'error',
    life: 10000,
    content: (
      <div className="text-center">
        <div>
          <span>{messageText}</span>
        </div>
        <div className="mt-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </button>
        </div>
      </div>
    ),
  });

  if (toastArray.length > 0) {
    showGroupedMessages(toastArray);
  }
};
