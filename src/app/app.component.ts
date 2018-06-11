import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { ItemDetailsPage } from '../pages/item-details/item-details';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { ServiceProvider } from '../providers/service/service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = ItemDetailsPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private androidPermissions: AndroidPermissions,
    private service: ServiceProvider
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Biker', component: HelloIonicPage },
      { title: 'Devices', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.service.createUserTable();
      this.service.showUserData();
      this.service.createLocationTable();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => {
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
          }
        });
  
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
        result => {
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
          }
        });
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
