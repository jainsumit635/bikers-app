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
  constructor(private bluetoothSerial: BluetoothSerial, private service: ServiceProvider, public loadingController: LoadingController, private sms: SMS) { }
  ngOnInit() {
    this.service.getData();
    this.service.showData();
    this.service.emergencyContactList.subscribe(res=>{
      this.emergencyContact=res;
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
    this.sendSms();
    this.bluetoothSerial.write('0');
  }

  start() {

    const interval = Observable.interval(100);
    interval.takeWhile(_ => !this.isFinished)
      .do(i => this.current += 0.1)
      .subscribe(res => {
        if (this.isFinished && this.accidentStatus) {
          this.findMe()
        }
      })
  }

  sendSms(){
    let message='Your buddy needs your help at http://maps.google.com/maps?q='+this.currentLat+','+this.currentLong;
    for(let i=0;i<this.emergencyContact.length;i++){
      let messageGreeting='Hello '+this.emergencyContact[i].Name+',\n';
      this.sms.send(this.emergencyContact[i].Number, messageGreeting+message).then(res=>{alert(res)});
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
}