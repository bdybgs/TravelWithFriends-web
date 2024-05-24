import React, { useState, useEffect,useRef } from 'react';
import { Map, Placemark, SearchControl, YMaps } from "@pbe/react-yandex-maps";
import styles from './index.module.css';
import { TPoint } from "../../types/TPoint";
import axios, { AxiosError } from 'axios';

type IProps = {
    points: TPoint[],
    textPoints: string[],
    setSearchRequestString: React.Dispatch<React.SetStateAction<string>> // Добавляем setSearchRequestString в тип пропсов
}

interface SearchResult {
    geometry: {
        getCoordinates: () => number[],
    }
}

const YandexMap = ({ points, textPoints, setSearchRequestString }: IProps) => { // Добавляем setSearchRequestString в параметры компонента
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [searchControl, setSearchControl] = useState<any>(null);
    
    const handleSearchResult = (result: SearchResult | null) => {
        setSearchResult(result);
    };

    const handleResultSelect = (result: any) => {
        console.log("Selected:", result);
        alert('Щёлк ' + result);
        setSearchResult(result);
    };

    const handleMapLoad = (ymaps: any) => {
        setMapInstance(ymaps);
    };

    const handleSearchControlLoad = (ref: any) => {
        setSearchControl(ref);
    };

    const handlePlacemarkClick = () => {
        alert('Событие произошло');
    };

    useEffect(() => {
        if (searchControl) {
            searchControl.events.add('resultselect', (e: any) => handleResultSelect(e.get('result')));
            searchControl.events.add('resultshow', (e: any) => handleSearchResult(e.get('result')));
            searchControl.events.add('resultselect', function(e: { get: (arg0: string) => any; }) {
                const requestString = searchControl.getRequestString(); // Переименовываем переменную, чтобы не перекрыть внешнюю переменную
                alert(requestString);
                var results = searchControl.getResultsArray();
                setSearchRequestString(requestString); // Устанавливаем searchRequestString через переданную функцию
                var selected = e.get('index');
                var point = results[selected].geometry.getCoordinates();
                alert(point);
            });
        }
    }, [searchControl, setSearchRequestString]); // Добавляем setSearchRequestString в зависимости useEffect
    
    useEffect(() => {
        console.log(textPoints);
    }, [textPoints]);

    return (
        <div className={styles.wrapper}>
            <YMaps query={{ apikey: "06bd4b2b-084a-4bd2-841b-9088796a24af",
                suggest_apikey: "fcb7c517-1299-4249-b856-2880e082b027"
            }}>
                <Map
                    style={{}}
                    defaultState={{ center: [54.75, 37.57], zoom: 9 }}
                    instanceRef={(ref) => ref && handleMapLoad(ref)}
                >
                    {mapInstance && (
                        <SearchControl
                            options={{ float: 'left' }}
                            instanceRef={(ref) => ref && handleSearchControlLoad(ref)}
                        />
                    )}
                    {points.map(({ x, y }) => (
                        <Placemark
                            key={`${x}-${y}`}
                            options={{ hasHint: true }}
                            defaultGeometry={[x, y]}
                            onClick={handlePlacemarkClick}
                        />
                    ))}
                    {searchResult && searchResult.geometry && (
                        <Placemark
                            geometry={searchResult.geometry.getCoordinates()}
                            options={{ hasHint: true }}
                            //onClick={handlePlacemarkClick}
                        />
                    )}
                </Map>
            </YMaps>
        </div>
    );
};

export default YandexMap;
