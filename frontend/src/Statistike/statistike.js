import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import '../instruktor.css'
import './statistike.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from"react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";


export default class Statistike extends Component {
    constructor(props) {
        super();
        this.state = {
            token : localStorage.getItem('token'),
            listOfSubjects:null,
            listOfSubjectsNull:true,
            listOfInstructors:null,
            listOfCourses:null,
            listOfInstructions:null,
            colors:["yellow","green"],
            listOfStats:null,
            listTop5:null,
            rank:1,
            listOfTop5BasedOnInstructions: null,
        };
        this.createDataPointsForInstructionsBySubject = this.createDataPointsForInstructionsBySubject.bind(this);
        this.createStats = this.createStats.bind(this);
        this.createTop5 = this.createTop5.bind(this);
      }

    
    onClick = event => {
       
          
    }
    componentDidMount(){

        axios.get('http://localhost:8111/api/management/subjects',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                listOfSubjects:res.data
            });
            
          }).catch( error =>{
              
          }
        );

        axios.get('http://localhost:8111/api/rating/grades-top5-all',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                listTop5:res.data
            });
            
          }).catch( error =>{
              
          }
        );
        
        axios.get('http://localhost:8111/api/management/instructors',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                listOfInstructors:res.data
            })

          }).catch( error =>{
              
          }
        );

        axios.get('http://localhost:8111/api/request/stats-instructions',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                listOfStats:res.data
            })

          }).catch( error =>{
              
          }
        );

        axios.get('http://localhost:8111/api/request/instructorsTop5',{
          headers: {
            Authorization: this.state.token 
          }}).then(res => {                 
                  this.setState({
                    listOfTop5BasedOnInstructions:res.data          
                  })
              }).catch(error =>{
              
                  }
              );       

    }

    
    
    createDataPointsForInstructionsBySubject(){
        
    }

    createStats(item){
        return <tr>
            <td style={{width:"50%"}}>{item.subjectName} - {item.subjectDescription}</td>
            <td style={{width:"50%"}}>{item.numberOfInstructions}</td>
        </tr>
    }
    createTop5(item){
        return <tr>
              <td style={{width:"25%", fontWeight:"bold"}}>{item.firstName}  {item.lastName}</td>
              <td style={{width:"50%"}}>{item.description}</td>
              <td style={{width:"25%"}}>{item.avgGrade}</td>
          </tr>
    }

    createTop5BasedOnInstructions(item){
      return <tr>
      <td style={{width:"50%"}}>{item.firstName + " " + item.lastName}</td>
      <td style={{width:"50%"}}>{item.numberOfScheduledClasses}</td>
  </tr>
    }
    
    render() {      
      
        if(this.state.listOfStats != null)
            var STATLIST = this.state.listOfStats.map(this.createStats);
        if(this.state.listTop5 != null)
          var TOP5 = this.state.listTop5.map(this.createTop5);

        if(this.state.listOfTop5BasedOnInstructions != null){
          var TOP5BasedOnInstructions = this.state.listOfTop5BasedOnInstructions.map(this.createTop5BasedOnInstructions);
        }

        const onClick = () => {
            
        }

        return (
<div>
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
          <ul class="listaKartica"><li>
          <Card id="opisKartica" style={{ margin:'auto',width:"80%",height:"110%",marginTop:'30px',background:'#1C8EF9' }}>
              <table style={{ width:"100%", borderWidth:'50px', textAlign:'center'}}>
                <tr>
                  <td style={{ background:'#3C3A35',width:"50%",color:'white'}}><Card.Title style={{margin:'5%'}}>Predmet</Card.Title></td>
                  <td style={{ background:'#FFC246',width:"50%"}}><Card.Title style={{margin:'5%'}}>Broj Instrukcija</Card.Title></td>
                </tr>
              </table>
          </Card>
          <table id="tabelaStatistike">
                  {STATLIST}
          </table>
          <Card id="opisKartica" style={{ margin:'auto',width:"80%",height:"110%",marginTop:'30px',background:'#1C8EF9' }}>
              <table style={{ width:"100%", borderWidth:'50px', textAlign:'center'}}>
                <tr>
                  <td style={{ background:'#3C3A35',width:"25%",color:'white'}}><Card.Title style={{margin:'5%'}}>Instruktor</Card.Title></td>
                  <td style={{ background:'#FFC246',width:"50%"}}><Card.Title style={{margin:'5%'}}>Lični Opis</Card.Title></td>
                  <td style={{ background:'rgb(247, 99, 197)',width:"25%"}}><Card.Title style={{margin:'5%'}}> Prosječna ocjena</Card.Title></td>
                </tr>
              </table>
          </Card>
          <table id="tabelaStatistike">
                  {TOP5}
          </table>
          <Card id="opisKartica" style={{ margin:'auto',width:"80%",height:"110%",marginTop:'30px',background:'#1C8EF9' }}>
              <table style={{ width:"100%", borderWidth:'50px', textAlign:'center'}}>
                <tr>
                  <td style={{ background:'#3C3A35',width:"50%",color:'white'}}><Card.Title style={{margin:'5%'}}>Instruktor</Card.Title></td>
                  <td style={{ background:'#FFC246',width:"50%"}}><Card.Title style={{margin:'5%'}}>Broj Instrukcija</Card.Title></td>
                </tr>
              </table>
          </Card>
          <table id="tabelaStatistike">
                  {TOP5BasedOnInstructions}
          </table>
			
            </li>
        </ul>
            
            </div>
        );
    }
}