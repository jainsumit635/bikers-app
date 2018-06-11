import { Component } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ServiceProvider } from '../../providers/service/service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  devices;
  selected;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private bluetoothSerial: BluetoothSerial,private service:ServiceProvider) {
  }
  ngOnInit() {
    if (this.platform.is('cordova')) {
    this.bluetoothSerial.list().then(success => { this.devices=success });
    }
  }
  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
  selectDevice(mac){
    this.selected=mac;
    this.service.onDeviceChange(mac);
  }
}
