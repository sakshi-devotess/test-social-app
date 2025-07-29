import uuid from 'react-native-uuid';
import { ICompanyHasUser } from '../../screens/Auth/Signup/Signup.model';
import { COMPANY_HAS_USER_HAS_EVENT_STATUS, EVENT_STATUS } from '../../config/constants';
import { ParseKeys, TFunction } from 'i18next';
import fileApiInstance from '../../services/file/file.service';
import Toast from 'react-native-toast-message';
export const keyExists = (obj: any, key: any) => {
  if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
    return false;
  } else if (obj.hasOwnProperty(key)) {
    return true;
  } else if (Array.isArray(obj)) {
    for (const element of obj) {
      const result: any = keyExists(element, key);
      if (result) {
        return result;
      }
    }
  } else {
    for (const k in obj) {
      const result: any = keyExists(obj[k], key);
      if (result) {
        return result;
      }
    }
  }

  return false;
};

export const capitalizeFirstLetter = (string: any) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateUUID = () => uuid.v4();

export const dateTemplate = (timestamp: string) => {
  const date = timestamp ? new Date(Number(timestamp)) : new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return ` ${hours}:${minutes}`;
};

export const assignLabels = (
  value: number | null | string,
  type: [{ label: string; value: number | string }]
) => {
  return type?.find((x: any) => x.value === value)?.label;
};

export const getBase64FromUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const mimeType = response?.headers?.get('content-type') ?? 'image/jpeg';
        const base64Body = reader?.result?.split(',')[1];
        const base64 = `data:${mimeType};base64,${base64Body}`;
        resolve(base64 as string);
      };
      reader.onerror = (error) => {
        console.error('Error reading the blob:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching the file:', error);
    return null;
  }
};

export const getUserFullName = (companyHasUser: ICompanyHasUser) => {
  if (!companyHasUser) {
    return '';
  }
  return companyHasUser?.user?.first_name + ' ' + companyHasUser?.user?.last_name;
};

export const dateTimeTemplate = (options: any) => {
  const date = new Date(Number(options)).toLocaleString();
  return date;
};

export const getStatusLabel = (status: number) => {
  const statusStyles = {
    [COMPANY_HAS_USER_HAS_EVENT_STATUS.REQUEST]: { label: 'Requested', color: '#f0ad4e' },
    [COMPANY_HAS_USER_HAS_EVENT_STATUS.CONFIRMED]: { label: 'Confirmed', color: '#0275d8' },
    [COMPANY_HAS_USER_HAS_EVENT_STATUS.PAID]: { label: 'Paid', color: '#5cb85c' },
    [COMPANY_HAS_USER_HAS_EVENT_STATUS.REJECTED]: { label: 'Rejected', color: '#d9534f' },
    [COMPANY_HAS_USER_HAS_EVENT_STATUS.CANCELLED]: { label: 'Cancelled', color: '#6c757d' },
  };

  return statusStyles[status] || { label: 'Unknown', color: '#ccc' };
};

export const getEventStatusLabel = (status: number) => {
  const statusStyles = {
    [EVENT_STATUS.PLANNED]: { label: 'Planned', color: '#f0ad4e' },
    [EVENT_STATUS.COMPLETED]: { label: 'Completed', color: '#5cb85c' },
    [EVENT_STATUS.CANCELLED]: { label: 'Cancelled', color: '#d9534f' },
  };

  return statusStyles[status] || { label: 'Unknown', color: '#ccc' };
};

export const formatPrice = (amount: number, currency) => {
  const price = amount / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
};

export const getArticleStatusLabel = (status: number) => {
  const statusStyles = {
    [EVENT_STATUS.PLANNED]: { label: 'Planned', color: '#f0ad4e' },
    [EVENT_STATUS.COMPLETED]: { label: 'Completed', color: '#5cb85c' },
    [EVENT_STATUS.CANCELLED]: { label: 'Cancelled', color: '#d9534f' },
  };

  return statusStyles[status] || { label: 'Unknown', color: '#ccc' };
};

export function formatInvoiceDate(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const getTableHeader = (plural: ParseKeys, t: TFunction) => {
  return capitalizeFirstLetter(
    t('components.table.header', {
      plural: t(plural),
    })
  );
};

export const getDialogHeader = (singular: ParseKeys, t: TFunction) => {
  return capitalizeFirstLetter(
    t('components.dialog.header', {
      singular: t(singular),
    })
  );
};

export const getFileById = async (id: number) => {
  try {
    return await fileApiInstance.getFile(id);
  } catch (error) {
    console.error('Error fetching file by id:', error);
    return null;
  }
};

export const showToast = (type: string, text1: string, text2 = '') => {
  Toast.show({
    type: type, // 'success', 'error', 'info', etc.
    text1: text1, // Main message
    text2: text2, // Sub-message (optional)
    visibilityTime: 2000,
    position: 'bottom',
  });
};
