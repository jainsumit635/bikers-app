import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  private selected = new BehaviorSubject<any>([])
  selectedDev = this.selected.asObservable();
  private Location = new BehaviorSubject<any>({})
  Locations = this.Location.asObservable();
  recievestatus = 0;
  private recievedatas = new BehaviorSubject<any>([])
  recievedata = this.recievedatas.asObservable();
  private emergencyContact = new BehaviorSubject<any>([])
  emergencyContactList = this.emergencyContact.asObservable();

  private Users = new BehaviorSubject<any>([])
  User = this.Users.asObservable();

  constructor(public backgroundGeolocation:BackgroundGeolocation, public geolocation:Geolocation, public zone: NgZone, public http: HttpClient, private bluetoothSerial: BluetoothSerial, private sqlite: SQLite) {
  }

  onDeviceChange(device) {
    this.selected.next(device)
  }
  ondatachange(data) {
    this.recievedatas.next(data);
  }

  onLocationchange(data) {
    this.Location.next(data);
  }

  onEmergencyChange(data) {
    this.emergencyContact.next(data);
  }


  onUserChange(data) {
    this.Users.next(data);
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
        .then(res => { })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }


  createLocationTable() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS accidents( ID INTEGER PRIMARY KEY AUTOINCREMENT, Latitude varchar(255), Longitude varchar(255))', {})
        .then(res => { })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }

  createUserTable() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS user( ID INTEGER PRIMARY KEY AUTOINCREMENT, Name varchar(255), Number)', {})
        .then(res => { })
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


  showUserData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * from user', {})
        .then(res => {
          if (res.rows.length > 0) {
            let temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i))
            }
            this.onUserChange(temp)
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



  addUserData(data) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('insert into user(Name,Number) Values(?,?) ', [data.name, data.number])
        .then(res => {
          this.showData();
        })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }

  addLocationData(data) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('insert into accidents(Latitude,Longitude) Values(?,?) ', [data.Latitude, data.Longitude])
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
      db.executeSql('DELETE from emergency where ID=' + data, {})
        .then(res => {
          this.showData();
        })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }

  updateData(id, data) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql("UPDATE emergency SET Name ='" + data.Name + "', Number ='" + data.Number + "' WHERE ID =" + id, {})
        .then(res => {
          this.showData();
        })
        .catch(e => alert(JSON.stringify(e)));
    }).catch(e => alert(JSON.stringify(e)));
  }


  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  startTracking() {
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };
   
    this.backgroundGeolocation.configure(config).subscribe((location) => {   
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.onLocationchange({'lat':location.latitude,'lng':location.longitude});
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
   
    }, (err) => {   
    });
   
    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();
   
   
    // Foreground Tracking
   
  let options = {
    frequency: 3000,
    enableHighAccuracy: true
  };
   
  this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
   
    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.onLocationchange({'lat':position.coords.latitude,'lng':position.coords.longitude});
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
   
  });
  
  }

  stopTracking() {
    this.backgroundGeolocation.finish();
    this.backgroundGeolocation.stop();
  this.watch.unsubscribe();
  }
}
