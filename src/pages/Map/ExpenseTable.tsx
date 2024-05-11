import React from 'react';
import { Button, Input } from 'antd';
import { Formik, Form, Field } from 'formik';
import styles from './index.module.css'; // Импорт стилей

interface Expense {
  id: number;
  title: string;
  categoryTitle: string;
  participants: string;
  payers: string;
  pricePerOne: string;
  totalPrice: string;
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
            <th>Название</th>
            <th>Категория</th>
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
                <Field
                  as={Input}
                  name={`expenses[${index}].title`}
                />
              </td>
              <td>
                <Field
                  as={Input}
                  name={`expenses[${index}].categoryTitle`}
                />
              </td>
              <td>
                <Field
                  as={Input}
                  name={`expenses[${index}].participants`}
                />
              </td>
              <td>
                <Field
                  as={Input}
                  name={`expenses[${index}].payers`}
                />
              </td>
              <td>
                <Field
                  as={Input}
                  type="number"
                  name={`expenses[${index}].pricePerOne`}
                />
              </td>
              <td>
                <Field
                  as={Input}
                  type="number"
                  name={`expenses[${index}].totalPrice`}
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

const ExpenseTableFormik: React.FC<Props> = (props) => {
  const initialValues = {
    expenses: props.expenses,
  };

  const handleSubmit = (values: any) => {
    // Обработка отправки формы
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <ExpenseTable {...props} />
        <button type="submit" style={{ display: 'none' }} />
      </Form>
    </Formik>
  );
};

export default ExpenseTableFormik;
