import React, { useEffect, useState, useRef } from 'react';
import YandexMap from "../../components/YandexMap";
import { TPoint } from "../../types/TPoint";
import { DatePicker, Button, Input, Select } from 'antd';
import './customDatePicker.css';
import styles from "./index.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getTrip, addParticipant, getDays, getCategories, getActiviesByDay } from "../../services/trip.service";

import { sendEvent } from "../../utils/Metriks";
import ExpenseTable from './ExpenseTable';
import Statistics from './Statistics';

const Map = () => {
    const { tripId } = useParams(); // Извлекаем параметр tripId из URL

    const [tripData, setTripData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [participantEmail, setParticipantEmail] = useState<string>('');

    const [points, setPoints] = useState<TPoint[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]); // Хранение данных таблицы
    const [tableRows, setTableRows] = useState<number>(0); // Количество строк в таблице
   
    const blockRef = useRef<HTMLDivElement>(null);


    const [currentDay, setCurrentDay] = useState(0); // Индекс текущего дня
    const [totalDays, setTotalDays] = useState<number>(3);
    
    // Добавляем состояние для хранения соответствия между индексами дней и их GUID'ами
    const [dayGuids, setDayGuids] = useState<{ [key: number]: string }>({});
        
    // Изменения в expensesByDay: теперь используем GUID дня в качестве ключа
    const [expensesByDay, setExpensesByDay] = useState<{ [key: string]: any[] }>({});
    
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
    

 // useEffect для получения дней и создания соответствия между индексами и GUID'ами
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!tripId || tripId === '000') return;

                const trip = await getTrip(tripId);
                setTripData(trip);
                setIsLoading(false);

                const days = await getDays(tripId);

                // Создаем объект для хранения соответствия между индексами дней и GUID'ами
                const dayGuidsObject: { [key: number]: string } = {};
                days.forEach((dayGuid: string, index: number) => {
                    dayGuidsObject[index] = dayGuid;
                });
                setDayGuids(dayGuidsObject);

                // Создаем пустые массивы расходов для каждого дня, используя GUID дня в качестве ключа
                const expensesByDayObject: { [key: string]: any[] } = {};
                days.forEach((dayGuid: string) => {
                    expensesByDayObject[dayGuid] = [];
                });
                setExpensesByDay(expensesByDayObject);

                // Обновляем общее количество дней после получения данных с сервера
                setTotalDays(days.length);
            } catch (error) {
                console.error('Ошибка при получении данных о поездке:', error);
            }
        };

        fetchData();
    }, [tripId]);

    // useEffect для загрузки активностей текущего дня
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!tripId || tripId === '000') return;

                const activities = await getActiviesByDay(dayGuids[currentDay]); // Используем GUID дня для запроса активностей

                // Обновляем состояние expensesByDay для текущего дня с полученными активностями
                setExpensesByDay(prevState => ({
                    ...prevState,
                    [dayGuids[currentDay]]: activities
                }));
                
                // Обновляем количество строк в таблице в зависимости от количества активностей
                setTableRows(activities.length);
            } catch (error) {
                console.error('Ошибка при получении активностей для дня:', error);
            }
        };

        fetchData();
    }, [currentDay, dayGuids]);




    useEffect(() => {
        // Получаем высоту таблицы
        const tableHeight = document.getElementById('table')?.offsetHeight || 0;
        // Устанавливаем высоту блока
        if (blockRef.current) {
            blockRef.current.style.height = `calc(${tableHeight}px + 20px )` + 7000; // Добавляем немного дополнительной высоты
        }
    }, [tableRows]);



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

                    <div className={styles.textdata}>Дата {tripData.dateStart} - {tripData.dateEnd}</div>
                </div>
                <div >
                    <ExpenseTable
                        expenses={expensesByDay[dayGuids[currentDay]]} 
                        currentDay={currentDay}
                        addExpense={addExpense}
                        removeExpense={removeExpense}
                        handleExpenseChange={handleExpenseChange}
                        />
                    <Button onClick={() => setCurrentDay((currentDay - 1 + totalDays) % totalDays)}>
                        <FaChevronLeft style={{ color: 'black' }} />
                    </Button>
                    <Button onClick={() => setCurrentDay((currentDay + 1) % totalDays)}>
                        <FaChevronRight style={{ color: 'black' }} />
                    </Button>
                </div>

                <div className={styles.buttonsContainer}>
                    <Button type="primary" style={{ backgroundColor: '#00B58A' }}>Сохранить</Button>
                    <Button type="primary" style={{ backgroundColor: '#00A9B4', marginLeft: '10px' }} onClick={handleClickStatistic}>Статистика</Button>
                </div>
            </div>

            <Statistics
                teamExpensesData={teamExpensesData}
                categoryExpensesData={categoryExpensesData}
            />
        </div>
    );
};

export default Map;
