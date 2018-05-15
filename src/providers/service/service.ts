import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  private selected = new BehaviorSubject<any>([])
  selectedDev = this.selected.asObservable();
  recievestatus = 0;
  private recievedatas = new BehaviorSubject<any>([])
  recievedata = this.recievedatas.asObservable();
  private emergencyContact = new BehaviorSubject<any>([])
  emergencyContactList = this.emergencyContact.asObservable();
  constructor(public http: HttpClient, private bluetoothSerial: BluetoothSerial, private sqlite: SQLite) {
  }

  onDeviceChange(device) {
    this.selected.next(device)
  }
  ondatachange(data) {
    this.recievedatas.next(data);
  }
  onEmergencyChange(data) {
    this.emergencyContact.next(data);
  }

  connectbluetooth(mac) {
    this.bluetoothSerial.connect(mac).subscribe();
    this.bluetoothSerial.subscribe('1').subscribe(data => {
      if (data == 1 && this.recievestatus == 0) {
        this.recievestatus = this.recievestatus + 1
        this.ondatachange(data);
      }
    })
  }


  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS emergency( ID INTEGER PRIMARY KEY AUTOINCREMENT, Name varchar(255), Number)', {})
        .then(res => {})
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }

  showData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * from emergency', {})
        .then(res => {
          if (res.rows.length > 0) {
            let temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i))
            }
            this.onEmergencyChange(temp)
          }
        })
        .catch(e => alert(e));
    }).catch(e => alert(e));
  }

  addData(data) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('insert into emergency(Name,Number) Values(?,?) ', [data.name, data.number])
        .then(res => {
          this.showData();
        })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }

  deleteData(data) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE from emergency where ID='+data,{})
        .then(res => {
          this.showData();
        })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }

  updateData(id,data) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql("UPDATE emergency SET Name ='" + data.Name + "', Number ='"+ data.Number +"' WHERE ID ="+id,{})
        .then(res => {
          this.showData();
        })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }

}
