import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormGroup, FormControl,
  Validators, AbstractControl, ValidationErrors,
} from '@angular/forms';
import emailjs from '@emailjs/browser';
import { MatInputModule }       from '@angular/material/input';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatRadioModule }       from '@angular/material/radio';
import { MatDatepickerModule }  from '@angular/material/datepicker';
import { MatNativeDateModule }  from '@angular/material/core';
import { MatSliderModule }      from '@angular/material/slider';
import { MatButtonModule }      from '@angular/material/button';
import { MatSelectModule }      from '@angular/material/select';
import { MatCheckboxModule }    from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule }       from '@angular/material/chips';
import { MatIconModule }        from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule }     from '@angular/material/tooltip';
import { MatDividerModule }     from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

/* ─── Validators ─── */

function alphanumericPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  if (!value) return null;
  if (!/^[a-zA-Z]/.test(value))        return { startsWithLetter: true };
  if (!/^[a-zA-Z0-9]+$/.test(value))   return { alphanumericOnly: true };
  return null;
}

function birthYearValidator(control: AbstractControl): ValidationErrors | null {
  const value: Date = control.value;
  if (!value) return null;
  if (new Date(value).getFullYear() > 2006) return { tooYoung: true };
  return null;
}

function passportValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  if (!value) return null;
  if (!/^[A-Za-z][0-9]{7}$/.test(value)) return { invalidPassport: true };
  return null;
}

/* ─── Component ─── */

@Component({
  selector: 'app-event-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatStepperModule,
  ],
  templateUrl: './event-register.component.html',
  styleUrl:    './event-register.component.css'
})
export class EventRegisterComponent implements AfterViewInit {

  submitted   = false;
  submittedData: any = null;
  hidePassword = true;
  emailSent    = false;
  emailSending = false;

  maxBirthDate     = new Date(2006, 11, 31);
  minDepartureDate = new Date();

  nationalities   = ['Filipino','American','Japanese','Korean','Australian','British','Canadian','Chinese','Singaporean','Other'];
  cabinClasses    = ['Economy','Premium Economy','Business','First Class'];
  airlines        = ['Philippine Airlines','Cebu Pacific','AirAsia Philippines','Singapore Airlines','Cathay Pacific','Emirates','Qatar Airways','Japan Airlines','Korean Air','Other'];
  mealPreferences = ['Standard','Vegetarian','Vegan','Halal','Kosher','Gluten-Free','Child Meal'];
  availableAddOns = ['Extra Baggage','Travel Insurance','Airport Lounge','Priority Boarding','Seat Upgrade','In-flight WiFi'];
  addOns: string[] = [];

  constructor(private snackBar: MatSnackBar) {}

  /* ── Lifecycle ── */

  ngAfterViewInit(): void {
    this.spawnStars();
    this.spawnClouds();
  }

  /* ── Left panel step tracker ── */

