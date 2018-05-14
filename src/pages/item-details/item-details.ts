
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Nav } from 'ionic-angular';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
import { ServiceProvider } from '../../providers/service/service';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { LoadingController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  @ViewChild(Nav) nav: Nav;
  currentLat: any;
  currentLong: any;
  max = 10;
  current = 0;
  accidentStatus = true;
  deviceConnected;
  status;
  data = 0;
  loading=0;
  recievestatus = 0;
  connectionstatus;

  constructor(private bluetoothSerial: BluetoothSerial, private service: ServiceProvider, public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams) { }
  ngOnInit() {
    // this.service.selectedDev.subscribe(res => {
    //   this.deviceConnected = res;
    // })
    // if (this.deviceConnected.length) {
    //   alert(this.deviceConnected.length);
    //   this.service.connectbluetooth(this.deviceConnected);
    //   this.service.recievedata.subscribe(data => {
    //     if (data == 1) {
    //       this.itemTapped();
    //     }
    //   });
    // this.bluetoothSerial.connect(this.deviceConnected).subscribe();
    // this.bluetoothSerial.subscribe('1').subscribe(data => {
    //   if (data == 1 && this.recievestatus == 0) {
    //     this.recievestatus = this.recievestatus + 1
    //     if (this.currentVal <= 0) {
    //       this.connectionstatus=data;
    //       this.start();
    //     }
    //   }
    // })
    // }
  }

  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
    this.bluetoothSerial.write('0')
  }

  start() {
    this.loading=1;
    const interval = Observable.interval(100);
    interval.takeWhile(_ => !this.isFinished)
      .do(i => this.current += 0.1)
      .subscribe(res => {
        if (this.isFinished && this.accidentStatus) {
          this.findMe()
        }
      })
  }

  finish() {
    this.current = this.max;
    this.accidentStatus = true;
    this.findMe()
  }
  falseAlarm() {
    this.current = this.max;
    this.accidentStatus = false;
    this.bluetoothSerial.write('0')
  }
  reset() {
    this.current = 0;
    this.accidentStatus = true;
    this.currentLat = '';
    this.currentLong = '';
    this.recievestatus = 0;
    this.navCtrl.popTo(HelloIonicPage);
  }

  get maxVal() {
    return isNaN(this.max) || this.max < 0.1 ? 0.1 : this.max
  }

  get currentVal() {
    return isNaN(this.current) || this.max < 0 ? 0 : this.current
  }

  get isFinished() {
    return this.currentVal >= this.maxVal;
  }
}
