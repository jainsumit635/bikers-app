
import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { ServiceProvider } from '../../providers/service/service';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  @ViewChild(Nav) nav: Nav;
  temp = {
    name: '',
    number: ''
  };
  constructor( public loadingController: LoadingController, public navCtrl: NavController, private service: ServiceProvider, public navParams: NavParams) { }
  ngOnInit() {
    this.service.User.subscribe(res=>{
      if(res.length){
        this.navCtrl.setRoot(HelloIonicPage);
      }
    });
  }

  submitForm() {
    this.service.addUserData(this.temp);
    this.navCtrl.setRoot(HelloIonicPage);
  }
}
