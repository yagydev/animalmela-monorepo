'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface EventLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  coordinates: Location;
}

interface MelaMapProps {
  eventLocation: EventLocation;
  userLocation?: Location;
  showDirections?: boolean;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 28.6139, // Delhi coordinates as fallback
  lng: 77.2090,
};

export default function MelaMap({ 
  eventLocation, 
  userLocation, 
  showDirections = false,
  className = ''
}: MelaMapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry'],
  });

  const directionsCallback = useCallback((result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status === 'OK' && result) {
      setDirections(result);
    }
  }, []);

  const directionsServiceCallback = useCallback((result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status === 'OK' && result) {
      setDirections(result);
    }
  }, []);

  if (loadError) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="text-red-600 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
        <p className="text-gray-600">Unable to load the map. Please check your internet connection and try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  const center = eventLocation.coordinates || defaultCenter;
  const markers = [
    {
      position: center,
      title: eventLocation.name,
      label: '📍'
    }
  ];

  if (userLocation) {
    markers.push({
      position: userLocation,
      title: 'Your Location',
      label: '🏠'
    });
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={eventLocation.coordinates ? 15 : 10}
        center={center}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
        onLoad={(map) => {
          // Map loaded successfully
        }}
      >
        {/* Event Marker */}
        <Marker
          position={center}
          title={eventLocation.name}
          label="📍"
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#ffffff" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="20" font-family="Arial">📍</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
          }}
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            title="Your Location"
            label="🏠"
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="12" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
                  <text x="15" y="19" text-anchor="middle" fill="white" font-size="14" font-family="Arial">🏠</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(30, 30),
              anchor: new google.maps.Point(15, 15),
            }}
          />
        )}

        {/* Directions Service */}
        {showDirections && userLocation && eventLocation.coordinates && (
          <>
            <DirectionsService
              options={{
                destination: center,
                origin: userLocation,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsServiceCallback}
            />
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: '#10B981',
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                  },
                }}
              />
            )}
          </>
        )}
      </GoogleMap>

      {/* Event Info Overlay */}
      <div className="bg-white p-4 border-t">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{eventLocation.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{eventLocation.address}</p>
            <p className="text-sm text-gray-500">{eventLocation.city}, {eventLocation.state}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;
                window.open(url, '_blank');
              }}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              Directions
            </button>
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
                window.open(url, '_blank');
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
