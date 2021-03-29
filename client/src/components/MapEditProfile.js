import axios from "axios";
import Pin from './Pin';
import MapGL, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'
import { API } from "../config/api";
import { useMutation } from "react-query";


function MapEditProfile({ handleClose }) {
    // MAPBOX CONFIG
    const [drag, setDrag] = useState(false);
    const [placeName, setPlaceName] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const locationSuccess = (data) => {
        if (!drag) {
            setLatitude(data.coords.latitude);
            setLongitude(data.coords.longitude);
        }
    }

    const locationError = (data) => {
        console.log(data.message)
    }

    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    const Token = "pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw";

    const [viewport, setViewport] = useState({});

    useEffect(() => {
        axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + longitude + "," + latitude + ".json?types=poi&access_token=pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw")
            .then(res => {
                setPlaceName(res?.data?.features[0]?.place_name);
            });

        setViewport({
            latitude: latitude,
            longitude: longitude,
            width: '100%',
            height: '80vh',
            zoom: 14,
        })
    }, [latitude, longitude]);

    const geolocateControlStyle = {
        right: 10,
        top: 10
    };

    const navControlStyle = {
        right: 10,
        top: 50
    };

    const [events, logEvents] = useState({});

    const onMarkerDragStart = useCallback(event => {
        setDrag(true);
        logEvents(_events => ({ ..._events, onDragStart: event.lngLat }));
    }, []);

    const onMarkerDrag = useCallback(event => {
        logEvents(_events => ({ ..._events, onDrag: event.lngLat }));
    }, []);

    const onMarkerDragEnd = useCallback(event => {
        logEvents(_events => ({ ..._events, onDragEnd: event.lngLat }));
        setLatitude(event.lngLat[1]);
        setLongitude(event.lngLat[0]);
    }, []);

    const updateLocationUser = useMutation(async (location) => {
        const body = new FormData();

        body.append("location", location);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        await API.patch("/user", body, config);
    });

    const confirmLocation = (long, lat) => {
        const location = `${long},${lat}`;
        updateLocationUser.mutate(location);
        handleClose();
    }

    return (
        <MapGL {...viewport} onViewportChange={viewmport => { setViewport(viewmport); }} mapStyle="mapbox://styles/jodyseptiawan/ckm8u2216elzw17rziiaoor6g" mapboxApiAccessToken={Token}>

            <span className="box-map card-maps mb-auto mx-auto card bg-light py-2 px-3 rounded m-2 border border-success">
                <small className="mb-2"><b>Select Delivery Location</b></small>
                <span className="text-danger d-inline"><FontAwesomeIcon icon={faMapMarker} className="text-danger d-inline mr-1" />{placeName}</span>
                <button onClick={() => confirmLocation(longitude, latitude)} className="btn btn-sm btn-dark px-5 btn-order-cart btn-block py-1 mt-3">Confirm Location </button>
            </span>

            <Marker
                latitude={latitude}
                longitude={longitude}
                offsetLeft={-20}
                offsetTop={-10}
                onDragStart={onMarkerDragStart}
                onDrag={onMarkerDrag}
                onDragEnd={onMarkerDragEnd}
                draggable>
                <Pin />
            </Marker>
            <GeolocateControl
                style={geolocateControlStyle}
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
            // auto
            />
            <NavigationControl style={navControlStyle} />
        </MapGL>
    )
}

export default MapEditProfile;