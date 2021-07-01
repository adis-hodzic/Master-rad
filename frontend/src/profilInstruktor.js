import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './instruktor.css'
import './profilInstruktor.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Instrukcije from './instrukcije.js';
import Moment from 'moment';
import Modal from 'react-modal';
import Button from "react-bootstrap/Button";
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import vid from "./v.mp4"
import Card from "react-bootstrap/Card";
import ListGroup from"react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { Checkbox, RadioGroup } from "@material-ui/core";

export default class ProfilInstruktor extends Component {
    constructor(props) {
        super();
        this.state = {
            token : localStorage.getItem('token'),
            id : '',
            firstName:'',
            lastName:'',
            avgGrade:1,
            description:'',
            registrationDate:'',
            numberOfScheduledInstructions:0,
            subjects : null,
            grades : null,
            userName:'',
            profilePic: null,
            selectedFile: '',
            termini:'0000000000000000000000',
            modalOpened: false,
            selectedVideo: '',
            dateFormatted:'',
            video: false
        };
        this.createGradeList = this.createGradeList.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.postPic = this.postPic.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleTermini = this.handleTermini.bind(this);
        this.handleInputChangeVideo = this.handleInputChangeVideo.bind(this);
        this.postVideo = this.postVideo.bind(this);
      }

    
    onClick = event => {
       
          
    }
    componentDidMount(){
        this.setState({id:this.props.id});

        
        axios.get('http://localhost:8111/api/management/instructor/'+this.props.id,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                firstName : res.data.firstName,
                lastName:res.data.lastName,
                avgGrade:res.data.avgGrade,
                description:res.data.description,
                registrationDate:res.data.registrationDate,
                subjects : res.data.subjects,
                userName : res.data.userName,
                maxNumberOfInstructions : res.data.maxNumberOfInstructions,
                numberOfScheduledInstructions : res.data.numberOfScheduledInstructions,
                dateFormatted: Moment(res.data.registrationDate).format('DD-MM-YYYY')
            })

          }).catch( error =>{
              
          }
        );
        axios.get('http://localhost:8111/api/management/instructor-terms-get/'+this.props.id, 
        {
                    headers: {
                        Authorization: this.state.token 
                    }}).then(res => {
                        this.setState({termini : res.data});
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
    );axios.get('http://localhost:8111/api/management/files/v.mp4',{
        headers: {
            Authorization: this.state.token
        }}).then(res => {
        console.log('get the video')
        console.log(res.data)
        if(res.data != null)
            this.setState({
                video : true
            })

        }).catch( error =>{

            }
        );
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
        return <ListGroupItem key={item.id}>
            Ocjena: {item.grade},    Komentar: {item.comment}
            </ListGroupItem>
    }
    postPic(e){
        e.preventDefault()
        var formData = new FormData();
        formData.append("file", this.state.selectedFile);
        axios.post('http://localhost:8111/api/management/profilePic/'+this.props.id, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: this.state.token
            }
        }).then(res =>{
            window.location.reload()
        })
    }

    postVideo(e){
        e.preventDefault()
        var formData = new FormData();
        formData.append("file", this.state.selectedVideo);
        axios.post('http://localhost:8111/api/management/fileUpload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: this.state.token
            }
        }).then(res =>{
            window.location.reload()
        })
    }

    handleInputChange(event) {
        this.setState({
            selectedFile: event.target.files[0],
        })
    }

    toggleModal() { this.setState({ modalOpened: true });}

    handleCloseModal () {this.setState({ modalOpened: false});}

    handleOnSubmit(event){        
        event.preventDefault(); 

        var termsRequest = {
            "terms" : this.state.termini
        };
        
        axios.post('http://localhost:8111/api/management/instructor-terms-set/'+this.props.id,termsRequest, {
                 headers: {Authorization: this.state.token}}).then(res => {
                    this.setState({ modalOpened: false});
                    this.sucessToasterShow();
            }).catch(err =>{            
                alert(err);  
                alert(err.message);          
                this.errorToasterShow();
            });
            
    }

    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    handleTermini(event){
        let t = JSON.parse(JSON.stringify(this.state.termini));
        let index = Number(JSON.parse(JSON.stringify(event.target.id)));
        if(t[index] == '0')
            t = this.setCharAt(t,index,'1');
        else
            t = this.setCharAt(t,index,'0');
        this.setState({termini : t});
    }

    errorToasterShow(){
        toast.error('Geska', {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    sucessToasterShow(){
        toast.success('Uspješno ste promijenili termine', {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    handleInputChangeVideo(event) {
        this.setState({
            selectedVideo: event.target.files[0],
        })
    }

    render() {
        if(this.state.subjects != null)
            var SL = this.state.subjects.map(this.createSubjectList);
        if(this.state.grades != null)
            var GL = this.state.grades.map(this.createGradeList);

        const onClick = () => {
            
        }

        return (
<div>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <div className="container">
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className="nav-link" to={"/home"}>Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/pocetna"}>Instruktori</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/profil"}>Profil</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/chat"}>Chat</Link>
                  </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/"}>Log Out</Link>
                        </li>
                </ul>
              </div>
            </div>
          </nav>
          <ul class="listaKartica"><li>
            <Card id="instruktorKartica" style={{ width: '80%' }}>
                <table class="datumOcjena">
                    <tr>
                        <td><Card.Img class="profilnaSlika" variant="top" src={this.state.profilePic ? this.state.profilePic : "profile.jpg"} /></td>

                        <td><Card.Body id="instruktorInfo">
                            <Card.Title>Korisničko ime: {this.state.userName}</Card.Title>
                            <Card.Text id="naslov">Ime: {this.state.firstName}</Card.Text>
                            <Card.Text id="naslov">Prezime: {this.state.lastName}</Card.Text>
                            <Card.Text id="asda">Opis: {this.state.description}</Card.Text>
                            <Card.Text>Datum prijave: {this.state.dateFormatted}</Card.Text>
                            <Card.Text>Maksimalan broj instrukcija: {this.state.maxNumberOfInstructions}</Card.Text>
                            <Card.Text>Broj zakazanih instrukcija: {this.state.numberOfScheduledInstructions}</Card.Text>
                            </Card.Body>
                        </td>
                        <td>
                            <table>
                                <tr id="ocjena">{this.state.avgGrade.toFixed(2)}</tr>
                                <tr><Card.Text>Prosječna ocjena</Card.Text></tr>
                                <Button variant="primary" onClick={this.toggleModal}>Promijeni raspoložive termine</Button>
                            </table>
                        </td>
                    </tr>
                </table>

                <form  action="#" onSubmit={this.postPic}>
                    <p>Ovdje mozete izabrati novu profilnu sliku: </p>
                    <br/>
                    <input type="file" onChange={this.handleInputChange} id="file" name="file"/>

                    <input  type="submit" value={'Promijeni'}/>
                </form>
                <br/>
                <form  action="#" onSubmit={this.postVideo}>
                    <p>Ovdje mozete objaviti kratki video o sebi: </p>
                    <br/>
                    <input type="file" onChange={this.handleInputChangeVideo} id="file" name="file"/>

                    <input  type="submit" value={'Upload'}/>
                </form>
                <br/>
                <div>
                    <video width="320" hidden={!this.state.video} muted={!this.state.video} height="240" controls loop autoPlay>
                        <source src={vid} type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
                    </video>
                    <video width="420" hidden={this.state.userName != 'adis'} muted={!this.state.video} height="340" controls loop autoPlay>
                        <source src={vid} type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
                    </video>

                </div>
                <Card.Text class="lijevo">Predmeti</Card.Text>
                    <ListGroup className="list-group-flush">
                        {SL}
                    </ListGroup>

                <Card.Text class="lijevo">Ocjene</Card.Text>
                    <ListGroup className="list-group-flush">
                        {GL}
                    </ListGroup>
                           
                
            </Card>
            </li>
            <li>
            <Card id="opisKartica" style={{ margin:'auto',width:"80%",height:"110%",marginTop:'30px',background:'#1C8EF9' }}>
              <table style={{ width:"100%", borderWidth:'50px', textAlign:'center'}}>
                <tr>
                  <td style={{ background:'#3C3A35',width:"50%",color:'white'}}><Card.Title style={{margin:'5%'}}>Instruktor</Card.Title></td>
                  <td style={{ background:'#FFC246',width:"50%"}}><Card.Title style={{margin:'5%'}}>Klijent</Card.Title></td>
                </tr>
              </table>
            </Card>
              </li></ul>
            <Instrukcije 
            idInstruktora = {this.props.id} 
            idKlijenta = {null}
            ></Instrukcije>

            <Modal isOpen={this.state.modalOpened} contentLabel="Zakazi instrukciju" className='custom-dialog'>
                <form onSubmit={this.handleOnSubmit} style = {{'display' :' flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items':'center'}} >
                    <div>
                        <Checkbox checked = {this.state.termini[8] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="8" onClick={this.handleTermini}>08:00</button>
                        <Checkbox checked = {this.state.termini[9] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="9" onClick={this.handleTermini}>09:00</button>
                        <Checkbox checked = {this.state.termini[10] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="10" onClick={this.handleTermini}>10:00</button>
                        <Checkbox checked = {this.state.termini[11] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="11" onClick={this.handleTermini}>11:00</button>
                        <Checkbox checked = {this.state.termini[12] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="12" onClick={this.handleTermini}>12:00</button>
                        <Checkbox checked = {this.state.termini[13] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="13" onClick={this.handleTermini}>13:00</button>
                        <Checkbox checked = {this.state.termini[14] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="14" onClick={this.handleTermini}>14:00</button>
                        <Checkbox checked = {this.state.termini[15] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="15" onClick={this.handleTermini}>15:00</button>
                        <Checkbox checked = {this.state.termini[16] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="16" onClick={this.handleTermini}>16:00</button>
                        <Checkbox checked = {this.state.termini[17] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="17" onClick={this.handleTermini}>17:00</button>
                        <Checkbox checked = {this.state.termini[18] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="18" onClick={this.handleTermini}>18:00</button>
                        <Checkbox checked = {this.state.termini[19] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="19" onClick={this.handleTermini}>19:00</button>
                        <Checkbox checked = {this.state.termini[20] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="20" onClick={this.handleTermini}>20:00</button>
                        <Checkbox checked = {this.state.termini[21] == 0}></Checkbox>
                        <button type="button" class="btn btn-info" id="21" onClick={this.handleTermini}>21:00</button>
                    </div>
                    <button type="submit" class="btn btn-primary" style = {{'width': '160px', 'margin-right': '20px'}}>Promijeni</button> 
                    <button class="btn btn-info" onClick={this.handleCloseModal}>Zatvori</button> 
                </form>
            </Modal>
            </div>
        );
    }
}