import PropTypes from 'prop-types';
import { sum } from 'lodash';

// utils
import { fCurrency } from '../../../../utils/formatNumber';
//
import styles from './InvoiceStyle';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoicePDF({ invoice }) {
  const { id, items, taxes, status, discount, invoiceTo, invoiceFrom } = invoice;
  const subTotal = sum(items.map((item) => item.price * item.qty));
  const total = subTotal - discount + taxes;

  return (
  <></>
  );
}
