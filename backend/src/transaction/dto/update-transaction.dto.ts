import { TransactionType } from '@prisma/client';

export class UpdateTransaction {
  description?: string;
  amount?: number;
  type?: TransactionType;
  categoryId?: string;
  date?: string;
}
