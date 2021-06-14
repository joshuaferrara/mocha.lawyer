import Locate from "leaflet.locatecontrol";
import { useMap } from "react-leaflet";

export default function LocateControl() {
    const map = useMap();
    const lc = new Locate({
        startDirectly: true,
        position: 'topright'
    });
    lc.addTo(map);
    lc.start();
    return null;
}
