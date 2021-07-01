import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Instrukcija from './instrukcija.js';
import InstrukcijaKlijent from './instrukcijaKlijent.js';
import './instrukcije.css';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class Instrukcije extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token : localStorage.getItem('token'),
            listOfInstructions : null,
            listOfInstructionsNull : true
        };
        this.createInstructionList = this.createInstructionList.bind(this);
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
        if(this.props.idInstruktora != null){
            axios.get('http://localhost:8111/api/request/instructions/'+this.props.idInstruktora,{
                headers: {
                Authorization: this.state.token 
                }}).then(res => {
                this.setState({listOfInstructions : res.data})
                                
            this.setState({listOfInstructionsNull : false})
            }).catch( error =>{
                this.errorToasterShow();
            }
            );
        }
        else{
            axios.get('http://localhost:8111/api/request/instructions-client/'+this.props.idKlijenta,{
                headers: {
                Authorization: this.state.token 
                }}).then(res => {
                this.setState({listOfInstructions : res.data})
                                
            this.setState({listOfInstructionsNull : false})
            }).catch( error =>{
                this.errorToasterShow();
            }
            );
        }
        
    }
    
    
    onHover = event => {
        event.target.style.backgroundColor = '#FFFFFF';
    }   
    onMouseLeave = event =>{
        event.target.style.backgroundColor = '#F5F5F5';
    }

    createInstructionList(item){
        if(this.props.idInstruktora){

            return <li key={item.id}><Instrukcija
            id = {item.id}
            subjectId = {item.subjectId}
            scheduledDate = {item.scheduledDate}
            numberOfClasses = {item.numberOfClasses}
            instructorId = {item.instructorId}
            clientId = {item.clientId}
            active = {item.active}
            >
                </Instrukcija></li>
        }
        else{
            return <li key={item.id}><InstrukcijaKlijent
                id = {item.id}
                subjectId = {item.subjectId}
                scheduledDate = {item.scheduledDate}
                numberOfClasses = {item.numberOfClasses}
                instructorId = {item.instructorId}
                clientId = {item.clientId}
                active = {item.active}
                >
                    </InstrukcijaKlijent></li>
        }
    }
    render() {
        if(!this.state.listOfInstructionsNull)
        var IL = this.state.listOfInstructions.map(this.createInstructionList);
        
        return (
            <div style={{'height':'100%'}}>
                <ToastContainer></ToastContainer>
                <div id="chatRoom">
                    <div id="list">
                        {this.state.listOfInstructionsNull ? null : <ul class = "listaKartica">{IL}</ul>}
                    </div>            
                </div>
            </div>
        );
    }
}