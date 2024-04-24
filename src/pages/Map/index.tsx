import React, {useEffect, useState, useRef} from 'react';
import YandexMap from "../../components/YandexMap";
import {TPoint} from "../../types/TPoint";
import {DatePicker, Button, Input} from 'antd';
import './customDatePicker.css';
import styles from "./index.module.css";

const {RangePicker} = DatePicker;

const Map = () => {
    const [points, setPoints] = useState<TPoint[]>([]);
    const [dateRange, setDateRange] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]); // Хранение данных таблицы
    const [tableRows, setTableRows] = useState<number>(0); // Количество строк в таблице
    const blockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            setPoints([{x: 55.75, y: 37.57}, {x: 56.75, y: 36.57}, {x: 54.32, y: 36.16}]);
        }, 2000);
    }, []);

    useEffect(() => {
        // Получаем высоту таблицы
        const tableHeight = document.getElementById('table')?.offsetHeight || 0;
        // Устанавливаем высоту блока
        if (blockRef.current) {
            blockRef.current.style.height = `calc(${tableHeight}px + 20px )` + 7000; // Добавляем немного дополнительной высоты
        }
    }, [tableRows]);

    const handleDateChange = (dates: any) => {
        setDateRange(dates);
    };

    const addExpense = () => {
        setExpenses([...expenses, {action: '', participants: '', payer: '', costPerPerson: '', totalCost: ''}]);
        setTableRows(tableRows + 1); // Увеличиваем количество строк на 1 при добавлении траты
    };

    const handleExpenseChange = (index: number, key: string, value: string) => {
        const updatedExpenses = [...expenses];
        updatedExpenses[index][key] = value;
        setExpenses(updatedExpenses);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <YandexMap points={points}/>
            </div>
            <div className={styles.block} ref={blockRef}>
                <div>
                    <div className={styles.textdata}>Дата</div>
                    <div className={styles.datePicker}>
                        <RangePicker onChange={handleDateChange}/>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table} id="table">
                        <thead>
                        <tr>
                            <th>Действие</th>
                            <th>Участники</th>
                            <th>Кто оплачивал</th>
                            <th>Стоимость за одного</th>
                            <th>Итоговая стоимость</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={index}>
                                <td><Input value={expense.action}
                                           onChange={(e) => handleExpenseChange(index, 'action', e.target.value)}/></td>
                                <td><Input value={expense.participants}
                                           onChange={(e) => handleExpenseChange(index, 'participants', e.target.value)}/>
                                </td>
                                <td><Input value={expense.payer}
                                           onChange={(e) => handleExpenseChange(index, 'payer', e.target.value)}/></td>
                                <td><Input type="number" value={expense.costPerPerson}
                                           onChange={(e) => handleExpenseChange(index, 'costPerPerson', e.target.value)}/>
                                </td>
                                <td><Input type="number" value={expense.totalCost}
                                           onChange={(e) => handleExpenseChange(index, 'totalCost', e.target.value)}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Button onClick={addExpense} className={styles.tablebutton}>Добавить трату</Button>
                </div>
                <div className={styles.buttonsContainer}>
                    <Button type="primary" style={{backgroundColor: '#00B58A'}}>Сохранить</Button>
                    <Button type="primary" style={{backgroundColor: '#00A9B4', marginLeft: '10px'}}>Статистика</Button>
                </div>
            </div>
        </div>
    );
};

export default Map;
