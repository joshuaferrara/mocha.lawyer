import { LatLng } from 'leaflet';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  Tooltip
} from 'react-leaflet'
import LocateControl from './LocateControl';
import YAML from 'yaml'

export default function Map() {
  const [isLoading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const center = new LatLng(20, 0);

  useEffect(() => {
    fetch("reviews.yml")
      .then((result) => result.text())
      .then((fileContents) => {
        let data = YAML.parseAllDocuments(fileContents);
        setReviews(data.map((document, idx) => {
          return {
            key: idx,
            ...document.toJSON()
          }
        }));
        setLoading(false);
      });
  }, []);

  let markers = null;
  if (!isLoading) {
    markers = reviews.map((review, idx) => 
      <Marker position={new LatLng(review.latitude, review.longitude)} key={idx} >
        <Tooltip>{review.name}</Tooltip>
        <Popup>

          <a href={`https://www.google.com/maps/dir/?api=1&destination=${review.address}`} target="_blank">Directions</a>
        </Popup>
      </Marker>
    )
  }

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
        <LayersControl.Overlay checked name="Coffee">
          {markers}
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
