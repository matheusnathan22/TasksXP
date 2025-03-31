import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-nova-tarefa',
  templateUrl: './nova-tarefa.page.html',
  styleUrls: ['./nova-tarefa.page.scss'],
})
export class NovaTarefaPage implements OnInit {
  
  codUsuarioLoggado = 0;
  formData = {
    codUsuario:0,
    titulo:"",
    descricao:"",
    dataHora:"",
    dificuldade:"",
    xp:0
  }
  
  isToastOpen:boolean = false;

  constructor(private activatedRoute:ActivatedRoute, private navCtrl:NavController) { }

  ngOnInit() {
    this.setDificuldadeAtual();
    this.activatedRoute.queryParams.subscribe(params => {
      this.formData.codUsuario = params['codUsuario'];
      this.codUsuarioLoggado = params['codUsuario'];
      console.log(this.formData.codUsuario);
    });
  }

  seguimentoAlterado(e:any){
    this.formData.dificuldade = e.detail.value;
  }

  dataAlterada(e:any){
    this.formData.dataHora = e.detail.value;
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  
  setDificuldadeAtual(){
    this.formData.dificuldade = "Fácil";
  }

  adicionarTarefa(){
    if(this.verificarCampoVazio(this.formData.titulo) == false){
      switch(this.formData.dificuldade){
        case "Fácil":
          this.formData.xp = 25;
          break;
        case "Médio":
          this.formData.xp = 50;
          break;
        case "Difícil":
          this.formData.xp = 100;
          break;
      }
      axios.post("http://152.67.42.231/tasksxp/tarefas.php", this.formData)
    .then(
      (response) => {
        if(response.data == "1"){
          this.navCtrl.navigateForward('/tarefas/', {queryParams:{
            codUsuario: this.codUsuarioLoggado
          }
        });
        }
      })
    .catch((error)=>{
      console.log(error);
    })
    }
  }

  cancelar(){
    this.formData = {
      codUsuario:0,
      titulo: "",
      descricao: "",
      dataHora: "",
      dificuldade: "",
      xp:0
    }
    this.navCtrl.navigateForward('/tarefas/', {queryParams:{
      codUsuario: this.codUsuarioLoggado
      }
    });
  }

  verificarCampoVazio(titulo:string) : boolean{
    let campoVazio:boolean;
    this.formData.titulo = titulo.trim();
    if(this.formData.titulo == "" || this.formData.dataHora == ""){
      campoVazio = true;
      this.setOpen(campoVazio);
    } else{
      campoVazio = false;
    }
    return campoVazio;
  }
}