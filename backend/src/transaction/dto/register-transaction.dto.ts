import { TransactionType } from '@prisma/client';

export class RegisterTransaction {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
}
