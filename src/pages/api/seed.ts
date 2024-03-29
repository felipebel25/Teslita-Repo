import type { NextApiRequest, NextApiResponse } from 'next'
import { db, initialData } from 'database'
import { Product , User, Order } from 'models'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'No tiene acceso  este servicio' })
    }

    await db.connect()
    
    await User.deleteMany();
    await User.insertMany(initialData.users);

    await Product.deleteMany();
    await Product.insertMany(initialData.products);
    
    await Order.deleteMany();

    await db.disconnect()

    res.status(200).json({ message: 'todo correcto' })
}