import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Instruktor from './instruktor.js';
import './pocetna.css';
import ProfilInstruktor from './profilInstruktor.js';
import ProfilKlijent from './profilKlijent.js';

export default class Pocetna extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intruktor:false,
            klijent:false
        };
        
    }
    componentDidMount(){
       

    }
        
    render() {
        
        return (
            <div>
            {localStorage.getItem('currentUserRole')=="2"?
            <ProfilInstruktor id={localStorage.getItem('currentUserId')}></ProfilInstruktor>
            :
            <ProfilKlijent  id={localStorage.getItem('currentUserId')}></ProfilKlijent>
            }
            </div>
        );
    }
}