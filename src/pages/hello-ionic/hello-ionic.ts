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
import { SMS } from '@ionic-native/sms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  @ViewChild(Nav) nav: Nav;
  currentLat: any;
  currentLong: any;
  max = 10;
  current = 0;
  accidentStatus = true;
  deviceConnected;
  status;
  data = 0;
  loading: any;
  recievestatus = 0;
  connectionstatus;
  emergencyContact;
  temp = {
    name: '',
    number: ''
  };
  constructor(private bluetoothSerial: BluetoothSerial, private backgroundMode: BackgroundMode, private localNotifications: LocalNotifications, private alertCtrl: AlertController, private service: ServiceProvider, public loadingController: LoadingController, private sms: SMS, private androidPermissions: AndroidPermissions) {
    this.backgroundMode.enable();
    this.backgroundMode.setDefaults({
      title: "Background Task",
      text: "App running in background",
      resume: true,
  });
    this.service.getData();
    this.service.showData();
    this.service.emergencyContactList.subscribe(res => {
      this.emergencyContact = res;
    })
    this.service.selectedDev.subscribe(res => { this.deviceConnected = res })
    if (this.deviceConnected) {
      this.bluetoothSerial.connect(this.deviceConnected).subscribe();
      this.bluetoothSerial.subscribe('\n').subscribe(data => {
        if (data == 1 && this.recievestatus == 0) {
          this.recievestatus = this.recievestatus + 1
          if (this.currentVal <= 0) {
            this.start();
          }
        }
      })
    }
    this.service.Locations.subscribe(res=>{
      if(res.lat){
      this.showPosition({'lat':res.lat,'lng':res.lng});
      }
    });
  }
  findMe() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     this.showPosition(position);
    //   });
    // } else {
    //   alert("Geolocation is not supported by this browser.");
    // }
    this.service.startTracking();

  }

  notify() {
    this.localNotifications.schedule({
      id: 1,
      text: 'Time remaining to send sms : ' + (this.maxVal - this.currentVal).toString(),
    });
  }

  showPosition(position) {
    this.currentLat = position.lat;
    this.currentLong = position.lng;
    this.service.stopTracking();
    this.sendSms();
    this.bluetoothSerial.write('0');
  }

  start() {

    const interval = Observable.interval(100);
    interval.takeWhile(_ => !this.isFinished)
      .do(i => this.current += 0.1)
      .subscribe(res => {
        if (this.current % 5 > 4.9) {
          this.notify();
        }
        if (this.isFinished && this.accidentStatus) {
          this.findMe()
        }
      })
  }

  sendSms() {
    let message = 'Your buddy needs your help at http://maps.google.com/maps?q=' + this.currentLat + ',' + this.currentLong;
    for (let i = 0; i < this.emergencyContact.length; i++) {
      let messageGreeting = 'Hello ' + this.emergencyContact[i].Name + ',\n';
      this.sms.send(this.emergencyContact[i].Number, messageGreeting + message).then(res => { });
    }
  }
  submitForm() {
    this.service.addData(this.temp);
  }
  finish() {
    this.current = this.max;
    this.accidentStatus = true;
    this.findMe()
  }
  falseAlarm() {
    this.current = this.max;
    this.accidentStatus = false;
    this.bluetoothSerial.write('0');
  }
  reset() {
    this.current = 0;
    this.accidentStatus = true;
    this.currentLat = '';
    this.currentLong = '';
    this.recievestatus = 0;
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

  deleteConfirm(id) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete this emergency contact?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteData(id);
          }
        }
      ]
    });
    alert.present();
  }

  deleteData(id) {
    this.service.deleteData(id);
  }

  updatePrompt(id) {
    let alert = this.alertCtrl.create({
      title: 'Update',
      inputs: [
        {
          name: 'Name',
          placeholder: 'Name'
        },
        {
          name: 'Number',
          placeholder: 'Number',
          type: 'Number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Update',
          handler: data => {
            this.UpdateData(id, data);
          }
        }
      ]
    });
    alert.present();
  }
  UpdateData(id, data) {
    this.service.updateData(id, data);
  }

}