import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  supportedTypes = ['income', 'outcome'];

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!this.supportedTypes.includes(type)) {
      throw new Error('This type is not supported');
    }

    if (type === 'outcome') {
      const balances = this.transactionsRepository.getBalance();
      if (balances.total - value < 0)
        throw new Error(
          'This transaction cannot be submitted. The resulting balance should be higher than 0.',
        );
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
