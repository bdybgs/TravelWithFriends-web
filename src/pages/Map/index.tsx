import React, { useEffect, useState, useRef } from 'react';
import YandexMap from "../../components/YandexMap";
import { TPoint } from "../../types/TPoint";
import Select from 'react-select';

import { DatePicker, Button, Input } from 'antd';
import './customDatePicker.css';
import styles from "./index.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getTrip, addParticipant, getDays, getCategories} from "../../services/trip.service";
import { getActiviesByDay,getStat } from "../../services/activity.service";
import { sendEvent } from "../../utils/Metriks";
import ExpenseTable from './ExpenseTable';
import Statistics from './Statistics';

const Map = () => {
    const { tripId } = useParams(); // Извлекаем параметр tripId из URL

    const [tripData, setTripData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [participantEmail, setParticipantEmail] = useState<string>('');

    const [points, setPoints] = useState<TPoint[]>([]);
    const [textPoints, setTextPoints] = useState<string[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]); // Хранение данных таблицы
    const [tableRows, setTableRows] = useState<number>(0); // Количество строк в таблице
   
    const blockRef = useRef<HTMLDivElement>(null);


    const [currentDay, setCurrentDay] = useState(0); // Индекс текущего дня
    const [totalDays, setTotalDays] = useState<number>(3);
    
    const [teamExpensesData, setTeamExpensesData] = useState([]);
    const [categoryExpensesData, setCategoryExpensesData] = useState([]);

    // Добавляем состояние для хранения соответствия между индексами дней и их GUID'ами
    const [dayGuids, setDayGuids] = useState<{ [key: number]: string }>({});
        
    // Изменения в expensesByDay: теперь используем GUID дня в качестве ключа
    const [expensesByDay, setExpensesByDay] = useState<{ [key: string]: any[] }>({});

    const [totalparticipants, setTotalParticipants] = useState<string[]>([]);

    const [searchRequestString, setSearchRequestString] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    
    useEffect(() => {
        setTimeout(() => {
            setPoints([{ x: 55.75, y: 37.57 }, { x: 56.75, y: 36.57 }, { x: 54.32, y: 36.16 }]);
        }, 2000);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const pointB = "Москва, Красная площадь";
            const pointC = "Москва, Павелецкий вокзал";
            const pointD = "Москва, Таганская";
    
            // Создаем массив текстовых точек
            const textPoints = Array.of(pointB, pointC, pointD);
    
            // Устанавливаем массив текстовых точек в state
            setTextPoints(textPoints);
        }, 2000);
    }, []);
    

    // Добавляем useEffect для вывода в консоль при получении значения searchRequestString от карты
    useEffect(() => {
        console.log('Map component received searchRequestString:', searchRequestString);
    }, [searchRequestString]);

    // Добавляем useEffect для обработки searchRequestString и создания новой трата в таблице
    useEffect(() => {
        if (searchRequestString) {
            // Вызываем функцию addExpense для создания новой трата
            addExpenseBySerch(searchRequestString);
        }
    }, [searchRequestString]);


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
                console.log("внутри юзэффекта: "+ activities.length)
                // Обновляем количество строк в таблице в зависимости от количества активностей
                setTableRows(activities.length);
                
            } catch (error) {
                console.error('Ошибка при получении активностей для дня:', error);
            }
        };

        fetchData();
        console.log("expensesByDay после обновления:", expensesByDay[dayGuids[currentDay]]);
    }, [currentDay, dayGuids]);

    useEffect(() => {
        // Проверяем, есть ли данные о поездке
        if (tripData.participants) {
            setTotalParticipants(tripData.participants);
        }
    }, [tripData.participants]);


    useEffect(() => {
        // Получаем высоту таблицы
        const tableHeight = document.getElementById('table')?.offsetHeight || 0;
        // Устанавливаем высоту блока
        if (blockRef.current) {
            blockRef.current.style.height = `calc(${tableHeight}px + 20px )` + 7000; // Добавляем немного дополнительной высоты
        }
    }, [tableRows]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!tripId || tripId === '000') return;
    
                const statData = await getStat(tripId);
                console.log("Статистика получена:", statData);
                if (statData) {
                    setTeamExpensesData(statData.teamExpensesData);
                    setCategoryExpensesData(statData.categoryExpensesData);
                } else {
                    console.log("Данные статистики пусты.");
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };
    
        fetchData();
    }, [tripId]);
    
    const addExpenseBySerch = (searchLoc: string) => {
        const newExpense = { 
            id: Date.now(), 
            title: searchLoc, 
            fromSearch: true,
            categoryTitle: '', 
            participants: '', 
            payers: '', 
            pricePerOne: '', 
            totalPrice: '', 
            day: currentDay 
        };
        
        if (!expensesByDay[dayGuids[currentDay]]) {
            setExpensesByDay(prevState => ({
                ...prevState,
                [dayGuids[currentDay]]: [newExpense]
            }));
        } else {
            setExpensesByDay(prevState => ({
                ...prevState,
                [dayGuids[currentDay]]: [...prevState[dayGuids[currentDay]], newExpense]
            }));
        }

        // Обновляем состояние expenses, передавая новый массив расходов
        setExpenses([...expenses, newExpense]);

        setTableRows(tableRows + 1);
    };

    const addExpense = () => {
        const newExpense = { 
            id: Date.now(), 
            title: '', 
            fromSearch: false,
            categoryTitle: '', 
            participants: '', 
            payers: '', 
            pricePerOne: '', 
            totalPrice: '', 
            day: currentDay 
        };
        
        if (!expensesByDay[dayGuids[currentDay]]) {
            setExpensesByDay(prevState => ({
                ...prevState,
                [dayGuids[currentDay]]: [newExpense]
            }));
        } else {
            setExpensesByDay(prevState => ({
                ...prevState,
                [dayGuids[currentDay]]: [...prevState[dayGuids[currentDay]], newExpense]
            }));
        }

        // Обновляем состояние expenses, передавая новый массив расходов
        setExpenses([...expenses, newExpense]);

        setTableRows(tableRows + 1);
    };
          
    const removeExpense = (id: number, day: number) => {
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

    const handleClickStatistic = async () => {
        sendEvent('reachGoal', 'StatisticButtonClick');
        const fullWidthContainer = document.querySelector('.fullWidthContainer');
    
        const statisticElement = document.getElementById('statisticElement');
    
        // Если элемент найден, прокручиваем страницу до него
        if (statisticElement) {
            statisticElement.scrollIntoView({ behavior: 'smooth' });
        }
    
        try {
            if (!tripId || tripId === '000') return;
    
            const statData = await getStat(tripId);
            console.log("Статистика получена:", statData);
            if (statData) {
                setTeamExpensesData(statData.teamExpensesData);
                setCategoryExpensesData(statData.categoryExpensesData);
            } else {
                console.log("Данные статистики пусты.");
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };
    
    const handleAddParticipant = () => {
        if (!tripId) {
            alert('Невозможно добавить участника: tripId не определен.');
            return;
        }
    
        if (!participantEmail.trim()) {
            alert('Пожалуйста, введите email участника.');
            return;
        }
        addParticipant(tripId, participantEmail)
            .then((response) => {
                // Обновляем данные о трипе после успешного добавления участника
                if (response) {
                    setTripData(response);
                    setParticipantEmail(''); // Очищаем поле ввода email
                    setErrorMessage(null); // Сбрасываем сообщение об ошибке
                    alert('Участник успешно добавлен.');
                }
            })
            .catch((error) => {
                console.error('Error adding participant:', error);
                setErrorMessage('Участник не найден. Пожалуйста, попробуйте еще раз.');
            });
    };

    const handleClickShowRoute = () => {

    }
    
    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
            <div className={styles.map}>
                    <YandexMap points={points} textPoints = {textPoints}setSearchRequestString={setSearchRequestString} />
                </div>
                <div className={styles.infoBlock}>
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
                                onChange={(e) => setParticipantEmail(e.target.value)}
                            />
                            <Button onClick={handleAddParticipant} className={styles.addButton}>ОК</Button>
                            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                        </div>
    
                        <div className={styles.textdata}>Дата {tripData.dateStart} - {tripData.dateEnd}</div>
                    </div>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <div className={styles.block}>
                    <div className={styles.tableWrapper}>
                        <ExpenseTable
                            expenses={expensesByDay[dayGuids[currentDay]]}
                            currentDay={currentDay}
                            addExpense={addExpense}
                            removeExpense={removeExpense}
                            handleExpenseChange={handleExpenseChange}
                            totalparticipants={totalparticipants}
                            dayGuid={dayGuids[currentDay]}
                        />
                    </div>
                    <div className={styles.buttonsContainer}>
                    <div className={styles.navigationButtons}>
                        <Button onClick={() => setCurrentDay((currentDay - 1 + totalDays) % totalDays)}>
                            <FaChevronLeft style={{ color: 'black' }} />
                        </Button>
                        <Button onClick={() => setCurrentDay((currentDay + 1) % totalDays)}>
                            <FaChevronRight style={{ color: 'black' }} />
                        </Button>
                    </div>
                        <Button type="primary" style={{ backgroundColor: '#00A9B4', marginLeft: '10px' }} onClick={handleClickShowRoute}>На карте</Button>
                        <Button type="primary" style={{ backgroundColor: '#00A9B4', marginLeft: '10px' }} onClick={handleClickStatistic}>Статистика</Button>
                    </div>
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