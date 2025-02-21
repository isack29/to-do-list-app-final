import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';

import { CommonModule } from '@angular/common';

interface signUpForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export default class SignUpComponent {


  errorMessage: string | null = null; // Para almacenar el mensaje de error

  private _authService = inject(AuthService);

  private _formBuilder = inject(FormBuilder);

  private _router = inject(Router);

  form = this._formBuilder.group<signUpForm>({
    name: this._formBuilder.nonNullable.control('', Validators.required),
    email: this._formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.nonNullable.control('', Validators.required),
  });

  submit() {
    if (this.form.invalid) return;

    const {name , email, password } = this.form.getRawValue();
    this.errorMessage = null; // Resetear el error antes de la solicitud

    this._authService.signUp(name, email, password).subscribe({


      next: (response) => {
        this._router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.log(error); // Muestra el error en la consola para depuración

        // Verifica si la API retornó un mensaje de error
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }


        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
}
