import { useState, useEffect } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import styles from "./index.module.css";

interface StatisticsProps {
    teamExpensesData: { name: string; value: number }[];
    categoryExpensesData: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const useLoadingData = <T,>(data: T | undefined | null) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (data !== undefined && data !== null) {
            setIsLoading(false);
        }
    }, [data]);

    return isLoading;
};

const Statistics: React.FC<StatisticsProps> = ({ teamExpensesData, categoryExpensesData }) => {
    const isLoadingTeamData = useLoadingData(teamExpensesData);
    const isLoadingCategoryData = useLoadingData(categoryExpensesData);

    if (isLoadingTeamData || isLoadingCategoryData) {
        return <div>Загрузка...</div>;
    }

    return (
        <div id="statisticElement" className={styles.fullWidthContainer}>
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
        </div>
    );
};

export default Statistics;
