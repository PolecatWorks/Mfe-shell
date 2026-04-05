import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-personal-data-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './personal-data-form.html',
  styleUrl: './personal-data-form.scss'
})
export class PersonalDataForm implements OnInit {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() email: string = '';
  @Input() phoneNumber: string = '';
  @Input() address: string = '';
  @Input() actions: string[] = ['submit', 'cancel'];

  @Output() actionEvent = new EventEmitter<any>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private logger: LoggerService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Correctly apply @Input values to the form if they are provided
    this.form.patchValue({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.logger.log('Personal Data Form Submitted:', this.form.value);
      this.actionEvent.emit(this.form.value);
    } else {
      this.logger.warn('Form is invalid', this.form.errors);
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.logger.log('Personal Data Form Canceled');
    this.form.reset();
  }
}
