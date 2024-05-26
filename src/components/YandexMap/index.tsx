import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import styles from './index.module.css';
import { TPoint } from "../../types/TPoint";

type IProps = {
    points: TPoint[],
    textPoints: string[],
    setSearchRequestString: React.Dispatch<React.SetStateAction<string>>,
    mapUpdateTrigger: boolean
}

interface SearchResult {
    geometry: {
        getCoordinates: () => number[],
    }
}

const YandexMap = ({points, textPoints, setSearchRequestString, mapUpdateTrigger  }: IProps) => {
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const mapRef = useRef<any>(null);
    const multiRouteRef = useRef<any>(null);
    const searchControlRef = useRef<any>(null);
    const [isTextPointsReady, setIsTextPointsReady] = useState(false);

    const [selectedResult, setSelectedResult] = useState<any>(null);

    const handleResultSelect = (e: any) => {
        const result = e.get('target').getResultsArray()[e.get('index')];
        setSelectedResult(result);
        setSearchResult(result);
    };

    useEffect(() => {
        if (selectedResult && typeof selectedResult === 'object') {
            const resultText = selectedResult.properties.get('text');
            setSearchRequestString(resultText);
        }
    }, [selectedResult]);

    useEffect(() => {
        // выполняется вторым 
        console.log("2) textPoints: " + textPoints)
        console.log("2) Первая точка из textPoints: " + textPoints[0]);
        setIsTextPointsReady(true); // Устанавливаем готовность textPoints
    }, [textPoints]);

    const addMultiRoute = (ymaps: any) => {
        // выполняется первым 
        const pointA = textPoints[0];
        const pointB = textPoints[1];
        const pointC = textPoints[2];
        const pointD = textPoints[3];
        const pointE = textPoints[4];
        // const pointB = "Москва, Красная площадь";
        // const pointC = "Москва, Павелецкий вокзал";
        // const pointD = "Москва, Таганская";

        console.log("В addMultiRoute) точка А: " + pointA);
        console.log("В addMultiRoute) textPoints: " + textPoints);
        console.log("В addMultiRoute) Первая точка из textPoints: " + textPoints[0]);

        if (multiRouteRef.current && mapRef.current) {
            mapRef.current.geoObjects.remove(multiRouteRef.current);
        }

        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints: [pointA, pointB, pointC, pointD, pointE],
                params: {
                    routingMode: "pedestrian"
                }
            },
            {
                boundsAutoApply: true
            }
        );

        if (mapRef.current) {
            mapRef.current.geoObjects.add(multiRoute);
            multiRouteRef.current = multiRoute;
        }
    };

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.controls.add('searchControl');
            mapRef.current.events.add('boundschange', () => {
                if (searchControlRef.current) {
                    //searchControlRef.current.setBounds(mapRef.current.getBounds());
                }
            });
        }
    }, []);

    useEffect(() => {
        if (isTextPointsReady && mapRef.current && mapRef.current.ymaps) {
            addMultiRoute(mapRef.current.ymaps);
        }
        console.log(mapUpdateTrigger);
    }, [isTextPointsReady, mapUpdateTrigger]);

    return (
        <div key={mapUpdateTrigger ? "true" : "false"} className={styles.wrapper}> {/* Обновляем ключ */}
            <YMaps query={{ apikey: '7c779eb6-845b-4c78-a612-a2397737206e' }}>
                <Map
                    defaultState={{ center: [55.749, 37.524], zoom: 9 }}
                    width="100%"
                    height="400px"
                    // @ts-ignore
                    instanceRef={mapRef}
                    onLoad={(ymaps: any) => {
                        if (isTextPointsReady) {
                            addMultiRoute(ymaps);
                        }
                        if (mapRef.current) {
                            searchControlRef.current = new ymaps.control.SearchControl({
                                options: {
                                    float: 'right'
                                }
                            });
                            mapRef.current.controls.add(searchControlRef.current);
                            searchControlRef.current.events.add('resultselect', handleResultSelect);
                        }
                    }}
                    modules={["multiRouter.MultiRoute", "control.SearchControl"]}
                >
                    {points.map(({ x, y }) => (
                        <Placemark
                            key={`${x}-${y}`}
                            geometry={[x, y]}
                            options={{ hasHint: true }}
                        />
                    ))}
                    {searchResult && searchResult.geometry && (
                        <Placemark
                            geometry={searchResult.geometry.getCoordinates()}
                            options={{ hasHint: true }}
                        />
                    )}
                </Map>
            </YMaps>
        </div>
    );
};

export default YandexMap;
