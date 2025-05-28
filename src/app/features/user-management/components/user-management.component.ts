import { Component, OnInit } from '@angular/core';
import { User } from '../models/users';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  protected userList: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getRoleList();
  }

  public getRoleList(): void {
    this.userService.getUserList().subscribe((userList) => {
      this.userList = userList;
    });
  }
}
