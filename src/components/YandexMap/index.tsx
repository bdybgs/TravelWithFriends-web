import React from 'react';
import {Map, Placemark, Polyline, YMaps} from "@pbe/react-yandex-maps";
import styles from './index.module.css';
import {TPoint} from "../../types/TPoint";

type IProps = {
    points: TPoint[],
}
//

const YandexMap = ({points}: IProps) => {

    

    return (
        <div className={styles.wrapper}>
            <YMaps query={{ apikey: "06bd4b2b-084a-4bd2-841b-9088796a24af" }}>
                <Map style={{}} defaultState={{ center: [54.75, 37.57], zoom: 9 }} >
                    { points.map(({ x, y }) => (
                        <Placemark options={{ hasHint: true }} defaultGeometry={[x, y]} />
                    )) }
                </Map>
            </YMaps>
        </div>
    );
};

export default YandexMap;