import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throws } from 'assert';
import {  NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';
import{MatDialogConfig} from ;
@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
displayColumsn:string[] = ['name', 'category', 'description', 'price','edit'];
dataSource:any;
responseMessage:any;
  constructor(private productService:ProductService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackBar:SnackbarService,
    private router : Router
    ) { }

  ngOnInit(): void {
 this.ngxService.start();
 this.tableData();
  }



tableData(){
  this.productService.getProducts().subscribe((response:any)=>{
    this.ngxService.stop(); 
    this.dataSource = new MatTableDataSource(response);

  },(error :any)=>{
    this.ngxService.stop();
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError

    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);

  })
}


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase()
}
handleAddAction(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data ={
    action:'Add'
  }
  dialogConfig.width ="850px"
  const dialogRef=this.dialog.open(ProductComponent, dialogConfig);
  this.router.events.subscribe(()=>{
    dialogRef.close();

  })
  const sub= dialogRef.componentInstance.onAdddProduct.subscribe((response:any)=>{
    this.tableData();
  })
}

handleEditAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data ={
    action:'Edit',
    data:values
  }
  dialogConfig.width ="850px"
  const dialogRef=this.dialog.open(ProductComponent, dialogConfig);
  this.router.events.subscribe(()=>{
    dialogRef.close();

  })
  const sub= dialogRef.componentInstance.onEditProduct.subscribe((response:any)=>{
    this.tableData();
  })
}

handleDeleteAction(values:any){
const dialogConfig = new MatDialogConfig();
dialogConfig.data = {
  message:'Delete' + values.name + 'product '
};
const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(()=>{
  this.ngxService.start();
  this.deleteProduct(values.id)
  dialogRef.close();
})
}

deleteProduct(id:any){
this.productService.delete(id).subscribe((response :any)=>{
  this.ngxService.stop();
  this.tableData();
  this.responseMessage = response?.message;
  this.snackBar.openSnackBar(this.responseMessage, "success");
},(error:any)=>{
  this.ngxService.stop();
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError

    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
})
}

onChange(status:any, id:any){
var data = {
  status: status.toString(),
  id:id
}
this.productService.updateStatus(data).subscribe((response :any)=>{
  this.ngxService.stop();
  this.responseMessage = response?.message;
  this.snackBar.openSnackBar(this.responseMessage, "success");
},(error:any)=>{
  
  console.log(error);
  if(error.error?.message){
    this.responseMessage = error.error?.message;
  }
  else{
    this.responseMessage = GlobalConstants.genericError

  }
  this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
})


}
}
