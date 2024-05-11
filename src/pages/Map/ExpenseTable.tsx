import React from 'react';
import { Button, Input } from 'antd';
import styles from './index.module.css'; // Импорт стилей

interface Expense {
  id: number;
  action: string;
  participants: string;
  payer: string; // Добавили плательщика
  costPerPerson: string;
  totalCost: string;
}

interface Props {
  expenses: Expense[];
  currentDay: number;
  addExpense: () => void;
  removeExpense: (id: number, day: number) => void;
  handleExpenseChange: (id: number, key: string, value: string) => void;
}

const ExpenseTable: React.FC<Props> = ({
  expenses,
  currentDay,
  addExpense,
  removeExpense,
  handleExpenseChange,
}) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} id="table">
        <div>День {currentDay + 1}</div>
        <thead>
          <tr>
            <th>Действие</th>
            <th>Участники</th>
            <th>Оплачивал</th>
            <th>За одного</th>
            <th>Итог</th>
          </tr>
        </thead>
        <tbody>
          {expenses && expenses.map((expense, index) => (
            <tr key={index}>
              <td>
                <Input
                  value={expense.action}
                  onChange={(e) => handleExpenseChange(expense.id, 'action', e.target.value)}
                />
              </td>
              <td>
                <Input
                  value={expense.participants}
                  onChange={(e) => handleExpenseChange(expense.id, 'participants', e.target.value)}
                />
              </td>
              <td>
                <Input
                  value={expense.payer}
                  onChange={(e) => handleExpenseChange(expense.id, 'payer', e.target.value)} // Добавлен обработчик изменения плательщика
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={expense.costPerPerson}
                  onChange={(e) => handleExpenseChange(expense.id, 'costPerPerson', e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={expense.totalCost}
                  onChange={(e) => handleExpenseChange(expense.id, 'totalCost', e.target.value)}
                />
              </td>
              <td>
                <Button onClick={() => removeExpense(expense.id, currentDay)}>х</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={addExpense} className={styles.tablebutton}>
        Добавить трату
      </Button>
    </div>
  );
};

export default ExpenseTable;
