import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-novo-usuario',
  templateUrl: './novo-usuario.page.html',
  styleUrls: ['./novo-usuario.page.scss'],
})
export class NovoUsuarioPage implements OnInit {
  
  toastCampoVazio:boolean = false;
  toastLoginEspaco:boolean = false;
  alertLoginExist:boolean = false;
  alertButtons = ['OK'];
  formData = {
    nome:"",
    login:"",
    senha:"",
    xp:0,
    nivel:1
  }

  constructor(private navCtrl:NavController) { }

  ngOnInit() {
  }

  setCampoVazioOpen(isOpen: boolean) {
    this.toastCampoVazio = isOpen;
  }
  
  setLoginEspacoOpen(isOpen: boolean) {
    this.toastLoginEspaco = isOpen;
  }

  setLoginExistOpen(isOpen: boolean) {
    this.alertLoginExist = isOpen;
  }

  cancelar(){
    this.navCtrl.navigateBack('/home');
  }

  adicionarUsuario(){
    
    if((this.verificarCampoVazio(this.formData.nome, this.formData.login, this.formData.senha) == false)
      &&
    (this.verificarEspacoLogin(this.formData.login)==false)){
      let existeLogin = false;
    axios.get(`http://152.67.42.231/tasksxp/usuarios.php?loginExist=${this.formData.login}`)
	  .then((response) => {
      console.log(response.data);
      if(response.data != ""){
        existeLogin = true;
        this.setLoginExistOpen(existeLogin);
      }else{
        axios.post("http://152.67.42.231/tasksxp/usuarios.php", this.formData)
        .then((response) => {
          if(response.data == "1"){
            this.navCtrl.navigateBack('/home');
          }
        }).catch((error)=>{
          console.log(error);
        })
      }
		}).catch((error) => {
			console.log(error);
		})
    }  
  }

  verificarCampoVazio(nome:string, login:string, senha:string) : boolean{
    let campoVazio:boolean;
    this.formData.nome = nome.trim();
    this.formData.login = login.trim();
    this.formData.senha = senha;
    if(this.formData.nome == "" || this.formData.login == "" || this.formData.senha == ""){
      campoVazio = true;
      this.setCampoVazioOpen(campoVazio);
    }else{
      campoVazio = false;
    }
    return campoVazio;
  }

  verificarEspacoLogin(login:string) : boolean{
    let loginComEspaco:boolean;
    if(login.includes(" ")){
      loginComEspaco = true;
      this.setLoginEspacoOpen(loginComEspaco);
    }else{
      loginComEspaco = false;
    }
    return loginComEspaco;
  }
}
