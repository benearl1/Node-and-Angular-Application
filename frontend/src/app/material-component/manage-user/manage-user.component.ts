import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  displayedColumns:string [] = ['name','email','contact','status'];
  dataSource:any;
  responseMessage:any;
  constructor(
    private ngxService : NgxUiLoaderService,
   private userService: UserService,
    private snackBar : SnackbarService,
    ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }



  tableData(){
    this.userService.getUsers().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response)
    },(error:any)=>{
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

  handleChangeAction(status:any, id:any){
this.ngxService.start();
var data ={
  status: status.toString(),
  id: id,
}
this.userService.update(data).subscribe((response:any)=>{
  this.ngxService.stop();
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