  onStepChange(event: StepperSelectionEvent): void {
    const steps = document.querySelectorAll('.left-step');
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i < event.selectedIndex) s.classList.add('done');
      if (i === event.selectedIndex) s.classList.add('active');
    });
  }

  /* ── Background spawning ── */

  spawnStars(): void {
    const el = document.getElementById('bgStars');
    if (!el) return;
    for (let i = 0; i < 110; i++) {
      const s = document.createElement('div');
      s.className = 'star-dot';
      const sz = Math.random() * 2.2 + 0.4;
      s.style.cssText = `
        left:${Math.random()*100}%;top:${Math.random()*70}%;
        width:${sz}px;height:${sz}px;border-radius:50%;background:#fff;position:absolute;
        --sd:${2+Math.random()*5}s;--sdel:${Math.random()*6}s;--sop:${0.3+Math.random()*0.7};
      `;
      el.appendChild(s);
    }
  }

  spawnClouds(): void {
    const el = document.getElementById('bgClouds');
    if (!el) return;
    const cfg: [number,number,number,number,number,number,string,string,string,string,string][] = [
      [520,180,55, -5,35,0.10,'30px','-8px', '1.03','50s','9s'],
      [380,140,62, 20,28,0.09,'-20px','6px', '1.05','42s','7s'],
      [640,200,48, 45,42,0.08,'25px','-10px','1.04','58s','11s'],
      [290,110,70, 60,22,0.12,'-15px','4px', '1.06','36s','8s'],
      [450,160,58, 72,32,0.09,'18px','-6px', '1.03','46s','10s'],
      [700,240,40,-10,50,0.06,'35px','12px', '1.02','65s','13s'],
      [320,120,75, 30,25,0.11,'-22px','8px', '1.07','38s','6s'],
      [240, 90,80, 80,20,0.13,'-10px','5px', '1.08','30s','5s'],
    ];
    cfg.forEach(([w,h,top,left,blur,op,dx,dy,ds,dur,bDur]) => {
      const c = document.createElement('div');
      c.className = 'cloud-blob';
      c.style.cssText = `
        width:${w}px;height:${h}px;top:${top}%;left:${left}%;
        --blur:${blur}px;--opacity:${op};--dx:${dx};--dy:${dy};--ds:${ds};
        --drift-dur:${dur};--breath-dur:${bDur};
      `;
      el.appendChild(c);
    });
  }

  /* ── Add-on chips ── */

  toggleAddOn(item: string): void {
    const idx = this.addOns.indexOf(item);
    idx >= 0 ? this.addOns.splice(idx, 1) : this.addOns.push(item);
  }

  isAddOnSelected(item: string): boolean {
    return this.addOns.includes(item);
  }

  /* ── Forms ── */

  personalForm = new FormGroup({
    firstName:        new FormControl('', Validators.required),
    lastName:         new FormControl('', Validators.required),
    email:            new FormControl('', [Validators.required, Validators.email]),
    password:         new FormControl('', [Validators.required, Validators.minLength(8), alphanumericPasswordValidator]),
    gender:           new FormControl('', Validators.required),
    birthDate:        new FormControl<Date | null>(null, [Validators.required, birthYearValidator]),
    nationality:      new FormControl('', Validators.required),
    passportNo:       new FormControl('', [Validators.required, passportValidator]),
    passportExpiry:   new FormControl<Date | null>(null, Validators.required),
    contactNumber:    new FormControl('', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]),
    emergencyContact: new FormControl('', Validators.required),
    emergencyPhone:   new FormControl('', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]),
  });

  flightForm = new FormGroup({
    flightNumber:   new FormControl('', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{3,4}$/)]),
    airline:        new FormControl('', Validators.required),
    origin:         new FormControl('', Validators.required),
    destination:    new FormControl('', Validators.required),
    departureDate:  new FormControl<Date | null>(null, Validators.required),
    cabinClass:     new FormControl('', Validators.required),
    seatPreference: new FormControl(''),
    mealPreference: new FormControl(''),
    baggageWeight:  new FormControl(20),
  });

  prefsForm = new FormGroup({
    specialAssistance: new FormControl(false),
    travelInsurance:   new FormControl(false),
    agreeToTerms:      new FormControl(false, Validators.requiredTrue),
  });

  get p()  { return this.personalForm.controls; }
  get f()  { return this.flightForm.controls; }
  get pr() { return this.prefsForm.controls; }

  /* ── Error helpers ── */

  getPasswordError(): string {
    const c = this.p['password'];
    if (c.hasError('required'))         return 'Password is required';
    if (c.hasError('minlength'))        return 'Minimum 8 characters required';
    if (c.hasError('startsWithLetter')) return 'Must start with a letter';
    if (c.hasError('alphanumericOnly')) return 'Only letters and numbers allowed';
    return '';
  }

  getBirthDateError(): string {
    const c = this.p['birthDate'];
    if (c.hasError('required')) return 'Date of birth is required';
    if (c.hasError('tooYoung')) return 'Must be born in 2006 or earlier';
    return '';
  }

  getPassportError(): string {
    const c = this.p['passportNo'];
    if (c.hasError('required'))        return 'Passport number is required';
    if (c.hasError('invalidPassport')) return 'Format: 1 letter + 7 digits (e.g. P1234567)';
    return '';
  }

  getFlightNoError(): string {
    const c = this.f['flightNumber'];
    if (c.hasError('required')) return 'Flight number is required';
    if (c.hasError('pattern'))  return 'Format: 2 letters + 3-4 digits (e.g. PR102)';
    return '';
  }

  /* ── Submit ── */

  onSubmit(): void {
    this.personalForm.markAllAsTouched();
    this.flightForm.markAllAsTouched();
    this.prefsForm.markAllAsTouched();

    if (this.personalForm.valid && this.flightForm.valid && this.prefsForm.valid) {
      this.submitted = true;
      this.emailSent = false;

      this.submittedData = {
        ...this.personalForm.value,
        ...this.flightForm.value,
        ...this.prefsForm.value,
        addOns: [...this.addOns],
      };

      this.sendEmailTicket();

      this.snackBar.open('✈️ Registration Complete! Ticket sent to your email.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });

      setTimeout(() => {
        const el = document.querySelector('.success-card');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } else {
      this.snackBar.open('⚠️ Please complete all required fields.', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  /* ── Print Ticket ── */

  printTicket(): void {
    window.print();
  }

  /* ── Email Ticket ── */

 sendEmailTicket(): void {
  if (!this.submittedData || this.emailSending || this.emailSent) return;

  this.emailSending = true;

  // ⚠️ Double check these IDs in your EmailJS Dashboard
  const SERVICE_ID  = 'service_u7spodb';
  const TEMPLATE_ID = 'template_fpxdagk';
  const PUBLIC_KEY  = '2VHXjoxjXW7ujveAB';

    const templateParams = {
      to_name:     `${this.submittedData.firstName} ${this.submittedData.lastName}`,
      to_email:    this.submittedData.email, // Ensure this matches {{to_email}} in your template
      flight_no:   this.submittedData.flightNumber,
      airline:     this.submittedData.airline,
      origin:      this.submittedData.origin,
      destination: this.submittedData.destination,
      cabin:       this.submittedData.cabinClass,
      seat:        this.submittedData.seatPreference || 'No Preference',
      baggage:     `${this.submittedData.baggageWeight} kg`,
      passport:    this.submittedData.passportNo,
      departure:   this.submittedData.departureDate
        ? new Date(this.submittedData.departureDate).toDateString()
        : '—',
      addons:      this.submittedData.addOns?.join(', ') || 'None',
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      this.emailSending = false;
      this.emailSent    = true;
      this.snackBar.open(`📧 Ticket sent to ${this.submittedData.email}`, 'Close', { duration: 5000 });
    })
    .catch((err) => {
      this.emailSending = false;
      console.error('FAILED...', err);
      this.snackBar.open('❌ Email failed to send.', 'Dismiss', { duration: 5000 });
    });
}}
