import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from 'antd';
import styles from './index.module.css'; // Импорт стилей
import { getCategories } from "../../services/trip.service";
import { SaveOutlined, DeleteOutlined  } from '@ant-design/icons';
import { addActiviesByDay, ActivityData, deleteActivity, updateActivity, getStat, UpdateActivityData  } from "../../services/activity.service";

interface Expense {
  id: number;
  title: string;
  categoryTitle: string;
  participants: string[];
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
  totalparticipants: string[];
  dayGuid: string;
}

const ExpenseTable: React.FC<Props> = ({
  expenses,
  currentDay,
  addExpense,
  removeExpense,
  handleExpenseChange,
  totalparticipants,
  dayGuid,
}) => {

  const [categories, setCategories] = useState<any[]>([]); // Изменил тип на any[]
  const [participantEmail, setParticipantEmail] = useState<string>('fdf');
  const [expenseModels, setExpenseModels] = useState<Expense[]>(expenses); // Состояние моделей трат

  useEffect(() => {
    setExpenseModels(expenses); // Обновление состояния моделей при изменении expenses
  }, [expenses]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories(); // Получаем категории с сервера
        console.log("Categories:", categoriesData); // Выводим категории в консоль
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleTitleChange = (index: number, value: string) => {
    const oldTitle = expenseModels[index].title; // Сохраняем старое значение заголовка
    handleExpenseChange(index, 'title', value);
    updateExpenseModel(index, { title: value });
    console.log(`Model for expense ${index + 1} updated: Title - ${value}, Category - ${expenseModels[index].categoryTitle}`);
  };
  
  const handleCategoryChange = (index: number, value: string) => {
    const oldCategory = expenseModels[index].categoryTitle; // Сохраняем старое значение категории
    handleExpenseChange(index, 'categoryTitle', value);
    updateExpenseModel(index, { categoryTitle: value });
    console.log(`Model for expense ${index + 1} updated: Title - ${expenseModels[index].title}, Category - ${value}`);
  };
  
  const handleParticipantsChange = (index: number, value: string[]) => {
    handleExpenseChange(index, 'participants', value.join(','));
    updateExpenseModel(index, { participants: value });
    console.log(`Model for expense ${index + 1} updated: Title - ${expenseModels[index].title}, Participants - ${value.join(',')}`);
  };
  
  const handlePayersChange = (index: number, value: string) => {
    handleExpenseChange(index, 'payers', value);
    updateExpenseModel(index, { payers: value });
    console.log(`Model for expense ${index + 1} updated: Payers - ${value}`);
  };
  
  const handlePricePerOneChange = (index: number, value: string) => {
    handleExpenseChange(index, 'pricePerOne', value);
    updateExpenseModel(index, { pricePerOne: value });
    console.log(`Model for expense ${index + 1} updated: Price Per One - ${value}`);
  };
  
  const handleTotalPriceChange = (index: number, value: string) => {
    handleExpenseChange(index, 'totalPrice', value);
    updateExpenseModel(index, { totalPrice: value });
    console.log(`Model for expense ${index + 1} updated: Total Price - ${value}`);

    console.log('All Expense Models:', expenseModels);
  };
  

  const updateExpenseModel = (index: number, updates: Partial<Expense>) => {
    const updatedModel = {...expenseModels[index], ...updates};
    const updatedModels = [...expenseModels];
    updatedModels[index] = updatedModel;
    setExpenseModels(updatedModels);
  };

  const handleSave = async (index: number) => {
    const expense = expenseModels[index]; 

      // Выводим все модели данных в консоль
    console.log('All Expense Models:', expenseModels);

    // Выводим модель данных, которая будет использоваться для сохранения
    console.log(`Model for saving expense ${index + 1}:`, expense);


    // Проверяем, что все ячейки строки таблицы не пустые
    if (!expense.title) {
      console.error('Title field must be filled');
      return;
    }
    if (!expense.categoryTitle) {
      console.error('Category field must be filled');
      return;
    }
    if (!expense.participants) {
      console.error('Participants field must be filled');
      return;
    }
    if (!expense.payers) {
      console.error('Payers field must be filled');
      return;
    }
    if (!expense.pricePerOne) {
      console.error('Price Per One field must be filled');
      return;
    }
    if (!expense.totalPrice) {
      console.error('Total Price field must be filled');
      return;
    }

    // Проверяем, что expense.participants является строкой, а не массивом строк
    const participants = Array.isArray(expense.participants) ? expense.participants : [expense.participants];


    const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (idPattern.test(expense.id.toString())) {
      const activityId = expense.id;

      console.log("participants: "+expense.participants);
//при изменении траты, которая уже в бд, изменения не сохраняются из-за participants и payers
      const requestData = {
        title: expense.title,
        categoryId: categories.find(category => category.title === expense.categoryTitle)?.id,
        pricePerOne: parseFloat(expense.pricePerOne),
        totalPrice: parseFloat(expense.totalPrice),
        participants: participants.join(',').split(',').map(participant => participant.trim()),
        payers: expense.payers
      };

      // const requestData = {
      //   title: expense.title,
      //   categoryId: categories.find(category => category.title === expense.categoryTitle)?.id,
      //   pricePerOne: parseFloat(expense.pricePerOne),
      //   totalPrice: parseFloat(expense.totalPrice),
      //   participants: [
      //     'maria@twf.com'
      //   ],
      //   payers: [expense.payers]
      // };

      console.log("ID: "+expense.id);
      console.log('Activity Data to update:', requestData);
      try {
        // Отправляем данные на сервер
        await updateActivity(activityId.toString(), requestData);
        console.log('Expense updated successfully');
      } catch (error) {
        console.error('Error updating expense:', error);
      }
      return;
    }
    console.log("ID: "+expense.id);
    // Собираем данные для отправки на сервер
    const data: ActivityData = {
      dayId: dayGuid,
      title: expense.title,
      categoryId: categories.find(category => category.title === expense.categoryTitle)?.id,
      pricePerOne: parseFloat(expense.pricePerOne),
      totalPrice: parseFloat(expense.totalPrice),
      participants: participants.join(',').split(',').map(participant => participant.trim()),
      payers: [expense.payers],
    };

    console.log('Activity Data:', data);

    try {
      // Отправляем данные на сервер
      await addActiviesByDay(data);
      console.log('Expense saved successfully');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const [deletedRows, setDeletedRows] = useState<number[]>([]);

  const handleDelete = async (expense: Expense) => {
    // Паттерн для проверки формата id траты
    const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    // Проверяем, соответствует ли id траты заданному паттерну
    if (idPattern.test(expense.id.toString())) {
      console.log('Удаляем трату из базы данных');
      try {
        await deleteActivity(expense.id.toString());
        console.log('Трата успешно удалена из базы данных');
      } catch (error) {
        console.error('Ошибка удаления траты из базы данных:', error);
      }
    } 
      console.log('Просто удаляем строку из таблицы');
      removeExpense(expense.id, currentDay);
      setDeletedRows([...deletedRows, expense.id]); // Добавляем id удаленной строки    
  };
    
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} id="table">
      <div>День {currentDay + 1}</div>

        {/* <Input placeholder="Basic usage" />
        <Input defaultValue={expense.dayGuid} /> */}
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
            !deletedRows.includes(expense.id) &&
            <tr key={expense.id}>
              <td>
                <Input
                  defaultValue={expense.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                />
              </td>
              <td>
                  <Select
                    defaultValue={expense.categoryTitle}
                    onChange={(value) => handleCategoryChange(index, value)}
                  >
                  {categories.map((category, catIndex) => (
                    <Select.Option key={catIndex} value={category.title}>
                      {category.title}
                    </Select.Option>
                  ))}
                </Select>
              </td>
              <td>
                  <Select
                    mode="multiple"
                    defaultValue={expense.participants}
                    onChange={(value) => handleParticipantsChange(index, value)}
                  >
                  {totalparticipants && totalparticipants.map((participant, participantIndex) => (
                    <Select.Option key={participantIndex} value={participant}>
                      {participant}
                    </Select.Option>
                  ))}
                </Select>
              </td>
              <td>
                <Select
                    defaultValue={expense.payers}
                    onChange={(value) => handlePayersChange(index, value)}
                  >
                  {totalparticipants.map((participant, participantIndex) => (
                    <Select.Option key={participantIndex} value={participant}>
                      {participant}
                    </Select.Option>
                  ))}
                </Select>
              </td>
              <td>
                <Input
                  type="number"
                  defaultValue={expense.pricePerOne}
                  onChange={(e) => handlePricePerOneChange(index, e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  defaultValue={expense.totalPrice}
                  onChange={(e) => handleTotalPriceChange(index, e.target.value)}
                />
              </td>
              <td>
                <Button onClick={() => handleSave(index)} icon={<SaveOutlined />} />
              </td>
              <td>
                <Button onClick={() => handleDelete(expense)} icon={<DeleteOutlined />} />
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
