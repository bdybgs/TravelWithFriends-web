import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { YMaps, Map, Placemark, SearchControl } from 'react-yandex-maps';
import styles from './index.module.css';
import { TPoint } from "../../types/TPoint";

type IProps = {
    points: TPoint[],
    textPoints: string[],
    setSearchRequestString: React.Dispatch<React.SetStateAction<string>>
}

interface SearchResult {
    geometry: {
        getCoordinates: () => number[],
    }
}

const YandexMap = ({ points, textPoints, setSearchRequestString }: IProps) => {
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const mapRef = useRef<any>(null);
    const multiRouteRef = useRef<any>(null);
    const searchControlRef = useRef<any>(null);


    const handleSearchResult = (result: SearchResult | null) => {
        setSearchResult(result);
    };

    const handleResultSelect = (result: any) => {
        console.log("Selected:", result);
        alert('Щёлк ' + result);
        setSearchResult(result);
    };

    const addSearchControl = (ymaps: any) => {
        if (mapRef.current && !searchControlRef.current) {
            const searchControl = new ymaps.control.SearchControl({
                options: {
                    float: 'right',
                    size: 'large',
                    placeholderContent: 'Search...',
                    noPlacemark: true
                }
            });
            mapRef.current.controls.add(searchControl);
            searchControlRef.current = searchControl;

            searchControl.events.add('resultselect', (e: any) => handleResultSelect(e.get('result')));
            searchControl.events.add('resultshow', (e: any) => handleSearchResult(e.get('result')));
            searchControl.events.add('resultselect', (e: any) => {
                const requestString = searchControl.getRequestString();
                alert(requestString);
                const results = searchControl.getResultsArray();
                setSearchRequestString(requestString);
                const selected = e.get('index');
                const point = results[selected].geometry.getCoordinates();
                alert(point);
            });
        }
    };


/*
    const handleSearchControlLoad = (ref: any) => {
        setSearchControl(ref);
    };*/
    const handlePlacemarkClick = () => {
        alert('Событие произошло');
    };

    const addMultiRoute = (ymaps: any) => {
        const pointA = [55.749, 37.524];
        const pointB = "Москва, Красная площадь";
        const pointC = "Москва, Павелецкий вокзал";
        const pointD = "Москва, Таганская";

        if (multiRouteRef.current && mapRef.current) {
            mapRef.current.geoObjects.remove(multiRouteRef.current);
        }

        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints: [pointA, pointB, pointC, pointD],
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

   /* useEffect(() => {
        if (searchControl) {
            searchControl.events.add('resultselect', (e: any) => handleResultSelect(e.get('result')));
            searchControl.events.add('resultshow', (e: any) => handleSearchResult(e.get('result')));
            searchControl.events.add('resultselect', function(e: { get: (arg0: string) => any; }) {
                const requestString = searchControl.getRequestString();
                alert(requestString);
                const results = searchControl.getResultsArray();
                setSearchRequestString(requestString);
                const selected = e.get('index');
                const point = results[selected].geometry.getCoordinates();
                alert(point);
            });
        }
    }, [searchControl, setSearchRequestString]);*/

    useEffect(() => {
        console.log(textPoints);
    }, [textPoints]);

    return (
        <div className={styles.wrapper}>
            <YMaps query={{ apikey: '7c779eb6-845b-4c78-a612-a2397737206e' }}>
                <Map
                    defaultState={{ center: [55.749, 37.524], zoom: 9 }}
                    width="100%"
                    height="400px"
                    // @ts-ignore
                    instanceRef={mapRef}
                    onLoad={(ymaps: any) => {
                        addMultiRoute(ymaps)
                        addSearchControl(ymaps);
                    }}
                    modules={["multiRouter.MultiRoute", "control.SearchControl"]}
                >
                    {/*<SearchControl
                        options={{ float: 'right', size: 'large', placeholderContent: 'Search...' }}
                    />*/}
                    {points.map(({ x, y }) => (
                        <Placemark
                            key={`${x}-${y}`}
                            geometry={[x, y]}
                            options={{ hasHint: true }}
                            onClick={handlePlacemarkClick}
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
