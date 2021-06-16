import Locate from "leaflet.locatecontrol";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function LocateControl() {
    const map = useMap();
    useEffect(() => {
        const lc = new Locate({
            position: 'topright',
            initialZoomLevel: 10
        });
        lc.addTo(map);
    }, []);
    return null;
}
