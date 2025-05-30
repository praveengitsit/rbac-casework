import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormSubmissionStatus } from '../../../../core/models/form-submission-status';
import { AuthService } from '../../services/auth.service';
import { LoginUserRequest } from '../models/login-user-request';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    SpinnerComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public readonly FormSubmissionStatus = FormSubmissionStatus;

  protected loginForm: FormGroup;

  protected formSubmissionStatus: FormSubmissionStatus =
    FormSubmissionStatus.initial;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.formSubmissionStatus = FormSubmissionStatus.inProgress;

    const loginUserRequest: LoginUserRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    console.log(loginUserRequest);

    this.authService.login(loginUserRequest).subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.formSubmissionStatus = FormSubmissionStatus.success;
          this.router.navigate(['/home']);
        } else {
          this.formSubmissionStatus = FormSubmissionStatus.failure;
        }
      },
      error: (error) => {
        this.formSubmissionStatus = FormSubmissionStatus.failure;
        console.error('Login failed:', error);
      },
    });
  }
}
