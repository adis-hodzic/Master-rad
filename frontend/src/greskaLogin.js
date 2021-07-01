import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './home.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from"react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

export default class GreskaLogin extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        

        return (
            <div id="pozadina">
                <p>Niste logovani!</p>
            </div>
        );
    }
}