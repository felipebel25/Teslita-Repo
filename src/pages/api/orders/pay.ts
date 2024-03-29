import { IPaypal } from '@/interfaces';
import axios, { isAxiosError } from 'axios';
import { db } from 'database';
import Order from 'models/Order';
import type { NextApiRequest, NextApiResponse }
    from 'next'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return payOrder(req, res);
        default:
            return res.status(400)
                .json({ message: 'Bad Request' })
    }

}

const getPayPalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;


    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');

    const body = new URLSearchParams('grant_type=client_credentials');
    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data.access_token;

    } catch (error) {
        if (isAxiosError(error)) {
            console.log(error.response?.data);
        } else
            console.log(error)
        return null
    }

}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // todo: validar seccion del usuario
    const paypalBearerToken = await getPayPalBearerToken()

    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'no se pudo obtener el token de paypal' })
    }

    const {
        transactionId = '',
        orderId = ''
    } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    })
    // Orden aun no se ha pagado
    if (data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'Orden no reconocida' })
    }

    await db.connect()

    const dbOrder = await Order.findById(orderId)
    // si no exite una orden
    if (!dbOrder) {
        await db.disconnect()
        return res.status(400).json({ message: 'Orden no exite en nuestra db' })
    }

    // si los montos son diferentes
    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect()
        return res.status(400).json({ message: 'Los montos de paypal y nuesta orden no son iguales' })
    }

    dbOrder.transactionId = transactionId
    dbOrder.isPaid = true;
    await dbOrder.save()

    await db.disconnect()

    return res
        .status(200)
        .json({ message: 'Orden Pagada' })

}