import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './instruktorAdmin.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

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
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class InstruktorAdmin extends Component {
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
            maxNumberOfInstructions:0,
            subjects : null,
            grades : null,
            modalOpened: false,
            selectedSubject: null,
            selectedSubjectMessage: "Izaberite predmet",
            selectedDate: null,
            selectedNumberOfClasses: 0,
            preko50Posto: false,
            popunjenInstruktor: false,
            modalOpened:false,
            selectedCourseType:'live',
            meetLink:'',
            address:'',
            capacity:0,
            time:'',
            days: '',
            startDate: '',
            endDate:'',
            dMeetDisplay: false,
            selectedInstructorId: null            
        };
        this.createGradeList = this.createGradeList.bind(this);
        this.toggleModal = this.toggleModal.bind(this);       
        this.createSubjectList2 = this.createSubjectList2.bind(this);
        this.handleDateChange =  this.handleDateChange.bind(this);
        this.handleNumberOfClasses = this.handleNumberOfClasses.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.onClickDodajKurs = this.onClickDodajKurs.bind(this);
        this.handleCourseTypeChange = this.handleCourseTypeChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCapacityChange = this.handleCapacityChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleDaysChange = this.handleDaysChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleMeetLinkChange = this.handleMeetLinkChange.bind(this);
        this.handleOnSubmitNewCourse = this.handleOnSubmitNewCourse.bind(this);
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
        this.setState({maxNumberOfInstructions:this.props.maxNumberOfInstructions});
        
        if(this.props.maxNumberOfInstructions/this.props.numberOfScheduledInstructions < 2)
            this.setState({preko50Posto:true});
        if(this.props.maxNumberOfInstructions <= this.props.numberOfScheduledInstructions)
            this.setState({popunjenInstruktor:true});
        
        axios.get('http://localhost:8111/api/rating/grades-instructor-all/'+this.props.id,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({grades : res.data})

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
                         this.errorToasterShow();
                      });
        }


    }

    onClickDodajKurs (event) {
        //event.preventDefault();
        // if(this.state.id != null){
        //     axios.get('http://localhost:8111/api/request/instructions/'+this.state.id,{
        //         headers: {
        //         Authorization: this.state.token 
        //         }}).then(res => {
        //         this.setState({listOfInstructions : res.data})
                                
        //     this.setState({listOfInstructionsNull : false})
        //     }).catch( error =>{
        //         //alert(error);
        //     }
        //     );
        // }
    
     this.setState({modalOpened: true});            
    }


onClickProduziUgovor (){
        
}

handleCourseTypeChange (item)  {
    this.setState({selectedCourseType: item.target.value });
    if(item.target.value == 'Live'){
        this.setState({dMeetDisplay: false});      
    }
    else {
        this.setState({dMeetDisplay: true});        
    }
  
}

handleMeetLinkChange(item){
    this.setState({meetLink: item.target.value});

}

handleAddressChange(item){
    this.setState({address: item.target.value});
}

handleCapacityChange(item){
    this.setState({capacity: item.target.value})
}

handleTimeChange(item){
    this.setState({time: item.target.value});
}

handleDaysChange(item){    
    if(this.state.days===''){
       this.setState({days: item.target.value});
    }
    else
        this.setState({days: this.state.days +'/'+ item.target.value});
    
}

handleStartDateChange(item){   
    this.setState({startDate: item.target.value});
}

handleEndDateChange(item){
    this.setState({endDate: item.target.value});
}

handleCloseModal () {   
    this.setState({ modalOpened: false});
}

