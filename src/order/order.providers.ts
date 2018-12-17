import { Connection } from 'mongoose';
import { Orderschema } from './schemas/order';

export const orderProviders = [
    {
        provide: 'OrderModelToken',
        useFactory: (connection: Connection) => connection.model('Orders', Orderschema),
        inject: ['DbConnectionToken'],
    },
];