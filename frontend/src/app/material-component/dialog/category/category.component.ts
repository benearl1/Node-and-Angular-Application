import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
onAddCategory = new EventEmitter();
onEditCategory = new EventEmitter();
categoryForm : any = FormGroup;
dialogAction : any = "Add"
action:any = "Add"
responseMessage:any
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private categoryService: CategoryService,
  public dialogRef : MatDialogRef<CategoryComponent>,
  private snackBar: SnackbarService,
 private formBuilder : FormBuilder ) { }

  ngOnInit(): void {
 this.categoryForm = this.formBuilder.group({
  name:[null,[Validators.required]]
 })
 if(this.dialogAction.action === 'Edit'){
  this.dialogAction = "Edit";
  this.action = "Update"
  this.categoryForm.patchValue(this.dialogData.data);

 }
  }
handleSubmit(){
  if(this.dialogAction === "Edit"){
  this.edit();
  }
  else{
    this.add();
  }
}
add(){
  var formData = this.categoryForm.value;
  var data = {
    name: formData.name,

  }
  this.categoryService.add(data).subscribe((response :any)=>{
    this.dialogRef.close();
    this.onAddCategory.emit()
    this.responseMessage = response.message;
    this.snackBar.openSnackBar(this.responseMessage,"success")
  },(error:any)=>{
this.dialogRef.close();
if(error.error?.message){
  this.responseMessage = error.error?.message
}
else{
  this.responseMessage = GlobalConstants.genericError
}
this.snackBar.openSnackBar(this.responseMessage,GlobalConstants.error)
  
  })
  
}
edit(){
  var formData = this.categoryForm.value;
  var data = {
    name: formData.name,
    id: this.dialogData.data.id
  }
  this.categoryService.update(data).subscribe((response :any)=>{
    this.dialogRef.close();
    this.onEditCategory.emit()
    this.responseMessage = response.message;
    this.snackBar.openSnackBar(this.responseMessage,"success")
  },(error:any)=>{
this.dialogRef.close();
if(error.error?.message){
  this.responseMessage = error.error?.message
}
else{
  this.responseMessage = GlobalConstants.genericError
}
this.snackBar.openSnackBar(this.responseMessage,GlobalConstants.error)
  
  })
  
}
}



