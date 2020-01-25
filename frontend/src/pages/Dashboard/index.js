import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import socketio from 'socket.io-client';

import './styles.css';

function Dashboard() {

    const [spots, setSpots] = useState([]);
    const [requests, setRequsets] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio('http://localhost:3333', {
        query: { user_id },
    }), [user_id]);

    useEffect(() => {
        // socket.on('hello', data => console.log(data));
        // socket.emit('omni', 'stack9');

        socket.on('booking_request', data => {
            setRequsets([...requests, data]);
        })
    }, [requests, socket])

    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });
            console.log(response.data);
            setSpots(response.data);
        }

        loadSpots();
    }, [])

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`);
        setRequsets(requests.filter(request => request._id != id));
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`);
        setRequsets(requests.filter(request => request._id != id));
    }

    return (
        <>
            <ul className="notifications">
                {requests.map(request => (
                    <li Key={request.id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
                        </p>
                        <button className='accept' onClick={() => handleAccept(request._id)}>ACEITAR</button>
                        <button className='reject' onClick={() => handleReject(request._id)}>REJEITAR</button>
                    </li>
                ))}
            </ul>

            <ul className="spot-list">
                {spots.map(spot => (
                    <li Key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
                    </li>
                ))}
            </ul>
            <Link to="/new">
                <button className="btn">
                    Cadastrar novo spot
                </button>
            </Link>
        </>
    )
}

export default Dashboard
