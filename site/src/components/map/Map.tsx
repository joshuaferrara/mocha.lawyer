import { LatLng } from 'leaflet';
import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl
} from 'react-leaflet'
import LocateControl from './LocateControl';

export default function Map() {
  const center = new LatLng(20, 0);
  return (
    <MapContainer 
      style={{ height: 'calc(100% - 64px)' }}
      center={center}
      zoom={2} >

      <LocateControl />

      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="CyclOSM">
          <TileLayer
            attribution='&copy; <a href="https://cyclosm.org/">CyclOSM</a> contributors'
            url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Marker with popup">
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
