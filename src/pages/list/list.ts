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
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  devices;
  selected;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private bluetoothSerial: BluetoothSerial,private service:ServiceProvider) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
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
