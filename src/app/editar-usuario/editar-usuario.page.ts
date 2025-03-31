import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {
  toastCampoVazio:boolean = false;
  toastLoginEspaco:boolean = false;
  alertLoginExist:boolean = false;
  alertButtons = ['OK'];
  codUsuarioLoggado = 0;
  loginAntigo="";
  formData = {
    update: false,
    cod_usuario:0,
    nome:"",
    login:"",
    senha:"",
    xp:0,
    nivel:0
  }
  public alertDelUsrBtn = [
    {
      text: 'Não',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Sim',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];
  constructor(private activatedRoute:ActivatedRoute, private navCtrl:NavController) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.codUsuarioLoggado = params['codUsuario'];
      this.getDadosUsuario();
    });
  }

  update(){
    console.log(this.formData);
    this.formData['update'] = true;
    this.formData['cod_usuario'] = this.codUsuarioLoggado;

    if((this.verificarCampoVazio(this.formData.nome, this.formData.login, this.formData.senha) == false)
      &&
    (this.verificarEspacoLogin(this.formData.login)==false)){
      let existeLogin = false;
      axios.get(`http://152.67.42.231/tasksxp/usuarios.php?loginExist=${this.formData.login}`)
      .then((response) => {
        if((response.data != "")&&(response.data[0].login != this.loginAntigo)){
          existeLogin = true;
          this.setLoginExistOpen(existeLogin);
        }else{
          axios.post("http://152.67.42.231/tasksxp/usuarios.php", this.formData)
          .then((response) => {
            console.log(response)
            if(response.data == "1"){
              this.formData = {
                update: false,
                cod_usuario: 0,
                nome:"",
                login:"",
                senha:"",
                xp:0,
                nivel:0
              }
              this.navCtrl.navigateForward('/tarefas/', {queryParams:{
                codUsuario: this.codUsuarioLoggado
              }});
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

  getDadosUsuario(){
    axios.get(`http://152.67.42.231/tasksxp/usuarios.php?cod_usuario=${this.codUsuarioLoggado}`)
	  .then((response) => {
			  console.log(response.data);
        this.formData = {
          update: false,
          cod_usuario: response.data[0].cod_usuario,
          nome: response.data[0].nome,
          login: response.data[0].login,
          senha: response.data[0].senha,
          xp: response.data[0].xp,
          nivel: response.data[0].nivel
        }
        this.loginAntigo = response.data[0].login;
		  })
	  .catch((error) => {
			console.log(error);
		})
  }

  deleteUser(){
    //Deleta todas as tarefas
    axios.get(`http://152.67.42.231/tasksxp/tarefas.php?deleteAllId=${this.codUsuarioLoggado}`)
	  .then(
		  (response) => {
			  console.log(response.data);
        //Deleta o usuário
        axios.get(`http://152.67.42.231/tasksxp/usuarios.php?deleteId=${this.codUsuarioLoggado}`)
	  .then(
		  (response) => {
			  console.log(response.data);
        this.navCtrl.navigateBack('/home');
		  })
	  .catch((error) => {
			console.log(error);
		})
		  })
	  .catch((error) => {
			console.log(error);
		})

    
  }

  setCampoVazioOpen(isOpen: boolean) {
    this.toastCampoVazio = isOpen;
  }

  setLoginEspacoOpen(isOpen: boolean) {
    this.toastLoginEspaco = isOpen;
  }

  setLoginExistOpen(isOpen: boolean){
    this.alertLoginExist = isOpen;
  }

  setResultDelUsr(ev:any){
    if(ev.detail.role == 'confirm'){
      this.deleteUser();
    }
  }

  cancelar(){
    this.formData = {
      update: false,
      cod_usuario:0,
      nome:"",
      login:"",
      senha:"",
      xp:0,
      nivel:0
    }
    this.navCtrl.navigateForward('/tarefas/', {queryParams:{
      codUsuario: this.codUsuarioLoggado
      }
    });
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
