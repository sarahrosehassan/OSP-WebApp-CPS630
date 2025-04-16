import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/delivery.css';
import Navbar from '../layout/Navbar';
import ReactDatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css'; 

const Delivery = () => {
  const [sourceAddress, setSourceAddress] = useState('Toronto');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('1'); 
  const [expressShipping, setExpressShipping] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically load the Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASHBscGYgpTSJGJ-UhSm0KeKJC7-YteVQ&callback=initMap&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.initMap = initMap;

    return () => {
      document.body.removeChild(script); 
    };
  }, []);

  function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 43.6532, lng: -79.3832 }, 
      zoom: 10,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
  }

  const handleAddressChange = (e) => {
    setDestinationAddress(e.target.value);
  };

  const calculateShipping = async () => {
    setLoading(true);
    const apiUrl = 'http://localhost/osp_it1-2_cps630/backend/api/delivery.php'; 

    const formData = new FormData();
    formData.append('branch', sourceAddress);
    formData.append('address', destinationAddress);
    formData.append('date', deliveryDate);
    formData.append('time', deliveryTime);
    formData.append('truck', selectedTruck);  
    formData.append('express', expressShipping ? '1' : '0');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include', 
      });

      const result = await response.json();

      if (result.success) {
        setRouteInfo(result.trip_details); 
        updateMap(result.trip_details);
        setLoading(false);
      } else {
        alert(result.message || 'Error fetching delivery details.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      alert('Error calculating delivery details.');
    }
  };

  const updateMap = (routeInfo) => {
    if (window.google && routeInfo) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.6532, lng: -79.3832 }, 
        zoom: 10,
      });

      directionsRenderer.setMap(map);

      const request = {
        origin: routeInfo.source,
        destination: routeInfo.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          alert('Directions request failed due to ' + status);
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateShipping(); 
  };

  return (
    <>
      <Navbar />
      <div className="delivery-body">
      <div className="container my-5">
        <h1 className="page-title">Delivery Details</h1>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form id="deliveryForm" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Branch Location</label>
                    <select
                      className="form-control"
                      value={sourceAddress}
                      onChange={(e) => setSourceAddress(e.target.value)}
                      required
                    >
                      <option value="Toronto">Toronto</option>
                      <option value="Vaughan">Vaughan</option>
                      <option value="Brampton">Brampton</option>
                      <option value="Mississauga">Mississauga</option>
                      <option value="Scarborough">Scarborough</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <FaMapMarkerAlt /> Delivery Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={destinationAddress}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter a location"
                      id="address" 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <FaCalendarAlt /> Delivery Date
                    </label>
                    <ReactDatePicker
                      selected={deliveryDate}
                      onChange={setDeliveryDate}
                      dateFormat="yyyy/MM/dd"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <FaClock /> Delivery Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Truck</label>
                    <select
                      className="form-control"
                      value={selectedTruck}
                      onChange={(e) => setSelectedTruck(e.target.value)}
                      required
                    >
                      <option value="1">TRK001</option>
                      <option value="2">TRK002</option>
                    </select>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="express"
                      checked={expressShipping}
                      onChange={() => setExpressShipping(!expressShipping)}
                    />
                    <label className="form-check-label" htmlFor="express">
                      Add Express Shipping (+$10) — Available until April 30, 2025
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Calculate Shipping
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div id="map" style={{ height: '400px', width: '100%' }}></div>
                <div id="route-info" className="route-info mt-3">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      {routeInfo && (
                        <>
                          <p><strong>From:</strong> {routeInfo.source}</p>
                          <p><strong>To:</strong> {routeInfo.destination}</p>
                          <p><strong>Distance:</strong> {routeInfo.distance} km</p>
                          <p><strong>Duration:</strong> {routeInfo.duration}</p>
                          <p><strong>Price:</strong> ${routeInfo.price}</p>
                        </>
                      )}
                      {expressShipping && (
                        <p className="text-danger">
                          Express Shipping requires delivery by tomorrow.
                        </p>
                      )}
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate('/process')}
                        >
                        Proceed to Details
                        </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Delivery;
