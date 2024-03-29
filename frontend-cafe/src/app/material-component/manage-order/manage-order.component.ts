import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit {
  displayColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmoung: number = 0;
  responseMessage: any;
  constructor(private formBuiler: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackBar: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategory();
    this.manageOrderForm = this.formBuiler.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRgex)]],
      contact: [null, [Validators.required, Validators.pattern(GlobalConstants.contactRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],

    })
  }
  getCategory() {
    this.categoryService.getCategory().subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.contorls['price'].setValue('');
      this.manageOrderForm.contorls['quantity'].setValue('');
      this.manageOrderForm.contorls['total'].setValue(0);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.manageOrderForm.contorls['price'].setValue(response.price);
      this.manageOrderForm.contorls['quantity'].setValue('1');
      this.manageOrderForm.contorls['total'].setValue(this.price * 1);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.contorls['quantity'].value
    if (temp > 0) {
      this.manageOrderForm.contorls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.contorls['price'].value);

    } else if (temp != '') {
      this.manageOrderForm.contorls['quantity'].setValue('1');
      this.manageOrderForm.contorls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.contorls['price'].value);
    }

  }

  validateProductsAdd() {
    if (this.manageOrderForm.conrtols['total'].value === 0 || this.manageOrderForm.contorls['total'].value === null || this.manageOrderForm.contorls['quantity'].value <= 0) {
      return true;
    } else {
      return false
    }
  }
  validateSubmit() {
    if (this.totalAmoung === 0 || this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contact'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !(this.manageOrderForm.controls['contact'].valid) ||
      !(this.manageOrderForm.controls['email'].valid)) {
      return true;
    } else {
      return false
    }
  }
  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number; }) => e.id == formData.product.id);
    if (productName === undefined) {
      this.totalAmoung = this.totalAmoung + formData.total
      this.dataSource.push({
        id: formData.product.id, name: formData.product.name, category: formData.category.name,
        quantity: formData.quantity, price: formData.price.price, total: formData.total
      })
      this.dataSource =[...this.dataSource]
      this.snackBar.openSnackBar(GlobalConstants.productAdded,"success");
    } else {
      this.snackBar.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value:any,element:any){
this.totalAmoung = this.totalAmoung -element.total;
this.dataSource.splic(value,1);
this.dataSource = [...this.dataSource];
  }

submitAction(){
  this.ngxService.start()
  var formData = this.manageOrderForm.value;
  var data = {
    name:formData.name,
    email:formData.email,
    contact:formData.contact,
    paymentMethod:formData.paymentMethod,
    totalAmoung:this.totalAmoung,
    productDetails:JSON.stringify(this.dataSource)
  }
  this.billService.generateReport(data).subscribe((response: any)=>{
    this.downloadFile(response?.uuid);
    this.manageOrderForm.reset();
    this.dataSource =[];
    this.totalAmoung = 0;
  },(error:any)=>{
    this.ngxService.stop();
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
}
downloadFile(fileName:any){
var data  = {
  uuid:fileName
}
this.billService.getPDF(data).subscribe((response : any)=>{
  saveAs(response,fileName+'.pdf');
  this.ngxService.stop()
})
}
}
