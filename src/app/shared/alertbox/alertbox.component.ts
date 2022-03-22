import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertboxService } from './alertbox.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { Router, NavigationEnd } from '@angular/router';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

const PRODUCT_DIAMONDS_KEY = 'diamonds1000';

@Component({
  selector: 'app-alertbox',
  templateUrl: './alertbox.component.html',
  styleUrls: ['./alertbox.component.css']
})
export class AlertboxComponent implements OnInit {

  alertbox: Alertbox = new Alertbox();
  placeOrig: any;
  place: any;
  passlinePlay: any;

  product: any;

  constructor(private alertboxService: AlertboxService,
    private gameboardService: GameboardService,
    private router: Router,
    private store: InAppPurchase2,
    private ref: ChangeDetectorRef) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
          this.store.verbosity = this.store.DEBUG;

          this.registerProducts();
          this.setupListeners();

          // Get the real product information
          console.log('Here: ');
          this.store.ready(() => {
            console.log('Here1: ');
            this.ref.detectChanges();
          });
        }
      }
    });
  }

  ngOnInit() {

    this.alertboxService.alertbox.subscribe((alertbox) => {
      this.alertbox = alertbox;
      if (this.alertbox.type == "2out") {
        let placeIndex = this.alertbox.bets.findIndex(x => ['ground_out', 'fly_out', 'k', 'infield_fly'].includes(x.place))
        let passlineIndex = this.alertbox.bets.findIndex(x => x.place == 'passline')
        if (placeIndex != -1) {
          this.placeOrig = this.alertbox.bets[placeIndex].place;
          switch (this.alertbox.bets[placeIndex].place) {
            case 'ground_out':
              this.place = "Ground Out";
              break;
            case 'fly_out':
              this.place = "Fly Out";
              break;
            case 'k':
              this.place = "Strike Out";
              break;
            case 'infield_fly':
              this.place = "Infield Fly";
              break;
            default:
          }
        }

        if (passlineIndex != -1) {
          switch (this.alertbox.bets[passlineIndex].button_pos) {
            case 'ground_out':
              this.passlinePlay = "Ground Out";
              break;
            case 'fly_out':
              this.passlinePlay = "Fly Out";
              break;
            case 'k':
              this.passlinePlay = "Strike Out";
              break;
            case 'infield_fly':
              this.passlinePlay = "Infield Fly";
              break;
            case 'hit':
              this.passlinePlay = "Hit";
              break;
            case 'bb':
              this.passlinePlay = "Walk";
              break;
            default:
          }
        }
      }

      console.log(this.alertbox)
    });


  }

  onKeyUp(event) {
    this.alertbox.fieldValue = event.target.value;
  }
  onSubmit(event) {
    if (this.alertbox.fieldValue != "") {
      this.alertbox.hasEvent = "check_field";
      this.alertbox.status = false;
      this.alertbox.hasField = false;
      this.alertboxService.alertbox.next(this.alertbox);

    } else {
      this.alertbox.err_msg = "Please enter value";
    }
  }
  onClose() {
    if (this.alertbox.hasEvent == "check_field") {
      this.alertbox.hasEvent = "";
    }
    this.alertbox.err_msg = "";
    this.alertbox.status = false;
    this.alertbox.hasField = false;
    this.alertbox.type = "";
    this.alertbox.hasButton = false;
    this.alertbox.hideCloseButton = false;
    this.alertbox.type = '';
    this.alertboxService.alertbox.next(this.alertbox);
  }
  removingBet = false;
  removeBet(s) {
    this.removingBet = true;
    console.log(s)
    if (s == 'passline') {
      // this.gameboardService.onAddBet(
      //   this.alertbox.currentBalls,
      //   this.alertbox.currentStrikes,
      //   'passline',
      //   0,
      //   null,
      //   null,
      //   null,
      //   true
      // );
      let data = {
        place: this.placeOrig,
        game_table: this.alertbox.game_table
      }

      this.alertboxService.removeBet(data).subscribe(r => {
        console.log(r)
        this.gameboardService.getBet();
      }).add(() => {
        setTimeout(() => {
          this.removingBet = false;
          this.onClose()
        }, 1500)
      })
    }

    if (s == 'come') {
      let data = {
        place: 'passline',
        game_table: this.alertbox.game_table
      }

      this.alertboxService.removeBet(data).subscribe(r => {
        console.log(r)
        this.gameboardService.getBet();
      }).add(() => {
        setTimeout(() => {
          this.removingBet = false;
          this.onClose()
        }, 1500)
      })
      // this.gameboardService.onAddBet(
      //   this.alertbox.currentBalls,
      //   this.alertbox.currentStrikes,
      //   this.place,
      //   0,
      //   null,
      //   null,
      //   null,
      //   true
      // );
    }

  }

  deletingAcct = false;
  removeAccount() {
    if (this.deletingAcct == false) {
      this.deletingAcct = true;
      this.alertboxService.removeAccount().subscribe(r => {
        console.log(r)
        if (r["status"] == true) {
          this.onClose()
          this.logout()
        }
      })
        .add(() => {
          this.deletingAcct = false;
        })
    }
  }

  logout() {


    localStorage.removeItem('token');
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('game_id');
    localStorage.removeItem('gameboard_view');
    localStorage.removeItem("button_pos");
    localStorage.removeItem("button_on");

    localStorage.removeItem('chip_selected');
    localStorage.removeItem('last_play_id');
    localStorage.removeItem('total_last_passline');
    localStorage.removeItem('max_pass_line_bets');
    this.router.navigate(['/login']);
  }

  addingChip = false;
  addChips() {
    if (this.addingChip == false) {
      this.addingChip = true;
      this.alertboxService.addChip().subscribe(r => {
        console.log('addChips', r)
        if (r["status"] == true) {
          this.onClose();
          this.gameboardService.getBet();
        }
      })
        .add(() => {
          this.addingChip = false;
        })
    }
  }

  addingDiamonds = false;
  addDiamonds() {
    // this.purchase(this.product);
    try {
      this.store.order(PRODUCT_DIAMONDS_KEY).then(p => {
        // Purchase in progress!
        console.log("purchase: ", p);
      }).catch(error => {
        console.log('Failed', `Failed to purchase: ${error}`)
      });
    } catch (error) {
      console.log('Error Ordering ' + JSON.stringify(error));
    }
  }

  registerProducts() {
    console.log('registerProducts: ');
    this.store.register({
      id: PRODUCT_DIAMONDS_KEY,
      type: this.store.CONSUMABLE,
    });
    this.store.refresh();
  }

  setupListeners() {
    console.log('setupListeners: ');
    // General query to all products
    this.store.when('product').approved((p: IAPProduct) => {
      // Handle the product deliverable
      if (p.id === PRODUCT_DIAMONDS_KEY) {
        console.log('Product: ', p);
        if (this.addingDiamonds == false) {
          this.addingDiamonds = true;
          this.alertboxService.addDiamond().subscribe(r => {
            console.log('addDiamonds', r)
            if (r["status"] == true) {
              this.onClose();
              this.gameboardService.getDiamonds();
            }
          })
            .add(() => {
              this.addingChip = false;
            })
        }
      }
      this.ref.detectChanges();

      return p.verify();
    })
      .verified((p: IAPProduct) => p.finish());
  }

  purchase(product: IAPProduct) {
    try {
      this.store.order(PRODUCT_DIAMONDS_KEY).then(p => {
        // Purchase in progress!
        console.log("purchase: ", p);
        if (this.addingChip == false) {
          this.addingDiamonds = true;
          this.alertboxService.addDiamond().subscribe(r => {
            console.log('addDiamonds', r)
            if (r["status"] == true) {
              this.onClose();
              this.gameboardService.getDiamonds();
            }
          })
            .add(() => {
              this.addingChip = false;
            })
        }
      }).catch(error => {
        console.log('Failed', `Failed to purchase: ${error}`)
      });
    } catch (error) {
      console.log('Error Ordering ' + JSON.stringify(error));
    }
  }

  // To comply with AppStore rules
  restore() {
    this.store.refresh();
  }

}
