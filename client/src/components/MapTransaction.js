import axios from "axios";
import Pin from './Pin';
import MapGL, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'
import { API } from "../config/api";
import { useQuery } from "react-query";


function MapTransaction({ handleCloseM, locationName, status, longlat, finishedOrder, partnerId }) {


    const Token = "pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw";

    const [viewport, setViewport] = useState({});

    useEffect(() => {

        setViewport({
            latitude: latitude2,
            longitude: longitude2,
            width: '100%',
            height: '80vh',
            zoom: 14,
        })
    }, []);

    const navControlStyle = {
        right: 10,
        top: 270
    };

    const geolocateControlStyle = {
        right: 10,
        top: 235
    };

    let { data: dataPartner, loading, error, refetch } = useQuery(
        "PartnerCache",
        async () => {
            const response = await API.get("user/" + partnerId);
            return response;
        }
    );

    dataPartner = dataPartner?.data?.data;

    const longitude2 = parseFloat(longlat?.split(",")[0]);
    const latitude2 = parseFloat(longlat?.split(",")[1]);

    const longitude3 = parseFloat(dataPartner?.location.split(",")[0]);
    const latitude3 = parseFloat(dataPartner?.location.split(",")[1]);

    return (
        <MapGL {...viewport} onViewportChange={viewmport => { setViewport(viewmport); }} mapStyle="mapbox://styles/jodyseptiawan/ckm8u2216elzw17rziiaoor6g" mapboxApiAccessToken={Token}>

            {status == 'waiting' && (
                <span id="Waiting" className="box-map card-maps ml-auto card bg-light py-2 px-3 rounded m-2 border border-success">
                    <small className="mb-2"><b>Waiting for the transaction to be approved</b></small>
                    <span className="text-danger d-inline"><FontAwesomeIcon icon={faMapMarker} className="text-danger d-inline mr-1" />{locationName}</span>
                    <small className="mt-3"><b>Delivery Time</b></small>
                    <span>10 - 15 Minutes</span>
                </span>
            )}
            {status == 'on the way' && (
                <span id="Finish" className="box-map card-maps ml-auto card bg-light py-2 px-3 rounded m-2 border border-success">
                    <small className="mb-2"><b>Driver is On The Way</b></small>
                    <span className="text-danger d-inline"><FontAwesomeIcon icon={faMapMarker} className="text-danger d-inline mr-1" />{locationName}</span>
                    <small className="mt-3"><b>Delivery Time</b></small>
                    <span>10 - 15 Minutes</span>
                    <button onClick={finishedOrder} className="btn btn-sm btn-dark px-5 btn-order-cart btn-block py-1 mt-3">Finished Order</button>
                </span>
            )}

            <Marker key={1}
                latitude={latitude2}
                longitude={longitude2}
                offsetLeft={-20}
                offsetTop={-10}
            >
                <Pin />
                {/* <img src="../assets/my-marker.png" width={20} /> */}

            </Marker>
            <Marker key={2}
                latitude={latitude3}
                longitude={longitude3}
                offsetLeft={-20}
                offsetTop={-10}
            >
                <img src="../assets/store-marker.png" width={20} />
            </Marker>

            <GeolocateControl
                style={geolocateControlStyle}
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
            // auto
            />

            <NavigationControl style={navControlStyle} />
        </MapGL >
    )
}

export default MapTransaction;