handleOnSubmitNewCourse(e){
    e.preventDefault();
    console.log({
        "instructorId": this.props.id,
        "subjectId": this.state.selectedSubject,
        "courseType": this.state.selectedCourseType,
        "meetLink": this.state.meetLink,
        "maxCapacity": this.state.capacity,
        "currentCapacity": 0,
        "timeHeld": this.state.time,
        "daysHeld": this.state.days,
        "startingDate": this.state.startDate,
        "endDate": this.state.endDate,
      });
    axios.post('http://localhost:8111/api/request/create-course', {
                "instructorId": this.props.id,
                "subjectId": this.state.selectedSubject,
                "courseType": this.state.selectedCourseType,
                "meetLink": this.state.meetLink,
                "maxCapacity": this.state.capacity,
                "currentCapacity": 0,
                "timeHeld": this.state.time,
                "daysHeld": this.state.days,
                "startingDate": this.state.startDate,
                "endDate": this.state.endDate,
              },{headers: {
                    Authorization: this.state.token 
                  }})
              .then(function (response) {
                this.setState({ modalOpened: false});
                
              }).catch(err => {
                 this.errorToasterShow(); 
              });
}


    
    render() {
        if(this.state.subjects != null){            
            var SL = this.state.subjects.map(this.createSubjectList);
            var SL2= this.state.subjects.map(this.createSubjectList2);
        }
        if(this.state.grades != null)
            var GL = this.state.grades.map(this.createGradeList);  
   
        return (
            <div>
                <ToastContainer></ToastContainer>
                <Card id="instruktorKartica" style={{ width: '80%' }}>
                <table class="datumOcjena">
                    <tr>
                        <td><Card.Img class="profilnaSlika" variant="top" src="profile.jpg" /></td>
                        <td><Card.Body id="instruktorInfo">
                            <Card.Title id="naslov">{this.state.firstName} {this.state.lastName}</Card.Title>
                            <Card.Text id="asda">{this.state.description}</Card.Text>
                            <Card.Text>Datum prijave: {this.state.registrationDate}</Card.Text>
                            <Card.Text>Broj slobodnih časova sedmično</Card.Text>
                            <table id="tabelaPopunjenostKursa">
                                <tr class="popunjenostKursa">
                                    {this.state.popunjenInstruktor?
                                    <td class="popunjenostKursa" style={{backgroundColor:"red"}}>{this.state.numberOfScheduledInstructions}</td>
                                    :
                                    this.state.preko50Posto?
                                    <td class="popunjenostKursa" style={{backgroundColor:"yellow"}}>{this.state.numberOfScheduledInstructions}</td>
                                    :
                                    <td class="popunjenostKursa" style={{backgroundColor:"green"}}>{this.state.numberOfScheduledInstructions}</td>
                                    }
                                    <td class="popunjenostKursa" style={{backgroundColor:"green"}}>{this.state.maxNumberOfInstructions}</td>
                                </tr>
                            </table>
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
            <Modal isOpen={this.state.modalOpened} contentLabel="Dodaj kurs" className='zakaziKurs'>   
            <h1>Kreirajte Kurs</h1>
            <form onSubmit={this.handleOnSubmitNewCourse} style = {{'display' :' flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items':'center'}} >
                <div  style = {{'display' :' flex', 'flex-direction': 'row'}}>
                    <div style = {{'display' :' flex', 'flex-direction': 'column', 'margin-right':'50px'}}>
                        <label>Tip kursa:</label>
                        <select id="tipKursa" onChange = {this.handleCourseTypeChange}>
                            <option value="Live">Live</option>
                            <option value="Online">Online</option>
                        </select>
                       {this.state.dMeetDisplay ? 
                        <div style = {{'display' :' flex', 'flex-direction': 'column'}} >
                            <label>Meet link:</label>  <input type="text" onChange = {this.handleMeetLinkChange} style = {{'width': '250px'}}></input>   
                        </div> : 
                      
                        <div id="dAddress" ref={this.dAddress} style = {{'display' :' flex', 'flex-direction': 'column'}}>
                            <label>Adresa:</label> <input type="text" onChange = {this.handleMeetLinkChange} style = {{'width': '250px'}}></input>   
                        </div>  
                        }           
                    
                        <label>Kapacitet:</label> <input type="number" onChange = {this.handleCapacityChange} style = {{'width': '250px'}}></input>   
                        <label>Vrijeme odrzavanja:</label> <input type="time" placeholder="00:00:00" onChange = {this.handleTimeChange} style = {{'width': '250px'}}></input>
                        
                    </div>

                    <div style = {{'display' :' flex', 'flex-direction': 'column'}}>
                        <label>Datum početka</label> <input type="date" onChange = {this.handleStartDateChange} style = {{'width': '250px'}}></input>
                        <label>Datum završtka;</label> <input type="date" onChange = {this.handleEndDateChange} style = {{'width': '250px'}}></input>
                        <label>Dani održavanja:</label>
                        <div id="daniOrdzavanja" onChange = {this.handleDaysChange} style =  {{'display' :' flex', 'flex-direction': 'row'}}>
                            <div style =  {{'display' :' flex', 'flex-direction': 'column' ,'margin-right':'10px'}}>
                                <label><input type="checkbox" name="daniOdrzavanja" value="Ponedjeljak" />Ponedjeljak </label>
                                <label><input type="checkbox" name="daniOdrzavanja" value="Utorak" />Utorak</label>
                                <label><input type="checkbox" name="daniOdrzavanja" value="Srijeda" />Srijeda</label>
                                <label><input type="checkbox" name="daniOdrzavanja" value="Cetvrtak" />Cetvrtak</label>
                            </div>
                            <div style =  {{'display' :' flex', 'flex-direction': 'column'}}>                               
                                <label><input type="checkbox" name="daniOdrzavanja" value="Petak" />Petak</label>
                                <label><input type="checkbox" name="daniOdrzavanja" value="Subota" />Subota</label>
                                <label><input type="checkbox" name="daniOdrzavanja" value="Nedjelja" />Nedjelja</label>
                            </div>
                        </div>        
                        
                        <Dropdown style ={{'margin-top' : '20px', 'margin-bottom': '20px'}}>
                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                                {this.state.selectedSubjectMessage}
                                                </Dropdown.Toggle>
                        <Dropdown.Menu class="predmeti">
                                                    {SL2}
                        </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                
                 <div style={{'display':'flex', 'flex-direction':'row', 'justify-content':'space-around'}}>
                     <input type="submit" class="btn btn-primary" style = {{'width': '160px', 'margin-right': '20px'}} value="Kreiraj kurs" />   
                     <button class="btn btn-info" onClick={this.handleCloseModal}>Zatvori</button>       
                 </div>                
        
            </form>
                
            
           </Modal>
         </div>
            
        );
    }
}