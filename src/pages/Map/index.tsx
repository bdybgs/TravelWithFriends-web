import React, { useEffect, useState, useRef } from 'react';
import YandexMap from "../../components/YandexMap";
import { TPoint } from "../../types/TPoint";
import { DatePicker, Button, Input, Select } from 'antd';
import './customDatePicker.css';
import styles from "./index.module.css";
import { useNavigate, useParams } from 'react-router-dom';

import { getTrip, addParticipant } from "../../services/trip.service";

import { sendEvent } from "../../utils/Metriks";
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Map = () => {
    const { tripId } = useParams(); // Извлекаем параметр tripId из URL
    const navigate = useNavigate();
    
    const [tripData, setTripData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Используем tripId для установки начального значения поля для названия
    const [title, setTitle] = useState<string>(tripId ? tripId : '');
    const [participantEmail, setParticipantEmail] = useState<string>('');

    const [points, setPoints] = useState<TPoint[]>([]);
    const [dateRange, setDateRange] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]); // Хранение данных таблицы
    const [tableRows, setTableRows] = useState<number>(0); // Количество строк в таблице
    const [selectedTeam, setSelectedTeam] = useState<string>(''); // Выбранная команда
    const [currentPage, setCurrentPage] = useState<number>(1); // Текущая страница
    const itemsPerPage = 10; // Количество элементов на странице
    const blockRef = useRef<HTMLDivElement>(null);
    const [numOfParticipants, setNumOfParticipants] = useState<number>(0);
    const [selectedDay, setSelectedDay] = useState(0);

    const [currentDay, setCurrentDay] = useState(0); // Индекс текущего дня
    const totalDays = 3; // Общее количество дней
    
    const [expensesByDay, setExpensesByDay] = useState<{ [key: number]: any[] }>({
        0: [],
        1: [],
        2: []
    });
    

    useEffect(() => {
        setTimeout(() => {
            setPoints([{ x: 55.75, y: 37.57 }, { x: 56.75, y: 36.57 }, { x: 54.32, y: 36.16 }]);
        }, 2000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!tripId || tripId === '000') return; // Если tripId не определен, не делаем запрос
                const trip = await getTrip(tripId);
                setTripData(trip);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching trip data:', error);
            }
        };
    
        fetchData();
    }, [tripId]);
    
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
        const newExpense = { id: Date.now(), action: '', participants: '', payer: '', costPerPerson: '', totalCost: '', day: currentDay };
        setExpensesByDay(prevState => ({
            ...prevState,
            [currentDay]: [...prevState[currentDay], newExpense]
        }));
        setTableRows(tableRows + 1);
    };
    
    const removeExpense = (id: number, day: number) => {
        const updatedExpenses = expensesByDay[day].filter(expense => expense.id !== id);
        setExpensesByDay(prevState => ({
            ...prevState,
            [day]: updatedExpenses
        }));
    };
    
    const handleExpenseChange = (id: number, key: string, value: string) => {
        const updatedExpenses = expenses.map(expense => {
            if (expense.id === id) {
                return { ...expense, [key]: value };
            }
            return expense;
        });
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

    const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10); // Преобразование строки в число с основанием 10
        setNumOfParticipants(value); 
    };
    
    const handleAddParticipant = () => {
        if (!tripId) {
            alert('Невозможно добавить участника: tripId не определен.');
            return;
        }
    
        if (!participantEmail.trim()) {
            // Если email пустой, показываем сообщение об ошибке
            // Можно использовать уведомление или другой способ оповещения пользователя
            alert('Пожалуйста, введите email участника.');
            return;
        }
        addParticipant(tripId, participantEmail)
            .then((response) => {
                // Обновляем данные о трипе после успешного добавления участника
                if (response) {
                    setTripData(response);
                    setParticipantEmail(''); // Очищаем поле ввода email
                    alert('Участник успешно добавлен.');
                }
            })
            .catch((error) => {
                console.error('Error adding participant:', error);
                alert('Произошла ошибка при добавлении участника. Пожалуйста, попробуйте еще раз.');
            });
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
            <div className={styles.mapContainer}>
                <YandexMap points={points} />
            </div>
            <div className={styles.block}>
                
                <div>
                    <div className={styles.textdata}>Название: {tripData.title}</div>
                    <div className={styles.textdata}>Число участников: {tripData.numOfParticipants}</div>
                    <div className={styles.textdata}>Участники: {tripData.participants ? tripData.participants.join(', ') : ''}</div>
                    <div className={styles.textdata}>Город: {tripData.city}</div>
                    <div className={styles.textdata}>Отель: {tripData.hotelTitle}</div>
                    
                    <div className={styles.addParticipantContainer}>
                        <Input 
                            className={styles.inputField} 
                            placeholder="Введите email участника" 
                            value={participantEmail} 
                            onChange={(e) => setParticipantEmail(e.target.value)} // Добавляем обработчик изменения значения email участника
                        />
                        <Button onClick={handleAddParticipant} className={styles.addButton}>ОК</Button>
                    </div>

                    <div className={styles.textdata}>Дата</div>
                    <div className={styles.datePicker}><RangePicker onChange={handleDateChange} />
                    </div>

                </div>
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
                        {expensesByDay[currentDay].map((expense, index) => (
                            <tr key={index}>
                                <td><Input value={expense.action} onChange={(e) => handleExpenseChange(expense.id, 'action', e.target.value)} /></td>
                                <td><Input value={expense.participants} onChange={(e) => handleExpenseChange(expense.id, 'participants', e.target.value)} /></td>
                                <td><Input value={expense.payer} onChange={(e) => handleExpenseChange(expense.id, 'payer', e.target.value)} /></td>
                                <td><Input type="number" value={expense.costPerPerson} onChange={(e) => handleExpenseChange(expense.id, 'costPerPerson', e.target.value)} /></td>
                                <td><Input type="number" value={expense.totalCost} onChange={(e) => handleExpenseChange(expense.id, 'totalCost', e.target.value)} /></td>
                                <Button onClick={() => removeExpense(expense.id, currentDay)}>Удалить</Button>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                    <Button onClick={addExpense} className={styles.tablebutton}>Добавить трату</Button>

                    <Button onClick={() => setCurrentDay((currentDay - 1 + totalDays) % totalDays)}>
                        <i className="fas fa-chevron-left"></i>
                    </Button>
                    <Button onClick={() => setCurrentDay((currentDay + 1) % totalDays)}>
                        <i className="fas fa-chevron-right"></i>
                    </Button>


                </div>

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
