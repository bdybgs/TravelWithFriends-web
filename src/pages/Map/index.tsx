import React, {useEffect, useState} from 'react';
import YandexMap from "../../components/YandexMap";
import {TPoint} from "../../types/TPoint";
import {set} from "@pbe/react-yandex-maps/typings/util/set";
import styles from "./index.module.css";

const Map = () => {
    const [points, setPoints] = useState<TPoint[]>([]);

    useEffect(() => {
       // const fetchPoints = fetch(apiUrl);
        // Точки придут из вашего бекенда и тут ты их получишь и присвоишь в points
        //    setPoints(fetchPoints);
        setTimeout(() => {
            setPoints([{ x: 55.75, y: 37.57 }, { x: 56.75, y: 36.57 }, {x: 54.32    , y: 36.16}]);
        }, 2000);
    });

    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <YandexMap points={points}/>
            </div>
            <div className={styles.block}>
                <h1>AAAAAAAAAAAAAAAAAAAAA</h1>
                {/* Ваш блок с содержимым */}
            </div>
        </div>
    );
};

export default Map;