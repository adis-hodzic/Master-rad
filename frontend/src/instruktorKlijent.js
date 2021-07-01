import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './instruktorKlijent.css'
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
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Moment from 'moment';
import DayTimePicker from '@mooncake-dev/react-day-time-picker';
import { set } from "date-fns";

export default class InstruktorKlijent extends Component {
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
            errorMessageDate : false,
            errorMessageClasses : false,
            dateFormatted:'',
            timePicked:'',
            disabledAll: true,
            scheduledTimes:null,
            profilePic: null,
            termini:'0000000000000000000000',
            rezervisani:'0000000000000000000000',
            raspolozivi:'0000000000000000000000',
            odg:null
        };
        this.createGradeList = this.createGradeList.bind(this);
        this.toggleModal = this.toggleModal.bind(this);       
        this.createSubjectList2 = this.createSubjectList2.bind(this);
        this.handleDateChange =  this.handleDateChange.bind(this);
        this.handleNumberOfClasses = this.handleNumberOfClasses.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.errorToasterShow = this.errorToasterShow.bind(this);
        this.handleTimePicked = this.handleTimePicked.bind(this);
        this.handleTermini = this.handleTermini.bind(this);
        this.setCharAt = this.setCharAt.bind(this);
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

        axios.get('http://localhost:8111/api/management/instructor-terms-get/'+this.props.id, 
        {
                    headers: {
                        Authorization: this.state.token 
                    }}).then(res => {
                        this.setState({raspolozivi : res.data});
                }).catch(err =>{                  
                    this.errorToasterShow();
                });

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
        this.setState({disabledAll:false});
    }

    handleDateChange(event){   

        if(new Date(event.target.value) <= new Date()){
          this.setState({errorMessageDate: true});
        } else{
            this.setState({errorMessageDate: false});
            this.setState({selectedDate: event.target.value});
        }
        this.setState({disabledAll:false})
        
        var termRequest = {
            "scheduledDate": new Date(event.target.value)
          };
         
        axios.post('http://localhost:8111/api/request/instructions-terms/'+this.props.id,
        termRequest,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({rezervisani : res.data});
          }).catch( error =>{
              alert(error.message);
          }
        );
    }

    handleNumberOfClasses(event){
        if(event.target.value<1 || event.target.value>3){
            this.setState({errorMessageClasses: true});
        } else{
            this.setState({selectedNumberOfClasses: event.target.value});
            this.setState({errorMessageClasses: false});
        }
       
    }

    errorToasterShow(){
        toast.error('Upisani podaci su neispravni. Instrukcija nije zakazana!', {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    sucessToasterShow(){
        toast.success('Uspješno ste zakazali instrukciju', {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    handleOnSubmit(event){        
        event.preventDefault();    
        if(this.state.selectedDate == null || this.state.selectedNumberOfClasses>3 || this.state.selectedSubject == null){
            this.errorToasterShow();
        } else{
            var nClasses = 0;
            for(var i=0;i<this.state.termini.length;i++){
                if(this.state.termini[i] == '1')
                    nClasses++;
            }
            if(nClasses == 0){
                this.errorToasterShow();
            }
            else{
                var instructionRequest = {
                    "scheduledDate": new Date(this.state.selectedDate),
                    "numberOfClasses": nClasses,
                    "termini": this.state.termini
                };
                console.log(this.state.selectedDate +" " + this.state.selectedSubject);
                if(this.state.selectedDate != null){
                    axios.post('http://localhost:8111/api/request/instruction/'+this.props.id + '/' + localStorage.getItem("currentUserId") +'/'+ this.state.selectedSubject,
                        instructionRequest, {
                            headers: {
                                Authorization: this.state.token 
                            }}).then(res => {
                                this.setState({ modalOpened: false});
                                this.sucessToasterShow();
                        }).catch(err =>{                 
                            this.errorToasterShow();
                        });
                }
            }
        }    
        
    }
    handleTimePicked(event){
        console.log(event.target);
        this.setState({timePicked:event.target.id});
        this.setState({disabledAll: true});
    }

    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }
    
    handleTermini(event){
        let t = JSON.parse(JSON.stringify(this.state.termini));
        let index = Number(JSON.parse(JSON.stringify(event.target.id)));
        t = this.setCharAt(t,index,'1');
        this.setState({termini : t});
    }
    
   // <DayTimePicker timeSlotSizeMinutes={15} style={{'display':'flex', 'flex-direction':'column', 'justify-content':'space-around'}}/>
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
                <ToastContainer />
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
                            <td>
                                <Card.Body>
                                    <Button variant="primary" onClick={this.toggleModal}>Zakaži instrukciju</Button>
                                </Card.Body>
                            </td>
                            
                        </tr>
                    </table>
                    
                
            </Card>
            <Modal isOpen={this.state.modalOpened} contentLabel="Zakazi instrukciju" className='custom-dialog'>   

            
           <form onSubmit={this.handleOnSubmit} style = {{'display' :' flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items':'center'}} >
           
                <label>Datum instrukcije:</label><input type="date" onChange = {this.handleDateChange} style = {{'width': '250px'}}></input>
                <div id="vrijeme">
                <button type="button" disabled={this.state.disabledAll || this.state.termini[8] == '1' || this.state.rezervisani[8] == '1' || this.state.raspolozivi[8] == '1'} class="btn btn-info" id="8" onClick={this.handleTermini}>08:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[9] == '1' || this.state.rezervisani[9] == '1' || this.state.raspolozivi[9] == '1'} class="btn btn-info" id="9" onClick={this.handleTermini}>09:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[10] == '1' || this.state.rezervisani[10] == '1' || this.state.raspolozivi[10] == '1'} class="btn btn-info" id="10" onClick={this.handleTermini}>10:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[11] == '1' || this.state.rezervisani[11] == '1' || this.state.raspolozivi[11] == '1'} class="btn btn-info" id="11" onClick={this.handleTermini}>11:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[12] == '1' || this.state.rezervisani[12] == '1' || this.state.raspolozivi[12] == '1'} class="btn btn-info" id="12" onClick={this.handleTermini}>12:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[13] == '1' || this.state.rezervisani[13] == '1' || this.state.raspolozivi[13] == '1'} class="btn btn-info" id="13" onClick={this.handleTermini}>13:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[14] == '1' || this.state.rezervisani[14] == '1' || this.state.raspolozivi[14] == '1'} class="btn btn-info" id="14" onClick={this.handleTermini}>14:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[15] == '1' || this.state.rezervisani[15] == '1' || this.state.raspolozivi[15] == '1'} class="btn btn-info" id="15" onClick={this.handleTermini}>15:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[16] == '1' || this.state.rezervisani[16] == '1' || this.state.raspolozivi[16] == '1'} class="btn btn-info" id="16" onClick={this.handleTermini}>16:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[17] == '1' || this.state.rezervisani[17] == '1' || this.state.raspolozivi[17] == '1'} class="btn btn-info" id="17" onClick={this.handleTermini}>17:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[18] == '1' || this.state.rezervisani[18] == '1' || this.state.raspolozivi[18] == '1'} class="btn btn-info" id="18" onClick={this.handleTermini}>18:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[19] == '1' || this.state.rezervisani[19] == '1' || this.state.raspolozivi[19] == '1'} class="btn btn-info" id="19" onClick={this.handleTermini}>19:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[20] == '1' || this.state.rezervisani[20] == '1' || this.state.raspolozivi[20] == '1'} class="btn btn-info" id="20" onClick={this.handleTermini}>20:00</button>
                <button type="button" disabled={this.state.disabledAll || this.state.termini[21] == '1' || this.state.rezervisani[21] == '1' || this.state.raspolozivi[21] == '1'} class="btn btn-info" id="21" onClick={this.handleTermini}>21:00</button>
                </div>
                <Dropdown style ={{'margin-top' : '7px', 'margin-bottom': '7px'}}>
                <Dropdown.Toggle variant="info" id="dropdown-basic">
                                        {this.state.selectedSubjectMessage}
                                        </Dropdown.Toggle>
                <Dropdown.Menu class="predmeti">
                                            {SL2}
                </Dropdown.Menu>
                </Dropdown>
                
                { this.state.errorMessageDate ? <div id="error" >
                    <label style={{'color':'red', 'font-size': 'small'}}>Unesite ispravan datum</label>
                </div> : null }
                

                <div style={{'display':'flex', 'flex-direction':'row', 'justify-content':'space-around'}}>
                    <button disabled = {this.state.errorMessageClasses || this.state.errorMessageDate || this.state.selectedSubject==null || this.state.selectedDate==null} type="submit" class="btn btn-primary" style = {{'width': '160px', 'margin-right': '20px'}}>Zakazi instrukciju</button>   
                    <button class="btn btn-info" onClick={this.handleCloseModal}>Zatvori</button>       
                </div>               
       
           </form>
               
           
          </Modal>

          
            </div>
            
        );
    }
}