import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AutentificacionService } from '../../services/autentificacion.service';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'El Email es requerido.' },
      { type: 'pattern', message: 'Por favor, introduce un email valido.' }
    ],
    'password': [
      { type: 'required', message: 'La Contraseña es requerida.' },
      { type: 'minlength', message: 'La Contraseña debe tener minimo 5 caracteres.' }
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authService: AutentificacionService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private alert: AlertController,
    public toastController: ToastController

  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  async checkOut(){
    let alert = await this.alert.create({
      header: 'El usuario ha sido creado!!',
      message: 'Inicia Sesión',
      buttons: ['OK']
    });
    alert.present().then(()=>{
      this.modalCtrl.dismiss();
    });
  } 

  tryRegister(value) {
    this.authService.registerUser(value)
      .then(res => {
        this.errorMessage = "";
      }, err => {
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

  async goLoginPage() {
    this.presentToast();
    this.navCtrl.navigateBack('/tabs');
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario Creado',
      color:'warning',
      duration: 2000
    });
    toast.present();
  }

}
