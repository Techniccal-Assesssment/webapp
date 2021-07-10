import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private userService: UsersService,
    public dialog: MatDialog) { }

    //table columns
  displayedColumns: string[] = ['name', 'lastname', 'email', 'contact', 'actions'];
  dataSource: any;
  users = [];
  noOfUsers = 0;

  private paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  private sort: MatSort;
  @ViewChild(MatSort, { static: false }) set MatSort(ms: MatSort) {
    this.sort = ms;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  //getting the users from the server
  private getUsers() {
    this.users = [];
    this.userService.getUsers().subscribe(results => {
      if (results) {
        //counting the number of users to increment the id
        this.noOfUsers = results.data.length;
        results.data.forEach(user => {
          this.users.push(user);
        });
        //sort users by id
        this.users.sort((a,b) => a.id - b.id);
        //populating the table
        this.dataSource = new MatTableDataSource<user>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  addNew() {
    //adding new user
    this.dialog.open(AddUserDialog, {
      height: 'auto',
      width: '900px',
      disableClose: true,
      data: {
        'noOfUsers': this.noOfUsers
      }
    }).afterClosed().subscribe(() => this.getUsers());

  }

  editUser(id) {
    //get user by id
    this.userService.getUserById(id).subscribe(results => {

      if (results) {

        this.dialog.open(AddUserDialog, {
          height: 'auto',
          width: '900px',
          disableClose: true,
          //passing user details to the modal
          data: {
            'id': results.data[0].id,
            'name': results.data[0].name,
            'lastname': results.data[0].lastname,
            'email': results.data[0].email,
            'contact': results.data[0].contact
          } //refresh when modal closes
        }).afterClosed().subscribe(() => this.getUsers());
      }
    });
  }

}

//manage users component
@Component({
  selector: 'addUserDialog',
  templateUrl: 'addUserDialog.html',
})

export class AddUserDialog implements OnInit {

  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  userForm: FormGroup;
  modalData: any;
  userId = 0;
  submitted = false;
  noOfUsers = 0;

  ngOnInit() {

    if (this.data) {

      if (this.data.noOfUsers) {
        //adding a new user
        this.noOfUsers = this.data.noOfUsers;
        this.userForm = this.formBuilder.group({
          name: ['', Validators.required],
          lastname: ['', Validators.required],
          email: ['', Validators.required],
          contact: ['', Validators.required],
        });

      } else {
        //populating the user details on update
        this.userId = this.data.id;
        this.userForm = this.formBuilder.group({
          name: [this.data.name, Validators.required],
          lastname: [this.data.lastname, Validators.required],
          email: [this.data.email, Validators.required],
          contact: [this.data.contact, Validators.required]
        });
      }
    }
  }

  //field validations
  get fields() { return this.userForm.controls; }

  closeModal() {
    this.dialog.closeAll();
  }

  saveUser() {

    this.submitted = true;
    //check if form is valid
    if (this.userForm.invalid) {
      return;
    }

    const userObject = {
      'id': this.noOfUsers + 1,
      'name': this.userForm.value.name,
      'lastname': this.userForm.value.lastname,
      'email': this.userForm.value.email,
      'contact': this.userForm.value.contact,
    }

    //update
    if (this.userId > 0) {

      userObject['id'] = this.userId;
    
      this.userService.updateUser(userObject).subscribe(results => {

        if (results) {
          this.dialog.closeAll();
          alert('Successfully updated')
        }
      }, error => {
        this.dialog.closeAll();
      })

    } else {
      //new user
      this.userService.createUser(userObject).subscribe(results => {

        if (results) {
          this.dialog.closeAll();
          alert('Successfully created')
        }
      }, error => {
        this.dialog.closeAll();
      })
    }


  }

}

export interface user {
  id: number;
  name: string;
  lastname: string;
  email: string;
  contact: string;
}
