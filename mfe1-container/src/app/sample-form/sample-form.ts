import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'sample-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './sample-form.html',
  styleUrl: './sample-form.scss'
})
export class SampleForm implements OnInit {
  form: FormGroup;
  parametersList: string[] = ['Option A', 'Option B', 'Option C', 'Option D'];

  constructor(
    private fb: FormBuilder,
    private logger: LoggerService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      contactDetails: ['', Validators.required],
      parameters: [[]] // Using array for multiple selection, or string for single
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.logger.log('Sample Form Submitted:', this.form.value);
      // Fallback for immediate visibility in case logger is disabled
      console.log('Sample Form Submitted:', this.form.value);
    } else {
      this.logger.warn('Form is invalid', this.form.errors);
    }
  }
}
