import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {
  myForm: FormGroup = new FormGroup({
    id: new FormControl(this.data?.id ?? null),
    title: new FormControl(this.data?.title ?? null),
    price: new FormControl(this.data?.price ?? null),
    year: new FormControl(this.data?.year ?? null),
    chip: new FormControl(this.data?.chip ?? null),
    ssd: new FormControl(this.data?.ssd ?? null),
    memory: new FormControl(this.data?.memory ?? null),
    display: new FormControl(this.data?.display ?? null),
  });

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data) this.isNew = false;
  }

  isNew: boolean = true;

  onNoClick(): void {
    this.dialogRef.close(null);
  }
  onSubmit() {
    this.data = {
      id: this.myForm.value.id,
      title: this.myForm.value.title,
      price: this.myForm.value.price,
      year: this.myForm.value.year,
      image: 'assets/images/6ac63fa27eb76bb5491a83af9b39cf46.jpg',
      configure: {
        chip: this.myForm.value.chip,
        ssd: this.myForm.value.ssd,
        memory: this.myForm.value.memory,
        display: this.myForm.value.display,
      },
    };
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {}
}