import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import axios from 'axios';
@Component({
  selector: 'app-editar-tarefa',
  templateUrl: './editar-tarefa.page.html',
  styleUrls: ['./editar-tarefa.page.scss'],
})
export class EditarTarefaPage implements OnInit {

  codUsuarioLoggado = 0;
  cod_tarefa:number = 0;
  dataExibida:any;
  isToastOpen:boolean = false;
  formData = {
    update:false,
    codUsuario:0,
    cod_tarefa:0,
    titulo:"",
    descricao:"",
    dataHora:"",
    dificuldade:"",
    xp:0
  }
  
  constructor(private activatedRoute:ActivatedRoute, private navCtrl:NavController) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.cod_tarefa = params['codTarefa'];
      this.dataExibida = params['dataTarefa'];
      this.codUsuarioLoggado = params['codUsuario'];
      console.log(this.cod_tarefa);
      console.log(this.dataExibida);
      this.getDadosTarefa();
    });
  }

  seguimentoAlterado(e:any){
    this.formData.dificuldade = e.detail.value;
  }

  dataAlterada(e:any){
    this.formData.dataHora = e.detail.value;
  }

  getDadosTarefa(){
    axios.get(`http://152.67.42.231/tasksxp/tarefas.php?cod_tarefa=${this.cod_tarefa}`)
	  .then((response) => {
			  console.log(response.data);
        let sepDataHora = response.data[0].data_hora;
        let arrDataHora = sepDataHora.split(" ");
        this.formData = {
          update: false,
          codUsuario: response.data[0].cod_usuario,
          cod_tarefa: response.data[0].cod_tarefa,
          titulo: response.data[0].titulo,
          descricao: response.data[0].descricao,
          dataHora: arrDataHora[0] + "T" + arrDataHora[1],
          dificuldade: response.data[0].dificuldade,
          xp:response.data[0].xp
        }
		  })
	  .catch((error) => {
			console.log(error);
		})
  }

  update(){
    console.log(this.formData);
    this.formData['update'] = true;
    this.formData['cod_tarefa'] = this.cod_tarefa;

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
        console.log(response)
        if(response.data == "1"){
          this.formData = {
            update: false,
            codUsuario: 0,
            cod_tarefa: 0,
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
      })
    .catch((error)=>{
      console.log(error);
    })
    }
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  cancelar(){
    this.formData = {
      update: false,
      codUsuario: 0,
      cod_tarefa: 0,
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