import React, { useEffect, useState, useRef } from 'react';
import YandexMap from "../../components/YandexMap";
import { TPoint } from "../../types/TPoint";
import { DatePicker, Button, Input, Select } from 'antd';
import './customDatePicker.css';
import styles from "./index.module.css";

import { sendEvent } from "../../utils/Metriks";
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
const { RangePicker } = DatePicker;
const { Option } = Select;

const Map = () => {
    const [points, setPoints] = useState<TPoint[]>([]);
    const [dateRange, setDateRange] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]); // Хранение данных таблицы
    const [tableRows, setTableRows] = useState<number>(0); // Количество строк в таблице
    const [selectedTeam, setSelectedTeam] = useState<string>(''); // Выбранная команда
    const [currentPage, setCurrentPage] = useState<number>(1); // Текущая страница
    const itemsPerPage = 10; // Количество элементов на странице
    const blockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            setPoints([{ x: 55.75, y: 37.57 }, { x: 56.75, y: 36.57 }, { x: 54.32, y: 36.16 }]);
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
        setExpenses([...expenses, { action: '', participants: '', payer: '', costPerPerson: '', totalCost: '' }]);
        setTableRows(tableRows + 1); // Увеличиваем количество строк на 1 при добавлении траты
    };

    const handleExpenseChange = (index: number, key: string, value: string) => {
        const updatedExpenses = [...expenses];
        updatedExpenses[index][key] = value;
        setExpenses(updatedExpenses);
    };

    const handleClickStatistic = () => {
        sendEvent('reachGoal', 'StatisticButtonClick');
        const fullWidthContainer = document.querySelector('.fullWidthContainer');

        const statisticElement = document.getElementById('statisticElement');

        // Если элемент найден, прокручиваем страницу до него
        if (statisticElement) {
            statisticElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Данные для диаграммы "Расходы по команде"
    const teamExpensesData = [
        { name: 'Вася', value: 10000 },
        { name: 'Петя', value: 7000 },
        { name: 'Дима', value: 3000 },
    ];

    // Данные для диаграммы "Расходы по категориям"
    const categoryExpensesData = [
        { name: 'Жилье', value: 10000 },
        { name: 'Еда', value: 5000 },
        { name: 'Экскурсия', value: 3000 },
        { name: 'Прочее', value: 2000 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Функция для изменения текущей страницы
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Фильтрация данных для отображения на текущей странице
    const paginatedExpenses = expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (

        <div className={styles.container}>
            {/* Выбор команды */}
            <div className={styles.mapContainer}>
                <YandexMap points={points} />
            </div>
            <div className={styles.block}>
                <div>
                    <div className={styles.textdata}>Дата</div>
                    <div className={styles.datePicker}>
                        <RangePicker onChange={handleDateChange} />
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table} id="table">
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
                        {paginatedExpenses.map((expense, index) => (
                            <tr key={index}>
                                <td><Input value={expense.action} onChange={(e) => handleExpenseChange(index, 'action', e.target.value)} /></td>
                                <td><Input value={expense.participants} onChange={(e) => handleExpenseChange(index, 'participants', e.target.value)} /></td>
                                <td><Input value={expense.payer} onChange={(e) => handleExpenseChange(index, 'payer', e.target.value)} /></td>
                                <td><Input type="number" value={expense.costPerPerson} onChange={(e) => handleExpenseChange(index, 'costPerPerson', e.target.value)} /></td>
                                <td><Input type="number" value={expense.totalCost} onChange={(e) => handleExpenseChange(index, 'totalCost', e.target.value)} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Button onClick={addExpense} className={styles.tablebutton}>Добавить трату</Button>
                </div>
                <Select defaultValue=""
                        className={styles.customSelect}
                        onChange={(value) => setSelectedTeam(value)}>
                    <Option value="">Выберите команду</Option>
                    <Option value="team1">Команда 1</Option>
                    <Option value="team2">Команда 2</Option>
                    <Option value="team3">Команда 3</Option>
                </Select>
                <div className={styles.buttonsContainer}>
                    <Button type="primary" style={{ backgroundColor: '#00B58A' }}>Сохранить</Button>
                    <Button type="primary" style={{ backgroundColor: '#00A9B4', marginLeft: '10px' }} onClick={handleClickStatistic}>Статистика</Button>
                </div>
            </div>

            <div id="statisticElement" className={styles.fullWidthContainer}>
                <>
                    <div className={styles.fullWidthContent}>
                        <div className={styles.chartContainer}>
                            <div>
                                <h3>Расходы по команде</h3>
                                <PieChart width={400} height={400}>
                                    <Pie dataKey="value" isAnimationActive={false} data={teamExpensesData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label>
                                        {teamExpensesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <Tooltip />
                                </PieChart>
                            </div>
                            <div className={styles.legendContainer}>
                                {teamExpensesData.map((entry, index) => (
                                    <div key={`legend-${index}`}>
                                        <span className={styles.legendColor} style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span>{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.chartContainer}>
                            <div>
                                <h3>Расходы по категориям</h3>
                                <PieChart width={400} height={400}>
                                    <Pie dataKey="value" isAnimationActive={false} data={categoryExpensesData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label>
                                        {categoryExpensesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <Tooltip />
                                </PieChart>
                            </div>
                            <div className={styles.legendContainer}>
                                {categoryExpensesData.map((entry, index) => (
                                    <div key={`legend-${index}`}>
                                        <span className={styles.legendColor} style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span>{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </div>
    );
};

export default Map;
