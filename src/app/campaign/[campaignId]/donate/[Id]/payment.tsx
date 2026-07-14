import React from 'react'
import {PaymentMethods} from '@/constant/payment-method'
import { AccordionContent } from '@/components/Accordion';
import Balancer from 'react-wrap-balancer';

export interface IPayment {
	reference_id:   string;
	bank_code:      string;
	account_number: string;
	expired_at:     Date;
	name:           string;
	image:          string;
}

const Payment = ({payment}: {payment: IPayment}) => {
	const findPayment = PaymentMethods?.find((data) => data?.value?.toLowerCase() == payment?.bank_code?.toLowerCase() )
	return (
			<AccordionContent>
				<ul className="space-y-2 text-gray-500">
					{findPayment?.steps?.map((step, index) => (
						<li key={index}>
						<Balancer>{index+1}. {step}</Balancer>
					</li>
					) )}
				</ul>
			</AccordionContent>
	)
}

export default Payment