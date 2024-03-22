import React, {useEffect, useState} from 'react';
import YandexMap from "../../components/YandexMap";
import {TPoint} from "../../types/TPoint";
import {set} from "@pbe/react-yandex-maps/typings/util/set";

const Home = () => {
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
        <>
            <YandexMap points={points}/>
        </>
    );
};

export default Home;