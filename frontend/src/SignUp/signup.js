import React, { Component } from "react";
import  './signup.css';
import axios from 'axios';


export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: ''};

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
        this.handleChangeLastName = this.handleChangeLastName.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
      }
    
    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }
    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }
    handleChangeFirstName(event){
        this.setState({firstName: event.target.value});
    }
    handleChangeLastName(event){
        this.setState({lastName: event.target.value});
    }
    render() {
        
        const onClick = () => {

            axios.post('http://localhost:8111/api/management/register-client', {
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "password": this.state.password,
                "userName": this.state.username
              })
              .then(function (response) {
                if(response.status == 200){
                    window.location.replace("/poc");
                }
              })
              .catch(function (error) {
                document.getElementById("pogresni_podaci").style.display = 'block';
              });
            }
        return (
            <div id="signupDiv">
            <form>
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" onChange={this.handleChangeFirstName} className="form-control" placeholder="First name" />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" onChange={this.handleChangeLastName}  className="form-control" placeholder="Last name" />
                </div>

                <div className="form-group">
                <label>Username</label>
                    <input id = "username" onChange={this.handleChangeUsername} type="username" className="form-control" placeholder="Enter username" />
                </div>

                <div className="form-group">
                <label>Password</label>
                    <input  id = "password" onChange={this.handleChangePassword} type="password" className="form-control" placeholder="Enter password" />
                </div>
                <label id="pogresni_podaci" style={{display:"none", color:"red"}}>Pogresni korisnički podaci, pokušajte ponovo!</label>
                <button type="button" className="btn btn-primary btn-block" onClick = {()=>onClick()}>Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">sign in?</a>
                </p>
            </form>
            </div>
        );
    }
}