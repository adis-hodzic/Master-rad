import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './instruktor.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import Moment from 'moment';

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from"react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import Modal from 'react-modal';
import { Input } from "@material-ui/core";

export default class Instruktor extends Component {
    constructor(props) {
        super();
        this.state = {
            token : localStorage.getItem('token'),
            id:'',
            firstName:'',
            lastName:'',
            avgGrade:1,
            description:'',
            registrationDate:'',
            numberOfScheduledInstructions:0,
            subjects : null,
            grades : null,
            modalOpened: false,
            selectedSubject: null,
            selectedSubjectMessage: "Izaberite predmet",
            selectedDate: null,
            selectedNumberOfClasses: 0,
            dateFormatted:'',
            profilePic: null
        };
        this.createGradeList = this.createGradeList.bind(this);
        this.toggleModal = this.toggleModal.bind(this);       
        this.createSubjectList2 = this.createSubjectList2.bind(this);
        this.handleDateChange =  this.handleDateChange.bind(this);
        this.handleNumberOfClasses = this.handleNumberOfClasses.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
      }

    
    onClick = event => {
       
          
    }
    componentDidMount(){
        this.setState({firstName:this.props.firstName});
        this.setState({lastName:this.props.lastName});
        this.setState({id:this.props.id});
        this.setState({avgGrade:this.props.avgGrade});
        this.setState({description:this.props.description});
        this.setState({registrationDate:this.props.registrationDate});
        this.setState({numberOfScheduledInstructions:this.props.numberOfScheduledInstructions});
        this.setState({subjects:this.props.subjects});
        this.setState({dateFormatted: Moment(this.props.registrationDate).format('DD-MM-YYYY')})
        
        axios.get('http://localhost:8111/api/rating/grades-instructor-all/'+this.props.id,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({grades : res.data})

          }).catch( error =>{
              
          }
        );

        axios.get('http://localhost:8111/api/management/image/'+this.props.id,{
            headers: {
                Authorization: this.state.token
            }}).then(res => {

            if(res.data != null)
                this.setState({
                    profilePic : "data:image/png;base64," + res.data
                })

        }).catch( error =>{

            }
        );
    }
    createSubjectList(item){
        return <ListGroupItem key={item.id}>{item.name}: {item.description}
            </ListGroupItem>
    }    
    createGradeList(item){
        return <Dropdown.Item key={item.id} href="#">
            Ocjena: {item.grade},    Komentar: {item.comment}
            </Dropdown.Item>
    }
    createSubjectList2(item){
        return <ListGroupItem key={item.id} onClick={this.selectSubject.bind(this,item)}>{item.name}: {item.description} 
        </ListGroupItem>
    }

    selectSubject(item){
                this.setState({selectedSubject: item.id, selectedSubjectMessage: item.name + " " + item.description});                
    }

    toggleModal() {
        this.setState({ modalOpened: true });
      }

     handleCloseModal () {
        this.setState({ modalOpened: false});
    }

    handleDateChange(event){
        this.setState({selectedDate: event.target.value});
    }

    handleNumberOfClasses(event){
        this.setState({selectedNumberOfClasses: event.target.value});
    }

    handleOnSubmit(event){
        event.preventDefault();
        var instructionRequest = {
            "scheduledDate": "2020-09-16T23:24:08.212-00:00",
	        "numberOfClasses": this.state.selectedNumberOfClasses
          };
          console.log(this.state.selectedDate +" " + this.state.selectedSubject);
        if(this.state.selectedDate != null && this.state.selectedNumberOfClasses!=0){
                axios.post('http://localhost:8111/api/request/instruction/'+this.props.id + '/' + localStorage.getItem("currentUserId") +'/'+ this.state.selectedSubject,
                 instructionRequest, {
                    headers: {
                        Authorization: this.state.token 
                      }}).then(res => {
                            this.setState({ modalOpened: false});
                      }).catch(err =>{
                          alert(err);
                      });
        }


    }


    
    render() {
        if(this.state.subjects != null){            
            var SL = this.state.subjects.map(this.createSubjectList);
            var SL2= this.state.subjects.map(this.createSubjectList2);
        }
        if(this.state.grades != null)
            var GL = this.state.grades.map(this.createGradeList);
        

        const onClick = () => {
            
        }

        return (
            <div>
                <Card id="instruktorKartica" style={{ width: '80%' }}>
                <table class="datumOcjena">
                    <tr>
                        <td><Card.Img class="profilnaSlika" variant="top" src={this.state.profilePic ? this.state.profilePic : "profile.jpg"} /></td>
                        <td><Card.Body id="instruktorInfo">
                            <Card.Title id="naslov">{this.state.firstName} {this.state.lastName}</Card.Title>
                            <Card.Text id="asda">{this.state.description}</Card.Text>
                            <Card.Text>Datum prijave: {this.state.dateFormatted}</Card.Text>
                            </Card.Body>
                        </td>
                        <td>
                            <table>
                                <tr id="ocjena">{this.state.avgGrade.toFixed(2)}</tr>
                                <tr><Card.Text>Prosječna ocjena</Card.Text></tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                    <ListGroup className="list-group-flush">
                        {SL}
                    </ListGroup>
                    <table>
                        <tr>
                            <td>
                                <Dropdown class="ocjene">
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        Prikaži sve ocjene instruktora
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu class="ocjene">
                                        {GL}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            
                            
                        </tr>
                    </table>
                    
                
            </Card>
            <Modal isOpen={this.state.modalOpened} contentLabel="Zakazi instrukciju" className='custom-dialog'>   
            
           <form onSubmit={this.handleOnSubmit} style = {{'display' :' flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items':'center'}} >
                <label>Datum instrukcije:</label><input type="date" onChange = {this.handleDateChange} style = {{'width': '250px'}}></input>
                <label>Broj casova:</label>  <input type="number" onChange = {this.handleNumberOfClasses} style = {{'width': '250px'}}></input>   
               
                <Dropdown style ={{'margin-top' : '20px', 'margin-bottom': '20px'}}>
                <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        {this.state.selectedSubjectMessage}
                                        </Dropdown.Toggle>
                <Dropdown.Menu class="predmeti">
                                            {SL2}
                </Dropdown.Menu>
                </Dropdown>
                <div style={{'display':'flex', 'flex-direction':'row', 'justify-content':'space-around'}}>
                    <input type="submit" class="btn btn-primary" style = {{'width': '160px', 'margin-right': '20px'}}>Zakazi instrukciju</input>   
                    <button class="btn btn-info" onClick={this.handleCloseModal}>Zatvori</button>       
                </div>
                
       
           </form>
               
           
          </Modal>
            </div>
            
        );
    }
}