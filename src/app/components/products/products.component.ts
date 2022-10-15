import { BasketComponent } from './../basket/basket.component';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
import { ProductsService } from './../../services/products.service';
import { IProducts } from './../../models/products';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: IProducts[];
  productsSubscription: Subscription;
  canEdit: boolean = false;
  basket: IProducts[];
  basketSubscription: Subscription;

  constructor(
    private productsService: ProductsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.canEdit = true;
    this.productsSubscription = this.productsService
      .getProducts()
      .subscribe((data) => {
        this.products = data;
      });

    this.basketSubscription = this.productsService
      .getProductsToBasket()
      .subscribe((data) => (this.basket = data));
  }

  addToBasket(product: IProducts) {
    product.quantity = 1;
    let findItem;
    if (this.basket.length > 0) {
      findItem = this.basket.find((item) => item.id === product.id);
      if (findItem) this.updateToBasket(findItem);
      else this.postToBasket(product);
    } else this.postToBasket(product);
  }

  postToBasket(product: IProducts) {
    this.productsService
      .postProductToBasket(product)
      .subscribe((data) => this.basket.push(data));
  }

  updateToBasket(product: IProducts) {
    product.quantity += 1;
    this.productsService.updateProductToBasket(product).subscribe((data) => {});
  }

  openDialog(product?: IProducts): void {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.disableClose = true;
    dialogConfig.data = product;
    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data && data.id) {
          this.editProduct(data);
        } else this.postData(data);
      }
    });
  }

  postData(data: IProducts) {
    this.productsService
      .postProduct(data)
      .subscribe((data) => this.products.push(data));
  }

  editProduct(product: IProducts) {
    this.productsService.updateProduct(product).subscribe((data) => {
      this.products = this.products.map((product) => {
        if (product.id === data.id) return data;
        else return product;
      });
    });
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).subscribe(() =>
      this.products.find((item) => {
        if (id === item.id) {
          let idx = this.products.findIndex((data) => data.id === id);
          this.products.splice(idx, 1);
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe;
    }
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe;
    }
  }
}
