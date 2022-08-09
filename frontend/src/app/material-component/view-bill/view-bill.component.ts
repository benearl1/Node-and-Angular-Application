import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import{MatDialog} from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfimationComponent } from '../dialog/confimation/confimation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import{saveAs} from 'file-saver'
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
displayedColumns:string [] = ['name','email','contact','paymentMethod', 'total','view'];
dataSource:any;
responseMessage:any;

  constructor(private billService: BillService,
    private ngxService : NgxUiLoaderService,
    private dialog: MatDialog,
    private snackBar : SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData();
  }
tableData(){
  this.billService.getBills().subscribe((response:any)=>{
    this.ngxService.stop();
    this.dataSource = new MatTableDataSource(response)
  },(error)=>{
    this.ngxService.stop();
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }else{
      this.responseMessage = GlobalConstants.genericError
    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
}
applyFilter(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.fileter = filterValue.trim().toLowerCase();
}

handleViewActions(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data={
    data:values
  }
  dialogConfig.width ="100%"
  const dialogRef = this.dialog.open(ViewBillProductsComponent,dialogConfig);
  this.router.events.subscribe(()=>
  {
    dialogRef.close();
  })
}

downloadReportAction(values:any){ 
this.ngxService.start();
var data ={
  name:values.name,
  email: values.email,
  uuid:values.uuid,
  contact:values.contact,
  paymentMethod : values.paymentMethod,
  totalAmount:values.total,
productDetails:values.productDetails
}
this.billService.getPDF(data).subscribe((response)=>{
  saveAs(response,values.uuid + '.pdf');
  this.ngxService.stop();
})

}


handleDeleteAction(values:any){
const dialogConfig = new MatDialogConfig()
dialogConfig.data ={
  message: 'delete' + values.name + ' bill'
};
const dialogRef = this.dialog.open(ConfimationComponent, dialogConfig);
const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response :any)=>{
  this.ngxService.start();
  this.deleteProduct(values.id);
  dialogRef.close();
})

}


deleteProduct(id:any){
  this.billService.delete(id).subscribe((response:any)=>{
    this.ngxService.stop();
    this.tableData();
    this.responseMessage = response?.messgae;
    this.snackBar.openSnackBar(this.responseMessage,"Success");
  },(error:any)=>{
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }else{
      this.responseMessage = GlobalConstants.genericError
    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
}




}
