import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import InstruktorAdmin from './instruktorAdmin.js';
import InstruktorKlijent from './instruktorKlijent.js';
import './adminPanel.css';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listMessage : "List is empty",
            chatMessage : "No client selected",
            token : localStorage.getItem('token'),
            listOfClients : null,
            listOfClientsNull : true,
            listOfInstructors : null,
            listOfInstructorsNull : true,
            selectedClient : null,
            isClientSelected: false
        };
        this.createInstructorList = this.createInstructorList.bind(this);
        this.onHover = this.onHover.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    errorToasterShow(){
      toast.error('Doslo je do greške!', {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
      });
  }
    componentDidMount(){

        axios.get('http://localhost:8111/api/management/instructors',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({listMessage : "List of all instructors: ",
                            listOfInstructors : res.data})
                            
        this.setState({listOfInstructorsNull : false})
          }).catch( error =>{
              this.errorToasterShow();
          }
        );

        axios.get('http://localhost:8111/api/management/clients',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({listMessage : "List of all clients: ",
                            listOfClients : res.data})
                            
        this.setState({listOfClientsNull : false})
          }).catch( error =>{
            this.errorToasterShow();
          }
        );
        
    }
    
    
    onHover = event => {
        event.target.style.backgroundColor = '#FFFFFF';
    }   
    onMouseLeave = event =>{
        event.target.style.backgroundColor = '#F5F5F5';
    }

    createInstructorList(item){
      
        return <li key={item.id}><InstruktorAdmin
        id = {item.id}
        firstName = {item.firstName}
        lastName = {item.lastName}
        avgGrade = {item.avgGrade}
        description = {item.description}
        registrationDate = {item.registrationDate}
        maxNumberOfInstructions ={item.maxNumberOfInstructions}
        numberOfScheduledInstructions = {item.numberOfScheduledInstructions}
        subjects = {item.subjects}
        >
            </InstruktorAdmin></li>
      
    }

    render() {
        if(!this.state.listOfInstructorsNull)
        var IL = this.state.listOfInstructors.map(this.createInstructorList);

        return (
            <div style={{'height':'100%'}}>
              <ToastContainer></ToastContainer>
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
              <div id="chatRoom">
                  <div id="list">
                    {this.state.listOfInstructorsNull ? null :
                    <ul class = "listaKartica">{IL}</ul>}
                  </div>                  
              </div>
            </div>
        );
    }
}