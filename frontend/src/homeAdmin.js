import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './homeAdmin.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from"react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

export default class HomeAdmin extends Component {
    constructor(props) {
        super(props);
    }

     componentDidMount(){
        axios.get('http://localhost:8111/api/management/whoAmI',{
            headers: {
              Authorization: localStorage.getItem('token')
            }}).then(res => {
                localStorage.setItem('currentUserRole', res.data.userRole);
                localStorage.setItem('currentUserId', res.data.userId);
                })
                .catch(error =>{
                    toast.error('Došlo je do greške!', {
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    });                    
                })
    }
    
    render() {
        

        return (
            <div id="pozadina">
                <ToastContainer/>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                    <div className="container">
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to={"/homeAdmin"}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/adminPanel"}>Upravljanje</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/statistike"}>Statistike</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/"}>Log Out</Link>
                        </li>
                        </ul>
                    </div>
                    </div>
                </nav>
                <div id="onlineUcenje">
                    <p id="faxtrukcije">Faxtrukcije</p>
                </div>
                <table id="tabela1">
                    <tr>
                        <td>
                            <p id="znanje">Upravljanje</p>
                        </td>
                        <td><img id="adminSlika" src="adminLogo.png" /></td>
                    </tr>
                    <tr>
                        <td>
                            <p id="znanje">Statistike</p>
                        </td>
                        <td><img id="statistikeSlika" src="statistikeLogo.png" /></td>
                        
                    </tr>
                </table>                              
            </div>
        );
    }
}