import L from 'leaflet';
import styles from './styles.less';

const size = 32;
const iconCoffee = new L.DivIcon({
    iconSize: [size, size],
    tooltipAnchor: [16, 0],
    popupAnchor: [0, -16],
    className: styles.coffeeMarker,
    html: '☕'
});

export default iconCoffee;