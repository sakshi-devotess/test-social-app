import { ICompanyHasUserHasProduct, IProduct } from '../../screens/Event/Event.model';

export interface IInvoiceData {
  datePaid: string;
  to: string;
  from: string;
  number: string;
  item: {
    name: string;
    quantity: number;
    unitPrice: number;
  };
  paymentCategory: string;
  amountPaid: number | string;
  companyHasUserProduct?: ICompanyHasUserHasProduct;
}

export interface IPaymentReceiptProps {
  invoiceData: IProduct | null;
}

export interface IPaymentReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  invoiceData: IProduct | null;
}
