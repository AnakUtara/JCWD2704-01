import { MIDTRANS_API, MIDTRANS_SERVER_KEY } from '@/config';
import { IMidtransCreatePaymentLinkOption, TMidtransPaymenLink } from '@/models/midtrans.model';
import axios from 'axios';

export const createMidtransPaymenLink = async (midtransOptions: IMidtransCreatePaymentLinkOption) => {
  return await axios.post<TMidtransPaymenLink>(`${MIDTRANS_API}/v1/payment-links`, midtransOptions, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY).toString('base64')}`,
    },
  });
};
