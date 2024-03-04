import { DataSource } from 'typeorm';
import { Contact } from './contact.entity';

export const ContactProviders = [
  {
    provide: 'CONTACT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Contact),
    inject: ['DATA_SOURCE'],
  },
];