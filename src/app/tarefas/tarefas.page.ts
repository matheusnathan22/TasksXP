import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';


@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.page.html',
  styleUrls: ['./tarefas.page.scss'],
})
export class TarefasPage implements OnInit{

  tasks: any [] = [];
  codUsuarioLoggado = 0;
  codTarefaApagada = 0;
  nomeUsuario = "";
  metaXp = 0;
  xp = 0;
  xpSelectedTask = 0;
  nivel = 0;
  progressoXp = "";
  public progress = 0;
  alertLevelUp:boolean = false;
  alertButtons = ['OK'];
  toastFinishTask:boolean = false;
  toastMessage = "";
  isAlertDeleteOpen:boolean = false;
  isAlertFinishOpen:boolean = false;
  public alertLogoffBtn = [
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
        this.logoff();
      },
    },
  ];

  public alertDeleteBtn = [
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

  public alertFinishTsk = [
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

  constructor(private activatedRoute:ActivatedRoute, private navCtrl:NavController) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.codUsuarioLoggado = params['codUsuario'];
      console.log(this.codUsuarioLoggado);
    });
  }

  ionViewDidEnter(){
    this.getTasks();
    this.getInfoUsuario();
  }

  getTasks(){
    axios.get(`http://152.67.42.231/tasksxp/tarefas.php?cod_usuario=${this.codUsuarioLoggado}`)
	  .then(
		  (response) => {

			  this.tasks = response.data;
		  })
	  .catch((error) => {
			console.log(error);
		})
  }

  navigateToEdit(cod_tarefa:number, data:string){
    let arrDataHora = data.split(" ");
    data = arrDataHora[0] + "T" + arrDataHora[1];
    this.navCtrl.navigateForward('/editar-tarefa/', {queryParams:{
      codTarefa: cod_tarefa,
      dataTarefa: data,
      codUsuario: this.codUsuarioLoggado
    }
  });
  }

  navigateToNew(){
    this.navCtrl.navigateForward('/nova-tarefa/', {queryParams:{
      codUsuario: this.codUsuarioLoggado
    }
  });
  }

  navigateToEditUsr(){
    this.navCtrl.navigateForward('/editar-usuario/', {queryParams:{
      codUsuario: this.codUsuarioLoggado
    }
  });
  }

  deleteTask(cod_tarefa:number){
    console.log(cod_tarefa);
    axios.get(`http://152.67.42.231/tasksxp/tarefas.php?deleteId=${cod_tarefa}&cod_usuario=${this.codUsuarioLoggado}`)
	  .then(
		  (response) => {
			  console.log(response.data);
        this.tasks = response.data;
		  })
	  .catch((error) => {
			console.log(error);
		})
    this.codTarefaApagada = 0;
    console.log(this.codTarefaApagada);
  }

  finishTask(cod_tarefa:number, xp:number){
    this.deleteTask(cod_tarefa);
    let tmpFormData = {
      cod_usuario:this.codUsuarioLoggado,
      xpUsr:xp
    }

    axios.post("http://152.67.42.231/tasksxp/usuarios.php", tmpFormData)
    .then(
      (response) => {
        if(response.data == "1"){
          axios.get(`http://152.67.42.231/tasksxp/usuarios.php?cod_usuario=${this.codUsuarioLoggado}`)
	        .then(
		        (response) => {
              this.nomeUsuario = response.data[0].nome;
              this.xp = response.data[0].xp;
              this.nivel = response.data[0].nivel;
              this.metaXp = 100 * (this.nivel ** 2);
              this.progressoXp = this.xp.toString() + "/" + this.metaXp.toString();
              this.progress = ((this.xp * 100)/this.metaXp)/100;
              this.setFinishTaskOpen(true);
              if(this.xp >= 100 * (this.nivel ** 2)){
                let tmpFormData2 = {
                  nvlUpdateId:this.codUsuarioLoggado
                }
                axios.post("http://152.67.42.231/tasksxp/usuarios.php", tmpFormData2)
                .then(
                  (response) => {
                    if(response.data == "1"){
                      this.getInfoUsuario();
                      this.setLevelUpOpen(true);
                    }
                }).catch((error)=>{console.log(error);})
              }
		      }).catch((error) => {console.log(error);})
        }
    }).catch((error)=>{console.log(error);})
  }

  getInfoUsuario(){
    axios.get(`http://152.67.42.231/tasksxp/usuarios.php?cod_usuario=${this.codUsuarioLoggado}`)
	  .then(
		  (response) => {
			  console.log(response.data);
        this.nomeUsuario = response.data[0].nome;
        this.xp = response.data[0].xp;
        this.nivel = response.data[0].nivel;
        this.metaXp = 100 * (this.nivel ** 2);
        this.progressoXp = this.xp.toString() + "/" + this.metaXp.toString();
        this.progress = ((this.xp * 100)/this.metaXp)/100;
        console.log(this.progress);
		  })
	  .catch((error) => {
			console.log(error);
		})
  }

  setLevelUpOpen(isOpen: boolean) {
    this.alertLevelUp = isOpen;
    console.log(this.alertLevelUp);
  }

  logoff(){
    this.navCtrl.navigateBack('/home');
  }

  setResultLogoff(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  setResultDel(ev:any, isAlertOpen:boolean) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    this.setOpenDelete(this.codTarefaApagada, false);
    if(ev.detail.role == 'confirm'){
      this.deleteTask(this.codTarefaApagada);
    }

  }

  setResultFinish(ev:any, isAlertOpen:boolean) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    this.setOpenFinish(this.codTarefaApagada, this.xpSelectedTask, false);
    if(ev.detail.role == 'confirm'){
      this.finishTask(this.codTarefaApagada, this.xpSelectedTask)
    }
  }

  setFinishTaskOpen(isOpen:boolean){
    this.toastMessage = "Tarefa concluída! " + this.xpSelectedTask.toString() + " XP";
    this.toastFinishTask = isOpen;
  }

  setOpenDelete(cod_tarefa:number, isAlertOpen:boolean){
    this.isAlertDeleteOpen = isAlertOpen;
    this.codTarefaApagada = cod_tarefa; 
  }

  setOpenFinish(cod_tarefa:number, xp:number, isAlertOpen:boolean){
    this.isAlertFinishOpen = isAlertOpen;
    this.codTarefaApagada = cod_tarefa;
    this.xpSelectedTask = xp;
  }
}