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

import coffeeIcon from './CoffeeIcon';
import styles from './styles.less';

export default function Map() {
  const [isLoading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const center = new LatLng(20, 0);

  console.log(styles);

  // Get review data on mount
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

  // Generate markers from review data
  let markers = null;
  if (!isLoading) {
    markers = reviews.map((review, idx) => 
      <Marker position={new LatLng(review.latitude, review.longitude)}
        key={idx}
        icon={coffeeIcon} >
        <Tooltip>{review.name}</Tooltip>
        <Popup className={styles.reviewData}>
          <div>
            <h3>
              {review.name}
            </h3>
            <hr />
            <div className={styles.reviewDataRow}>
              <div>Drink</div>
              <div>{review.item}</div>
            </div>
            <div className={styles.reviewDataRow}>
              <div>Price</div>
              <div>${review.price}</div>
            </div>
            <div className={styles.reviewDataRow}>
              <div>☕</div>
              <div>
                {[...Array(review["coffee-score"])].map((val, idx) => (
                  <span>⭐</span>
                ))}
              </div>
            </div>
            <div className={styles.reviewDataRow}>
              <div>🍫</div>
              <div>
                {[...Array(review["chocolate-score"])].map((val, idx) => (
                  <span>⭐</span>
                ))}
              </div>
            </div>
            <div className={styles.reviewDataRow}>
              <div>Whip</div>
              <div>
                  {review["whip-cream"]}
              </div>
            </div>
            {!review["notes"] ? null : (
              <div>
                <hr />
                {review.notes}
              </div>
            )}
          </div>
          <hr />
          <div className={styles.directionsLink}>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${review.address}`} target="_blank">Directions</a>
          </div>
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
