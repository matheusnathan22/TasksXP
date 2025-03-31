import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isToastOpen = false;
  login = "";
  senha = "";
  formData = {
    codUsuario:0,
    login:"",
    senha:""
  };
  constructor(private navCtrl:NavController) {}

  ngOnInit(){}
  
  ionViewDidEnter(){
    this.login = "";
    this.senha = "";
  }

  navigateToNew(){
    this.navCtrl.navigateForward(`/novo-usuario`);
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  autenticarUsuario(){
    axios.get(`http://152.67.42.231/tasksxp/usuarios.php?login=${this.login}`)
	  .then((response) => {
        console.log(response.data);
        if(response.data != ""){
          this.formData= {
            codUsuario:response.data[0].cod_usuario,
            login:response.data[0].login,
            senha:response.data[0].senha
          }
          if((this.login == this.formData.login) && (this.senha == this.formData.senha)){
            this.navCtrl.navigateForward('/tarefas/', {queryParams:{
              codUsuario: this.formData.codUsuario
            }
          });
          }else{
            this.setOpen(true);
          }
        }else{
          this.setOpen(true);
        }
		  })
	  .catch((error) => {
			console.log(error);
		})
  }

}
